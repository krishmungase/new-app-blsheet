#!/bin/bash
set -e

echo "Starting install phase..."

if ! command -v node &> /dev/null; then
  echo "Node not found, installing..."
  curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
  yum install -y nodejs
fi

export PATH=$PATH:/usr/bin:/usr/local/bin

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

cd /home/ec2-user/app

chown -R ec2-user:ec2-user /home/ec2-user/app

npm install

sudo npm install -g tsx || true
sudo npm install -g pm2 || true

echo "Install phase completed"
