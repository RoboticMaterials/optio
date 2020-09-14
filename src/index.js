import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import $ from "jquery";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './methods/css/montserrat.css';
import './methods/css/iwawa.css';
import './methods/css/all.css';
import * as popper from 'popper.js'
import 'xmlrpc'
import { Provider } from 'react-redux'
import {store} from './redux/store/index.js'
import './methods/css/fontawesome.min.css'
import './graphics/icons/style.css'
import 'nivo'

/* uncomment to disable default logger
console.log = () => {};
console.error = () => {};
console.fatal = () => {};
console.warn = () => {};
*/
//

// if(module.hot){
//     module.hot.accept()
// }

const rootElement = document.getElementById('root')
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
  rootElement
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register();
