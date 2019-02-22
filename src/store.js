import rootReducer from './reducers/reducers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'

export const store = createStore(
  rootReducer,
  applyMiddleware(
    thunk
  )
);