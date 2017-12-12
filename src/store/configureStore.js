import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import userReducer from '../reducers/user';
import interestsReducer from '../reducers/interests';
import availabilitiesReducer from '../reducers/availabilities';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
    const store = createStore(
        combineReducers({
            auth: authReducer,
            user: userReducer,
            interests: interestsReducer,
            availabilities: availabilitiesReducer
        }),
        composeEnhancers(applyMiddleware(thunk))
    );
    
    return store;
};
