import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import areasReducer from '../reducers/areas';
import userReducer from '../reducers/user';
import interestsReducer from '../reducers/interests';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
    const store = createStore(
        combineReducers({
            auth: authReducer,
            areas: areasReducer,
            user: userReducer,
            interests: interestsReducer
        }),
        composeEnhancers(applyMiddleware(thunk))
    );
    
    return store;
};
