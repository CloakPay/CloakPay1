import json
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv


from starknet_py.net.full_node_client import FullNodeClient
from starknet_py.net.account.account import Account
from starknet_py.net.signer.stark_curve_signer import KeyPair
from starknet_py.contract import Contract
from starknet_py.net.models import StarknetChainId

# Load environment variables
load_dotenv()

app = FastAPI(title="CloakPay API", version="1.0.0")

# 1. Configuration from .env
STARKNET_RPC_URL = os.getenv("STARKNET_RPC_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
ACCOUNT_ADDRESS = os.getenv("ACCOUNT_ADDRESS")
SHIELDED_POOL_ADDRESS = os.getenv("SHIELDED_POOL_ADDRESS")
PAYROLL_VOUCHERS_ADDRESS = os.getenv("PAYROLL_VOUCHERS_ADDRESS")

# Validate environment
if not all([STARKNET_RPC_URL, PRIVATE_KEY, ACCOUNT_ADDRESS, PAYROLL_VOUCHERS_ADDRESS]):
    raise ValueError("❌ Missing required environment variables in .env")

# 2. Setup Starknet Client and Account
client = FullNodeClient(node_url=STARKNET_RPC_URL)
key_pair = KeyPair.from_private_key(int(PRIVATE_KEY, 16))
account = Account(
    address=int(ACCOUNT_ADDRESS, 16),
    client=client,
    key_pair=key_pair,
    chain=StarknetChainId.SEPOLIA,
)

# 3. Pydantic Models for API Requests
class PayrollEntry(BaseModel):
    employee_address: str
    amount: int

class PayrollRequest(BaseModel):
    entries: List[PayrollEntry]

# --- Helper function to load ABI ---
def get_abi(contract_name: str):
    # Adjust this path based on your actual target filename
    path = f"../target/dev/cloakpay_{contract_name}.contract_class.json"
    try:
        with open(path, "r") as f:
            data = json.load(f)
            return data["abi"]
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail=f"ABI file not found at {path}. Run 'scarb build' first.")

# --- API Endpoints ---

@app.get("/health")
def health():
    return {"status": "ok", "network": "Starknet Sepolia"}

@app.get("/pool-balance")
async def get_pool_balance():
    """Reads the total deposits from the Shielded Pool contract."""
    try:
        abi = get_abi("ShieldedPool")
        contract = Contract(
            address=int(SHIELDED_POOL_ADDRESS, 16),
            abi=abi,
            provider=account
        )
        
        # Call the Cairo function
        result = await contract.functions["get_total_deposits"].call()
        return {"total_balance": result.total_deposits, "unit": "wei"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain Error: {str(e)}")

@app.post("/create-payroll")
async def create_payroll(request: PayrollRequest):
    """Triggers 'create_voucher' on-chain for each employee entry."""
    try:
        abi = get_abi("PayrollVouchers")
        contract = Contract(
            address=int(PAYROLL_VOUCHERS_ADDRESS, 16),
            abi=abi,
            provider=account
        )
        
        receipts = []
        for entry in request.entries:
            # Send transaction
            invocation = await contract.functions["create_voucher"].invoke(
                employee=int(entry.employee_address, 16),
                amount=entry.amount,
                auto_estimate=True # Automatically calculate gas fees
            )
            
            receipts.append({
                "employee": entry.employee_address,
                "tx_hash": hex(invocation.hash)
            })

        return {
            "message": "Payroll distribution initiated",
            "transactions": receipts,
            "status": "pending"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transaction Failed: {str(e)}")

@app.get("/voucher/{voucher_id}")
async def get_voucher(voucher_id: int):
    """Fetch specific voucher status from the Cairo contract."""
    try:
        abi = get_abi("PayrollVouchers")
        contract = Contract(
            address=int(PAYROLL_VOUCHERS_ADDRESS, 16),
            abi=abi,
            provider=account
        )
        
        amount = await contract.functions["get_voucher_amount"].call(voucher_id)
        claimed = await contract.functions["is_claimed"].call(voucher_id)
        
        return {
            "voucher_id": voucher_id,
            "amount": amount.amount,
            "is_claimed": claimed.is_claimed
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))