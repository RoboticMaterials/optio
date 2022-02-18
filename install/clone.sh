#!/usr/bin/bash

if [ -z $1 ]; then
	echo "Parameter missing. Usage ./clone.sh domainname"
	exit
fi


echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

sudo apt update
sudo apt upgrade

sudo rm /etc/nginx/sites-enabled/client-config
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-enabled
sudo systemctl restart nginx


# Install certbot
echo "Installing Certbot"
sudo certbot certonly --nginx  --register-unsafely-without-email 
sudo setfacl -R -m g:www-data:rX /etc/letsencrypt/live/$1
sudo setfacl -R -m g:www-data:rX /etc/letsencrypt/archive/$1
sudo setfacl -m g:www-data:rX /etc/letsencrypt/live
sudo setfacl -m g:www-data:rX /etc/letsencrypt/archive
sudo rm -r /etc/letsencrypt/live/temp.optio.cloud
sudo rm -r /etc/letsencrypt/archive/temp.optio.cloud

# Configure Nginx
sed -i "s/{###Instance###}/$1/g" client-config
sudo cp client-config /etc/nginx/sites-enabled
sudo rm /etc/nginx/sites-enabled/default

sudo systemctl restart nginx

# Configure gunicorn
cp optio_rest_api.service.template optio_rest_api.service
sed -i "s/{###Instance###}/$1/g" optio_rest_api.service
sudo cp optio_rest_api.service /etc/systemd/system

# Enable system services
echo "Setting up firewall..."
sudo systemctl daemon-reload

sudo systemctl enable optio_rest_api
sudo systemctl restart optio_rest_api 

python3 /home/ubuntu/dev_rmstudio/rmengine/testing/cleanup.py

