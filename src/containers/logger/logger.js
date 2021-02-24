/*
READ-ME

DO ALL CONTROLLING OF LOG LEVELS IN THIS CONTAINER, NEVER ANYWHERE ELSE

Instructions of creating a new logger:
=====================================

1. import logger from src/logger.js'

2. create a new logger
    this.logger = logger.getLogger(~ENTER LOGGER NAME HERE~)

3. use logger
    this.logger.info('Here is a message', hereIsAVariable);

*/

// import external dependencies
import React, { Component } from "react";
import { connect } from "react-redux";

// import actions
import { getLoggers, postLoggers } from "../../redux/actions/local_actions";

// import methods
import { deepCopy, arraysEqual } from "../../methods/utils/utils";

// import logger
import log from "../../logger.js";

class LoggerContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //loggers: log.getLoggers(),
      disableAll: false,
      enableAll: false,
    };

    this.logger = log.getLogger(this.constructor.name);
  }

  componentDidMount() {
    // initial call to check for loggers
    this.checkForLoggers();

    // check for new loggers on interval
    // doesn't appear to be necessary at the moment
    // this.checkLoggersInterval = setInterval(() => this.checkForLoggers(), 10000);
  }

  componentWillUnmount() {
    // clearInterval(this.checkLoggersInterval);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // const currentReduxLoggers = this.props.loggers;
    // const prevReduxLoggers = prevProps.loggers;

    const currentReduxLoggerNames = Object.keys(this.props.loggers);
    const prevReduxLoggerNames = Object.keys(prevProps.loggers);

    const loggersChanged = !arraysEqual(
      currentReduxLoggerNames,
      prevReduxLoggerNames
    );

    if (loggersChanged) {
      // this.checkForLoggers();
    }
  }

  /*
        This function disables all loggers
    */
  disableAll = () => {
    this.logger.trace("disableAll called");
    //Object.values(log.getLoggers()).forEach((logger, index) => {
    //  logger.setLevel(5);
    //})

    Object.values(this.props.loggers).forEach((redux_logger, index) => {
      let logger = log.getLogger(redux_logger.name);
      logger.setLevel(5);
    });

    log.disableAll();
    this.setState({ disableAll: true, enableAll: false });
  };

  /*
        This function enables all loggers
    */
  enableAll = () => {
    //Object.values(log.getLoggers()).forEach((logger, index) => {
    //  logger.setLevel(0);
    //})

    Object.values(this.props.loggers).forEach((redux_logger, index) => {
      let logger = log.getLogger(redux_logger.name);
      logger.setLevel(0);
    });
    log.enableAll();
    this.setState({ enableAll: true, disableAll: false });
  };

  /*
        This function updates the actual logger settings to match the config in redux
    */
  updateLoggers = () => {
    const existingLoggerNames = Object.values(log.getLoggers()).map(
      (logger, index) => logger.name
    );

    //If disableAll all is true
    if (this.props.disableAll && !this.state.disableAll) {
      this.disableAll();
    }

    if (!this.props.disableAll && this.state.disableAll) {
      this.setState({ disableAll: false });
    }

    //If mute all is false
    if (this.props.enableAll && !this.state.enableAll) {
      this.enableAll();
    }

    if (!this.props.enableAll && this.state.enableAll) {
      this.setState({ enableAll: false });
    }

    // only perform the logger updates if neither disableAll nor enableAll are true
    if (!this.props.disableAll && !this.props.enableAll) {
      // for each logger in redux:
      //    get the actual logger
      //    set the level to match the redux config
      Object.values(this.props.loggers).forEach((redux_logger, index) => {
        if (existingLoggerNames.includes(redux_logger.name)) {
          let logger = log.getLogger(redux_logger.name);

          let level = redux_logger.level;
          let enabled = redux_logger.enabled;

          // if logger isn't enabled and isn't already set to silent,
          // set it to silent
          if (!enabled && logger.getLevel() !== 5) {
            logger.setLevel(5);
          }

          // if the logger is enabled, and the actual level doesn't
          // match the level config in redux, update it
          if (enabled && logger.getLevel() !== level) {
            logger.setLevel(level);
          }
        }
      });
    }
  };

  /*
        This function checks if any loggers exist that do not exist in the redux store
        If a logger is found that isn't in the store, it will add a new logger object to the store
    */
  checkForLoggers = async () => {
    // true if the redux store has read the logger config
    // false otherwise
    const { loaded } = this.props;

    // only perform the check if the saved settings have been loaded
    if (true) {
      // get all loggers
      const loggers = Object.values(log.getLoggers());
      const loggerNames = loggers.map((logger) => logger.name);

      // get name of loggers in redux
      const reduxLoggerNames = Object.values(this.props.loggers).map(
        (logger, index) => {
          return logger.name;
        }
      );

      // for each logger
      //    check if the redux store contains a logger with the same name
      //    if a logger isn't found, create a new one
      let newLoggers = [];
      loggers.forEach(async (logger, index) => {
        let name = logger.name;
        let level = logger.getLevel();

        // if level is equal to 5 (silent), enabled is false, and true otherwise
        let enabled = level === 5 ? false : true;

        if (!reduxLoggerNames.includes(name)) {
          let newLogger = {
            name,
            level,
            enabled,
          };

          this.logger.info("Adding new logger", newLogger);

          newLoggers.push(newLogger);
        }
      });

      await this.addLoggers(newLoggers);

      // this block will remove loggers from redux that don't actually exist
      // this will be necessary for loggers that have been deleted from code
      // but still have local saved settings

      /*
          let removeLoggers = [];
          // delete
          reduxLoggerNames.forEach( (reduxLoggerName, index) => {
              if(!loggerNames.includes(reduxLoggerName)) {
                this.logger.info("Adding logger to list to be removed", reduxLoggerName);
                removeLoggers.push(reduxLoggerName);
              }
          });

          this.logger.info('About to remove loggers', removeLoggers)
          if(removeLoggers.length > 0) {
              //  await this.removeLogger(removeLoggers);

          }
          */
    }
  };

  /*
        This function adds a new logger to the redux store
    */
  addLoggers = async (newLoggers) => {
    const { loggers, enableAll, disableAll, loaded } = this.props;

    // copy loggers (don't directly modify state)
    let loggersCopy = deepCopy(loggers);

    newLoggers.forEach((newLogger, index) => {
      // add newLogger to loggers copy
      loggersCopy[newLogger.name] = newLogger;
    });

    // create logger config
    var loggerConfig = {};
    loggerConfig["loggers"] = loggersCopy;
    loggerConfig["enableAll"] = enableAll;
    loggerConfig["disableAll"] = disableAll;

    await this.props.postLoggers(loggerConfig, loaded);
  };

  /*
        This function removes logger from the redux store
    */
  removeLogger = async (loggerNames) => {
    const { loggers, enableAll, disableAll } = this.props;

    this.logger.debug("removeLogger: loggerNames", loggerNames);
    this.logger.debug("removeLogger: loggers", loggers);

    // copy loggers (don't directly modify state)
    let loggersCopy = deepCopy(loggers);

    loggerNames.forEach((name, index) => {
      // delete logger
      delete loggersCopy[name];
    });

    this.logger.debug("removeLogger: loggersCopy after removal", loggersCopy);

    // create logger config
    var loggerConfig = {};
    loggerConfig["loggers"] = loggersCopy;
    loggerConfig["enableAll"] = enableAll;
    loggerConfig["disableAll"] = disableAll;

    await this.props.postLoggers(loggerConfig);
  };

  /*
    printLoggers = () => {
      let loggers = Object.values(log.getLoggers());
      console.log('printLoggers')

      loggers.forEach((logger, index) => {

        console.log(logger.name)
        console.log(logger.getLevel())
        console.log(logger)
      })


    }
    */

  /*
    printReduxLoggers = () => {
      let loggers = Object.values(this.props.loggers);
      console.log('printReduxLoggers')

      loggers.forEach((logger, index) => {

        console.log(logger.name)
        console.log(logger.level)
        console.log(logger.enabled)
      })


    }
    */

  render() {
    this.updateLoggers();

    //this.printLoggers()
    //this.printReduxLoggers()

    return <></>;
  }
}

const mapStateToProps = function (state) {
  return {
    loggers: state.localReducer.loggers,
    enableAll: state.localReducer.enableAll,
    disableAll: state.localReducer.disableAll,
    loaded: state.localReducer.loaded,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    postLoggers: (loggerConfig) => dispatch(postLoggers(loggerConfig)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoggerContainer);
