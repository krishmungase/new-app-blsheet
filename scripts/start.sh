#!/bin/bash
cd /home/ec2-user/app

pm2 delete all || true
pm2 start "npx tsx index.ts" --name blsheet-api

pm2 save
