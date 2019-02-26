import React from 'react';
import { render } from 'react-dom';
import './style/index.css';
import App from './components/App';
import * as serviceWorker from './config/serviceWorker';
import { store } from './config/store';
import { Provider } from 'react-redux'

render(
  <Provider store={store}>
     <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
