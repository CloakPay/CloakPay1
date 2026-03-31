#!/usr/bin/env bash
set -euo pipefail

# Ensure we are in the repository root
cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "==> Installing Starknet Foundry"
curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/scripts/install.sh | sh
source /home/vscode/.bashrc
snfoundryup

echo "==> Installing Scarb"
curl -L https://github.com/software-mansion/scarb/releases/download/v2.8.5/scarb-v2.8.5-x86_64-unknown-linux-musl.tar.gz | tar -xz
sudo mv scarb-v2.8.5-x86_64-unknown-linux-musl/bin/scarb /usr/local/bin/

echo "==> Creating Python venv"
python3 -m venv .venv
source .venv/bin/activate

echo "==> Upgrading pip + installing dependencies"
python -m pip install --upgrade pip
python -m pip install --timeout=60 -r requirements.txt

echo "==> Done. Activate the venv with: source .venv/bin/activate"
