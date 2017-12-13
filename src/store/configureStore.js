import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import userReducer from '../reducers/user';
import eventsReducer from '../reducers/events';
import interestsReducer from '../reducers/interests';
import availabilitiesReducer from '../reducers/availabilities';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
    const store = createStore(
        combineReducers({
            auth: authReducer,
            user: userReducer,
            events: eventsReducer,
            interests: interestsReducer,
            availabilities: availabilitiesReducer
        }),
        composeEnhancers(applyMiddleware(thunk))
    );
    
    return store;
};
