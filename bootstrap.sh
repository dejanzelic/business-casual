#!/usr/bin/env bash

#update and prepare dependencies 
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y curl

if curl -s http://instance-data.ec2.internal; then
	is_aws=true
	app_home="/var/www/chittychat"
else
	app_home="/vagrant"
fi

# Install Node
if command -v node; then
	echo "Node is already installed"
else
	curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
	apt-get install -y nodejs
fi

if [ "$is_aws" = true ]; then
	echo "Running on AWS"
	sudo apt-get install awscli -y
	mkdir -p /var/www/chittychat
	aws s3 --recursive cp s3://appsecusa-7d2b277154db/source/chitty_chat/ /var/www/chittychat/
fi

if ! [ -L $app_home/node_modules ]; then
	cd $app_home && npm install 
fi

#if in AWS, run the application and redirect 80 to 8080
if [ "$is_aws" = true ]; then
	npm install -g pm2
	pm2 start $app_home/app.js
	iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
fi

