import logger from "../logger";

const log = logger.getLogger("LocalStorage");

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
  const loggerConfig = localStorage.setItem(
    "logger-config-123",
    JSON.stringify(settings)
  );
  return loggerConfig;
}
