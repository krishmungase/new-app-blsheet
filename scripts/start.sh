#!/bin/bash
set -e

cd /home/ec2-user/app/api-blsheet

pm2 delete all || true
pm2 start "npx tsx api/index.ts" --name blsheet-backend
pm2 save
