import  store  from "../redux/store/index";
import ls from 'local-storage'

export const mirURL = (url) => {
    // const mirURL = url
    const mirURL = "10.1.10.35";
    const prefix = "http://";
    const URL = prefix + mirURL;
    return URL;
};

export const apiIPAddress = (protocol='https', suffix='api/') => {
    const localSettings = ls.get("localSettings")
    const parsedLocalSettings = JSON.parse(localSettings)
    const hostServerIpAddress = parsedLocalSettings ? parsedLocalSettings.non_local_api_ip : ""
    const nonLocalIp = parsedLocalSettings ? parsedLocalSettings.non_local_api : false
    const disabledHTTPS = parsedLocalSettings ? parsedLocalSettings.disable_https : false

    let protocolToUse = protocol==='https' ? (disabledHTTPS ? 'http' : 'https') : (protocol==='wss' ? (disabledHTTPS ? 'ws' : 'wss') : protocol);

    let host;
    if (nonLocalIp === true && !!hostServerIpAddress) {
        host = hostServerIpAddress;
    } else if (window.location.hostname === '10.42.0.1') {
        host = window.location.hostname;
    } else if (window.location.hostname === 'localhost') {
        host = 'localhost:5000';
        if (protocol === 'https') {
            protocolToUse = 'http';
        } else if (protocol === 'wss') {
            protocolToUse = 'ws';
        }
        
    } else {
        host = window.location.hostname
    }

    return `${protocolToUse}://${host}/${suffix}`;
};

store.subscribe(apiIPAddress);

// /home/ubuntu/.local/bin/gunicorn -w 5 -b :5000 --chdir /home/ubuntu/dev_rmstudio/rmengine/rest_api --certfile /etc/letsencrypt/live/dev.optio.cloud/fullchain.pem --keyfile /etc/letsencrypt/live/dev.optio.cloud/privkey.pem 'server:create_app()'
