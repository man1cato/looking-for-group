import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';              

import AppRouter, {history} from './routers/AppRouter';
import configureStore from './store/configureStore';
import {firebase} from './firebase/firebase';
import {login, logout} from './actions/auth';
import {startSetUser} from './actions/user';
import {startSetAreas} from './actions/areas';
import {startGetInterests} from './actions/interests';
import LoadingPage from './components/LoadingPage';

import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';


const store = configureStore();

//PROVIDE STORE TO COMPONENTS
const jsx = (
    <Provider store={store}>            
        <AppRouter />
    </Provider>
);

let hasRendered = false;

const renderApp = () => {
    if (!hasRendered) {
        ReactDOM.render(jsx, document.getElementById('app'));
        hasRendered = true;
    }
};


ReactDOM.render(<LoadingPage />, document.getElementById('app'));

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log('logged in');
        store.dispatch(login(user.uid));
        store.dispatch(startSetAreas('Alpha Test List')).then(() => {
            store.dispatch(startGetInterests());
            return store.dispatch(startSetUser(user));
        }).then(() => {
            renderApp();
            if (history.location.pathname === '/') {
                history.push('/dashboard');
            }
            console.log('from app.js:', store.getState());
        });
    } else {
        console.log('logged out');
        store.dispatch(logout());
        renderApp();
        history.push('/');
    }
});

