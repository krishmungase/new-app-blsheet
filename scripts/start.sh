#!/bin/bash
set -e

cd /home/ec2-user/app

pm2 delete all || true
pm2 start --interpreter tsx src/index.ts --name blsheet-backend
pm2 save
