#!/usr/bin/env bash

#update and prepare dependencies 
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install curl gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget -y

app_home="/vagrant"

# Install Node
if command -v node; then
	echo "Node is already installed"
else
	curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
	apt-get install -y nodejs
fi

mkdir $app_home/business_casual/screenshots
if ! [ -L $app_home/node_modules ]; then
	cd $app_home && npm install 
fi

#if in prod, run the application and redirect 80 to 8080
npm install -g pm2
pm2 start $app_home/bin/www
iptables -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 8080
echo '127.0.0.1 business-casual.mysterious-hashes.net' >> /etc/hosts 
