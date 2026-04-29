#!/bin/bash
set -e

# load env
source /etc/profile
export PATH=$PATH:/usr/local/bin

cd /home/ec2-user/app/api-blsheet

# debug (VERY IMPORTANT)
echo "Node version:"
node -v
echo "NPM version:"
npm -v
echo "PM2 version:"
pm2 -v

# stop old
pm2 delete all || true

# ✅ FIX: avoid npx, use direct tsx
tsx api/index.ts &

# save pm2 state (optional)
pm2 save || true

exit 0
