#!/usr/bin/bash

if [ -z $1 ]; then
	echo "Parameter missing. Usage ./install.sh domainname"
	exit
fi


# Configure Nginx
cp nginx.conf /etc/nginx
cp client-config.template client-config
sed -i "s/{###Instance###}/$1/g" client-config
cp client-config /etc/nginx/sites-enabled

# Configure Gunicorn
cp optio_rest_api.service.template optio_rest_api.service
sed -i "s/{###Instance###}/$1/g" optio_rest_api.service
cp optio_rest_api.service /etc/systemd/system

# Install certbot
echo "Installing Certbot"
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot certonly --nginx


# Install Python packages
echo "Installing Python packages"
pip3 install flask
pip3 install flask_cors
pip3 install connexion
pip3 install demjson
pip3 install pandas
pip3 install matplotlib

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

