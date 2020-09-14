import log from 'loglevel';
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

    if(category) {
        Object.defineProperty(logger, "category", {
          value: category,
          writable: true
        })
    }

    return logger;
};

log.getCategoryLoggers = function(category) {
  const loggers = Object.values(log.getLoggers());
  const categoryLoggers = [];

  loggers.forEach((logger, index) => {
    if(logger.category == category) categoryLoggers.push(logger);
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
/*
var loggers = log.getLoggers()


export const toggleLogLevel = (type, level) => {
   console.log('QQQQ toggle log level', type, level)

   const logToggled = log.getLogger(type)

   // console.log('QQQQ Toggled!!!!', logToggled)

   logToggled.setLevel(level)

   console.log('QQQQ New log level', type, log.getLevel(logToggled), level)
 }
*/


// log.info('QQQQ loggers', loggers);
// log.warn('Message two');
//
// log.setLevel('debug')
// log.getLogger("ApiContainer").setLevel("debug");

// const disableAll = () => {
//   // Object.values(loggers).forEach((logger,index,loggers) => {
//   //   logger.setLevel('silent')
//   // })
//   log.disableAll()
// }

// const enableAll = () => {
//   log.enableAll()
// }

// const toggleLog = (type) => {
//   Object.values(loggers).forEach((logger,index,loggers) => {
//     logger.setLevel('silent')
//   })
//   switch (type) {
//     case 'api':
//       loggers.api.setLevel(1)
//       console.log('QQQQ Dashboard should be enabled', log.getLevel(loggers.api))

//     default:
//   }
// }

// //disableAll()

// export const logger = () => {
//   const storeState = settingsStore.getState()

//   log.info('QQQQ loggers', loggers);

//   // if(storeState.settingsReducer.enableLogger.length > 0){
//   //   toggleLog(storeState.settingsReducer.enableLogger)
//   // }

//   for(const log of Object.values(storeState.settingsReducer.settings.loggers)) {
//     // console.log('QQQQ Log', log)
//   }

//   //If mute all is true
//   if(storeState.settingsReducer.settings.muteAll){
//     disableAll()
//   }

//   //If mute all is false
//   if(!storeState.settingsReducer.settings.muteAll){
//     enableAll()
//   }

//   if(Object.values(storeState.settingsReducer.settings.loggers).includes(true)){

//     //Silent all loggers
//     Object.values(loggers).forEach((logger,index,loggers) => {
//       logger.setLevel('silent')
//     })

//     //Enable only the ones that are true
//     for(const logger of Object.keys(storeState.settingsReducer.settings.loggers)) {
//         // console.log('QQQQ Logger returned', logger, storeState.settingsReducer.settings.loggers[logger])
//         if(storeState.settingsReducer.settings.loggers[logger] == true){
//           toggleLog(logger)
//         }
//     }
//   }

// }

// settingsStore.subscribe(logger)
