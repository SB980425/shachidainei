#!/bin/bash
# Prediction Market MM Bot - Server Setup Script
# Target: Ubuntu 24.04 LTS
set -e

echo "=== [1/5] System Update ==="
sudo apt-get update -qq
sudo apt-get install -y -qq python3 python3-pip python3-venv git > /dev/null 2>&1

echo "=== [2/5] Create Project Directory ==="
mkdir -p ~/mm-bot/logs
cd ~/mm-bot

echo "=== [3/5] Python Virtual Environment ==="
python3 -m venv venv
source venv/bin/activate

echo "=== [4/5] Install Dependencies ==="
pip install --upgrade pip -q
pip install -q py-clob-client numpy scipy pyyaml python-dotenv websockets

echo "=== [5/5] Setup Systemd Service ==="
sudo tee /etc/systemd/system/mm-bot.service > /dev/null <<'UNIT'
[Unit]
Description=Prediction Market MM Bot
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/mm-bot
ExecStart=/home/ubuntu/mm-bot/venv/bin/python main.py
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
UNIT

sudo systemctl daemon-reload
sudo systemctl enable mm-bot

echo ""
echo "=== Deploy Complete ==="
echo "Next steps:"
echo "  1. Edit ~/mm-bot/.env with your private key and markets"
echo "  2. sudo systemctl start mm-bot"
echo "  3. sudo journalctl -u mm-bot -f  (view logs)"
