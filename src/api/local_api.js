//This API is used to handle calls to the local storage

import logger from '../logger'
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
import {defaultLocalSettings} from "../constants/local_settings_constants";



const log = logger.getLogger('LocalStorage')

export async function getLoggers() {

    // retrieve data from localStorage
    // currently stored under the key "logger-config-123"
    // this key could be set to a user id to save settings for a specific user
    var loggerConfig = localStorage.getItem("logger-config-123");
    if (loggerConfig) {
        loggerConfig = JSON.parse(loggerConfig);
        return loggerConfig;
    }

}

export async function postLoggers(settings) {

    const loggerConfig = localStorage.setItem("logger-config-123", JSON.stringify(settings));
    return loggerConfig;
}

export const postLocalSettings = async (settings) => {
    const localSettings = localStorage.setItem("local-settings-config", JSON.stringify(settings))
    return localSettings
}

export const deleteLocalSettings = async () => {
    console.log('QQQQ Cleared')
    localStorage.removeItem("local-settings-config")
    
}

export const getLocalSettings = async () => {
    let localSettings = localStorage.getItem("local-settings-config");

    if (localSettings) {
        localSettings = JSON.parse(localSettings);
        return localSettings;
    }
    // Posts settigns to the backend if there's nothing there
    else {
        const settings = postLocalSettings(defaultLocalSettings)
        return settings
    }
}
