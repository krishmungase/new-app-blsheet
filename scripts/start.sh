#!/bin/bash
set -e

cd /home/ec2-user/app/api-blsheet

pm2 delete all || true

# Start in background properly
pm2 start "npx tsx api/index.ts" --name blsheet-backend --no-autorestart

pm2 save

# IMPORTANT: exit cleanly so CodeDeploy continues
exit 0
