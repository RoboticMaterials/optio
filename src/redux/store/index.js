import {createStore, applyMiddleware, compose} from 'redux';
import { createLogger } from 'redux-logger'
import reducers from '../reducers/index';
import thunk from 'redux-thunk';

import log_module from '../../logger.js';

const reduxLogger = log_module.getLogger('ReduxLogger');

var logger = createLogger({logger: reduxLogger, level: "info"});

// const muteReducer = () => {
//   if(reducers.settingsReducer.muteReducer){
//     return applyMiddleware(thunk)
//   } else {
//     return applyMiddleware(logger, thunk)
//   }
// }

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      // actionCreators,
      trace: true,
      traceLimit: 25,
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(logger, thunk),
  // other store enhancers if any
);

const store = createStore(reducers, enhancer);

if (module.hot) {
  module.hot.accept('../reducers/index.js', () => {
    // const nextReducer = combineReducers(require('../reducers'))
    // store.replaceReducer(nextReducer)
    store.replaceReducer(require('../reducers/index.js').default)
  })
}

export default store
