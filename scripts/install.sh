#!/bin/bash
set -e

# Load environment
source /etc/profile || true
export NVM_DIR="/home/ec2-user/.nvm"

# Load nvm if exists
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
fi

# Ensure Node is available
if ! command -v node &> /dev/null
then
  echo "Node not found, installing..."

  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  . "$NVM_DIR/nvm.sh"

  nvm install 20
  nvm use 20
fi

# Go to app directory
cd /home/ec2-user/app

# Fix permissions
chown -R ec2-user:ec2-user /home/ec2-user/app

# Install dependencies
npm install

# Global tools
npm install -g tsx
npm install -g pm2
