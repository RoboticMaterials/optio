import store from "../redux/store/index";

// import logger
import log from "../logger.js";

const logger = log.getLogger("Configuration");

// disable defaut logging
//console.log = () => {};

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
  let hostServerIpAddress = "";

  /**
   * READ ME: Do not change IP address here. Go to the settings tab in the interface, select Non Local API IP Address and type in the api ip address
   * If non local api is true, then the server is running on an IP address entered
   */

  if (
    !!storeState.localReducer &&
    !!storeState.localReducer.localSettings &&
    storeState.localReducer.localSettings.non_local_api
  ) {
    // If there is no api use the local host
    if (storeState.localReducer.localSettings.non_local_api_ip === undefined) {
      return (apiIPAddress = "http://" + "localhost" + ":5000/api/");
    } else {
      hostServerIpAddress =
        storeState.localReducer.localSettings.non_local_api_ip;
      return (apiIPAddress = "http://" + hostServerIpAddress + ":5000/api/");
    }
  } else {
    return (apiIPAddress = "http://" + window.location.hostname + ":5000/api/");
  }
};

store.subscribe(apiIPAddress);
