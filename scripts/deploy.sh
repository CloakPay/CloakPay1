#!/bin/bash
set -e

# Load environment
source ../.env

# Build contracts
cd ..
scarb build

# Deploy ShieldedPool
echo "Deploying ShieldedPool..."
DEPLOY_RESULT=$(sncast deploy --contract-name ShieldedPool --rpc-url $STARKNET_RPC_URL --account $ACCOUNT_ADDRESS --private-key $PRIVATE_KEY)

# Extract contract address
SHIELDED_POOL_ADDRESS=$(echo $DEPLOY_RESULT | grep -oP 'contract_address: \K[0-9a-fx]+')

echo "ShieldedPool deployed at: $SHIELDED_POOL_ADDRESS"

# Update .env
sed -i "s/SHIELDED_POOL_ADDRESS=.*/SHIELDED_POOL_ADDRESS=$SHIELDED_POOL_ADDRESS/" .env

echo "Deployment complete!"