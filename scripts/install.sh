#!/bin/bash
set -e

export NVM_DIR="/home/ec2-user/.nvm"

if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
fi

if ! command -v node &> /dev/null; then
  echo "Node not found, installing..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  . "$NVM_DIR/nvm.sh"
  nvm install 20
  nvm use 20
fi

cd /home/ec2-user/app

chown -R ec2-user:ec2-user /home/ec2-user/app || true

npm install
sudo npm install -g tsx
sudo npm install -g pm2
