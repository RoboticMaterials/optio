#!/usr/bin/bash

if [ -z $1 ]; then
	echo "Parameter missing. Usage ./install.sh domainname"
	exit
fi


echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

sudo apt update
sudo apt install -y nginx
sudo apt install -y python3-pip
sudo apt install -y acl
pip3 install gunicorn

wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
sudo apt-get install -y mongodb-org
sudo apt install -y nodejs npm

# Configure Nginx
sudo cp nginx.conf /etc/nginx
cp client-config.template client-config
sed -i "s/{###Instance###}/$1/g" client-config
sudo cp client-config /etc/nginx/sites-enabled
sudo rm /etc/nginx/sites-enabled/default

# Configure Gunicorn
cp optio_rest_api.service.template optio_rest_api.service
sed -i "s/{###Instance###}/$1/g" optio_rest_api.service
cp optio_rest_api.service /etc/systemd/system

# Install certbot
echo "Installing Certbot"
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot certonly --nginx
sudo setfacl -R -m g:www-data:rX /etc/letsencrypt/live/$1
sudo setfacl -R -m g:www-data:rX /etc/letsencrypt/archive/$1
sudo setfacl -m g:www-data:rX /etc/letsencrypt/live
sudo setfacl -m g:www-data:rX /etc/letsencrypt/archive

# Install Python packages
echo "Installing Python packages"
pip3 install flask
pip3 install flask_cors
pip3 install connexion
pip3 install demjson
pip3 install pandas
pip3 install matplotlib
pip3 install pymongo
pip3 install cognitojwt
pip3 install connexion[swagger-ui]

# Build Node
echo "Building Node"
npm install --prefix /home/ubuntu/optio
npm run-script build --prefix /home/ubuntu/optio

# Setup firewall
echo "Setting up firewall"
ufw default deny incoming
ufw default allow outgoing
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable 

# Enable system services
echo "Setting up firewall..."
systemctl daemon-reload

service nginx enable
service nginx restart

service optio_rest_api enable
service optio_rest_api restart

python3 /home/ubuntu/dev_rmstudio/rmengine/testing/cleanup.py

