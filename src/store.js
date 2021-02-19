import {
    createStore,
    applyMiddleware,
    compose,
    combineReducers,
} from 'redux';
import thunk from 'redux-thunk';

import mainPageReducer from './main/reducer';
import testTemplateDetailsPageReducer from './test-template-details/reducer';
import modelReducer from './model/reducer';

const rootReducer = combineReducers({
    mainPageReducer,
    testTemplateDetailsPageReducer,
    model: modelReducer,
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
