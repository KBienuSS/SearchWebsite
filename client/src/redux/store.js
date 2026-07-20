import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import { thunk } from 'redux-thunk';
import initialState from './initialState';
import userReducer from './usersRedux';
import adsReducer from './adsRedux';

const subreducers = {
    user: userReducer,
    ads: adsReducer
};

const reducer = combineReducers(subreducers);
const store = createStore(
    reducer,
    initialState,
    compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : (f) => f
    )
);

export default store;