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

    console.log("!!!", window.location.hostname)

    let localSettings = ls.get("localSettings")
    let parsedLocalSettings = JSON.parse(localSettings)
    let hostServerIpAddress = parsedLocalSettings ? parsedLocalSettings.non_local_api_ip : ""
    let nonLocalIp = parsedLocalSettings ? parsedLocalSettings.non_local_api : false
    let disabledHTTPS = parsedLocalSettings ? parsedLocalSettings.disable_https : false
    /**
     * READ ME: Do not change IP address here. Go to the settings tab in the interface, select Non Local API IP Address and type in the api ip address
     * If non local api is true, then the server is running on an IP address entered
     */

    if (nonLocalIp === true) {
        if (!!hostServerIpAddress) {
            return `${disabledHTTPS ? 'http' : 'https'}://${hostServerIpAddress}/api/`
        } else if (window.location.hostname === 'localhost') {
            return `${disabledHTTPS ? 'http' : 'https'}://localhost:5000/api/`
        } else {
            return `${disabledHTTPS ? 'http' : 'https'}://${window.location.hostname}/api/`
        }
    } else if (window.location.hostname === '10.42.0.1') {
        return `http://${window.location.hostname}/api/`
    } else {
        if (window.location.hostname === 'localhost') {
            return `${disabledHTTPS ? 'http' : 'https'}://localhost:5000/api/`
        } else {
            return `${disabledHTTPS ? 'http' : 'https'}://${window.location.hostname}/api/`
        }
    }

};

store.subscribe(apiIPAddress);

// /home/ubuntu/.local/bin/gunicorn -w 5 -b :5000 --chdir /home/ubuntu/dev_rmstudio/rmengine/rest_api --certfile /etc/letsencrypt/live/dev.optio.cloud/fullchain.pem --keyfile /etc/letsencrypt/live/dev.optio.cloud/privkey.pem 'server:create_app()'
