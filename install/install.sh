#!/usr/bin/bash

if [ -z $1 ]; then
	echo "Parameter missing. Usage ./install.sh domainname"
	exit
fi


cp nginx.conf /etc/nginx




cp client-config.template client-config
sed -i "s/{###Instance###}/$1/g" client-config
cp client-config /etc/nginx/sites-enabled
cp optio_rest_api.service /etc/systemd/system



cp optio_rest_api.service.template optio_rest_api.service
sed -i "s/{###Instance###}/$1/g" optio_rest_api.service
cp optio_rest_api.service /etc/systemd/system

# Install certbot
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


# Setup firewall
echo "Setting up firewall..."
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




