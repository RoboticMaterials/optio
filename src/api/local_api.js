//This API is used to handle calls to the local storage

import ls from 'local-storage'
import {defaultLocalSettings} from "../constants/local_settings_constants";

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
  const locStorage = ls.set("localSettings", JSON.stringify(settings));
  return locStorage
}


export const getLocalSettings = async () => {
  const localSettings = ls.get("localSettings");

  if (localSettings !== null) {
      const locSettings = JSON.parse(localSettings);
      return locSettings;
  }
  else {
    await postLocalSettings(defaultLocalSettings)
    return defaultLocalSettings
  }

}

export const deleteLocalSettings = async () => {
    localStorage.removeItem("local-settings-config");
}
