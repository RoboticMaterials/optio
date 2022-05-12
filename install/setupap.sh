# https://computingforgeeks.com/create-wi-fi-hotspot-on-ubuntu-debian-fedora-centos-arch/
nmcli con add type wifi ifname wlp1s0 con-name optio-server autoconnect yes ssid optio-server
nmcli con modify optio-server 802-11-wireless.mode ap 802-11-wireless.band bg ipv4.method shared
nmcli con up optio-server


