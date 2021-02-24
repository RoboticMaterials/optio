import log from "loglevel";
// import remote from 'loglevel-plugin-remote';

/*

Note on log levels:

Trace - Only when I would be "tracing" the code and trying to find one part of a function specifically.

Debug - Information that is diagnostically helpful to people more than just developers (IT, sysadmins, etc.).

log - Equivalent to Debug

Info - Generally useful information to log (service start/stop, configuration assumptions, etc). Info I want to always have available but usually don't care about under normal circumstances. This is my out-of-the-box config level.

Warn - Anything that can potentially cause application oddities, but for which I am automatically recovering. (Such as switching from a primary to backup server, retrying an operation, missing secondary data, etc.)

Error - Any error which is fatal to the operation, but not the service or application (can't open a required file, missing data, etc.). These errors will force user (administrator, or direct user) intervention. These are usually reserved (in my apps) for incorrect connection strings, missing services, etc.

*/

/* uncomment for remote logging
const customJSON = log => ({
   msg: log.message,
   level: log.level.label,
   stacktrace: log.stacktrace
});


remote.apply(log, { format: customJSON, url: '/logger' });

*/

/*
Object.defineProperty(log, "category", {
  value: "root",
  writable: true
})
*/

const getLogger = log.getLogger;

log.getLogger = function getLoggerAndSetCategory(name, category) {
  const logger = getLogger(name);

  if (category) {
    Object.defineProperty(logger, "category", {
      value: category,
      writable: true,
    });
  }

  return logger;
};

log.getCategoryLoggers = function (category) {
  const loggers = Object.values(log.getLoggers());
  const categoryLoggers = [];

  loggers.forEach((logger, index) => {
    if (logger.category == category) categoryLoggers.push(logger);
  });

  return categoryLoggers;
};

// var originalFactory = log.methodFactory;

// log.methodFactory = function (methodName, logLevel, loggerName) {
//     var rawMethod = originalFactory(methodName, logLevel, loggerName);
//
//     return function (message) {
//         rawMethod("Newsflash: " + message);
//     };
// };
// log.setLevel(log.getLevel());

export default log;
