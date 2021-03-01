import  store  from "../redux/store/index";

export const mirURL = (url) => {
    // const mirURL = url
    const mirURL = "10.1.10.35";
    const prefix = "http://";
    const URL = prefix + mirURL;
    return URL;
};

export const apiIPAddress = () => {
    const storeState = store.getState();
    let hostServerIpAddress = "";

    /**
     * READ ME: Do not change IP address here. Go to the settings tab in the interface, select Non Local API IP Address and type in the api ip address
     * If non local api is true, then the server is running on an IP address entered
     */

    if (!!storeState.localReducer && !!storeState.localReducer.localSettings && storeState.localReducer.localSettings.non_local_api) {

        // If there is no api use the local host
        if (storeState.localReducer.localSettings.non_local_api_ip === undefined) {
            return 'http://localhost:5000/api/'
        } else {
            hostServerIpAddress = storeState.localReducer.localSettings.non_local_api_ip;
            return 'http://' + hostServerIpAddress + ':5000/api/'
        }
    } else {
        return 'http://' + window.location.hostname + ':5000/api/'
    }
};

store.subscribe(apiIPAddress);
