import  store  from "../redux/store/index";
import ls from 'local-storage'

export const mirURL = (url) => {
    // const mirURL = url
    const mirURL = "10.1.10.35";
    const prefix = "http://";
    const URL = prefix + mirURL;
    return URL;
};

export const apiIPAddress = () => {
    const storeState = store.getState();
    let apiIPAddress = "";

    let localSettings = ls.get("localSettings")
    let parsedLocalSettings = JSON.parse(localSettings)
    let hostServerIpAddress = parsedLocalSettings ? parsedLocalSettings.non_local_api_ip : ""
    let nonLocalIp = parsedLocalSettings ? parsedLocalSettings.non_local_api : false
    /**
     * READ ME: Do not change IP address here. Go to the settings tab in the interface, select Non Local API IP Address and type in the api ip address
     * If non local api is true, then the server is running on an IP address entered
     */

    if (!!hostServerIpAddress) {
        // If there is no api use the local host
        if (nonLocalIp===false) {
            return apiIPAddress = 'https://' + 'localhost' + ':5000/api/'
        } else {
            return apiIPAddress = 'https://' + hostServerIpAddress + ':5000/api/'

        }
    } else {
        return 'https://' + window.location.hostname + ':5000/api/'
    }

};

store.subscribe(apiIPAddress);

// /home/ubuntu/.local/bin/gunicorn -w 5 -b :5000 --chdir /home/ubuntu/dev_rmstudio/rmengine/rest_api --certfile /etc/letsencrypt/live/dev.optio.cloud/fullchain.pem --keyfile /etc/letsencrypt/live/dev.optio.cloud/privkey.pem 'server:create_app()'
