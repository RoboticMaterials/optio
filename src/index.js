import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import './methods/css/montserrat.css';
import './methods/css/iwawa.css';
import './methods/css/all.css';
import { Provider } from 'react-redux'
import store from './redux/store/index.js'
import './methods/css/fontawesome.min.css'
import './graphics/icons/style.css'

import './i18n';

if (import.meta.hot) {
    import.meta.hot.accept()
}

const rootElement = document.getElementById('root')
createRoot(rootElement).render(
    <Provider store={store}>
        <App />
    </Provider>
)

serviceWorker.register();
