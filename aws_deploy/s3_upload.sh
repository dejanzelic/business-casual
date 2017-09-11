#/bin/bash
aws s3 --recursive cp ../ s3://appsecusa-7d2b277154db/source/business_casual --exclude "node_modules/*" --exclude "screenshots/*" --exclude ".git/*" --exclude ".vagrant/*"
