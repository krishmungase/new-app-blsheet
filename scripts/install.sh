#!/bin/bash
set -e

cd /home/ec2-user/app

npm install

# install globally for ec2-user (NOT sudo)
npm install -g tsx
npm install -g pm2

# ensure pm2 is in PATH
export PATH=$PATH:/usr/local/bin
