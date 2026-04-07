#!/bin/bash

# PLS Game Club - Server Auto-Setup Script
# Target: Ubuntu 24.04 (DigitalOcean)

echo "🚀 PLS Game Club serverini sozlash boshlandi..."

# 1. Update System
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js & NPM
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential

# 3. Install PM2 (Process Manager)
sudo npm install -g pm2

# 4. Use Current Directory
# We assume the user is already inside the project folder
# cd ~/pls-game-club # Removed fixed path

# 5. Clone Repository (Assuming public or handled by user)
# If repo is already cloned, skip this or copy files.
# For now, we assume we want to pull latest changes.
# git clone https://github.com/bespobobo-ctrl/PLS.git .

echo "📦 Kutubxonalarni o'rnatish..."
npm install express cors body-parser telegraf

# 6. Start Services
echo "🎬 Server va Botni ishga tushirish..."
pm2 start server.js --name "pls-backend"
pm2 start bot/index.js --name "pls-bot"

# 7. Setup firewall
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3001
sudo ufw --force enable

# 8. Save PM2 processes
pm2 save
sudo pm2 startup | tail -n 1 | bash

echo "✅ HAMMASI TAYYOR!"
echo "Backend porti: 3001"
echo "Bot PM2 orqali ishlamoqda."
pm2 list
