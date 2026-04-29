#!/bin/bash
chmod +x scripts/install.sh
chmod +x scripts/start.sh

cd /home/ec2-user/app

npm install
npm install -g tsx
npm install -g pm2
