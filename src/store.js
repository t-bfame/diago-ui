import {
    createStore,
    applyMiddleware,
    compose,
    combineReducers,
} from 'redux';
import thunk from 'redux-thunk';

import modelReducer from './model/reducer';
import { dashReducer } from './reducer';

const rootReducer = combineReducers({
    model: modelReducer,
    dash: dashReducer,
});

const persistedState = {};
const enhancers = [];
const middleware = [thunk];
const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
}

const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
);

const store = createStore(
    rootReducer,
    persistedState,
    composedEnhancers,
);

export default store;
