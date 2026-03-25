from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv
from starknet_py.net import AccountClient
from starknet_py.net.models import StarknetChainId
from starknet_py.contract import Contract
from starknet_py.net.signer.stark_curve_signer import StarkCurveSigner

load_dotenv()

app = FastAPI(title="CloakPay Backend")

# Load from environment
STARKNET_RPC_URL = os.getenv("STARKNET_RPC_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
ACCOUNT_ADDRESS = os.getenv("ACCOUNT_ADDRESS")
SHIELDED_POOL_ADDRESS = os.getenv("SHIELDED_POOL_ADDRESS")

if not all([STARKNET_RPC_URL, PRIVATE_KEY, ACCOUNT_ADDRESS]):
    raise ValueError("Missing required environment variables")

class PayrollEntry(BaseModel):
    employee_address: str
    amount: int

class PayrollRequest(BaseModel):
    entries: List[PayrollEntry]

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/create-payroll")
async def create_payroll(request: PayrollRequest):
    """
    Create private vouchers for payroll distribution
    """
    try:
        # Initialize Starknet client
        signer = StarkCurveSigner(PRIVATE_KEY, ACCOUNT_ADDRESS, StarknetChainId.SEPOLIA)
        client = AccountClient(STARKNET_RPC_URL, signer)

        # Load contract
        # For now, assume contract is deployed
        # contract = await Contract.from_address(
        #     address=SHIELDED_POOL_ADDRESS,
        #     client=client
        # )

        # In real implementation:
        # - Generate ZK proofs for vouchers
        # - Call contract.create_voucher() for each entry
        # - Use Merkle trees for efficient verification

        vouchers = []
        for entry in request.entries:
            # Placeholder: in real implementation, interact with contract
            voucher = {
                "employee": entry.employee_address,
                "amount": entry.amount,
                "proof": "placeholder_zk_proof"
            }
            vouchers.append(voucher)

        return {"vouchers": vouchers, "status": "created"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/pool-balance")
async def get_pool_balance():
    """
    Get total balance in shielded pool
    """
    try:
        # Initialize client
        signer = StarkCurveSigner(PRIVATE_KEY, ACCOUNT_ADDRESS, StarknetChainId.SEPOLIA)
        client = AccountClient(STARKNET_RPC_URL, signer)

        # Load contract and call get_total_deposits
        # Placeholder
        return {"total_balance": 0}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
            voucher = {
                "employee": entry.employee_address,
                "amount": entry.amount,
                "voucher_id": f"voucher_{len(vouchers)}"
            }
            vouchers.append(voucher)

        return {"vouchers": vouchers, "message": "Payroll vouchers created successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/voucher/{voucher_id}")
async def get_voucher(voucher_id: str):
    """
    Get voucher details (for employee verification)
    """
    # In real implementation, query the contract
    return {
        "voucher_id": voucher_id,
        "employee": "0xEMPLOYEE_ADDRESS",
        "amount": 1000,
        "claimed": False
    }
