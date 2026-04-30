#!/bin/bash
set -e

export NVM_DIR="/home/ec2-user/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
fi

export PATH=$PATH:/usr/local/bin

cd /home/ec2-user/app

pm2 delete all || true

pm2 start "npx tsx index.ts" --name blsheet-backend

pm2 save

exit 0
