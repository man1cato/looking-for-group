import React from 'react';
import {connect} from 'react-redux';


export const ProfilePage = (props) => (
    <div className="content-container">
        <div>
            <h2>Profile</h2>
        </div>
        <div>
            {props.firstName} {props.lastName}
            <p>Email: {props.email}</p>
        </div>
    </div>
);

const mapStateToProps = (state, props) => ({
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    email: state.user.email
});

export default connect(mapStateToProps)(ProfilePage);
