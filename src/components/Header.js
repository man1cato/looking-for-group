import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {startLogout} from '../actions/auth';

export const Header = ({startLogout}) => (
    <header className="header">
        <div className="content-container">
            <div className="header__content">
                <Link className="header__title" to="/dashboard" >
                    <h1>Looking For Group</h1>
                </Link>
                <div className="header__links">
                    <Link to="/profile"><img src='/images/user-profile-white.png' /></Link>
                    <Link to="/bug-report"><img src='/images/bug-icon.png' /></Link>
                    <button className="button button--link" onClick={startLogout}>Logout</button>
                </div>
            </div>
        </div>
    </header>
);

const mapDispatchToProps = (dispatch) => ({
    startLogout: () => dispatch(startLogout())
});

export default connect(undefined, mapDispatchToProps)(Header);