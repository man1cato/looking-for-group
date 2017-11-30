import React from 'react';
import {connect} from 'react-redux';
import ProfileForm from './ProfileForm';

export const ProfilePage = (props) => (
    <div className="content-container">
        <div>
            <h2>Profile</h2> {console.log('from profile page:', props)}
        </div>
        {
            props.email ? (
                <div>
                    <p>Name: {props.firstName} {props.lastName}</p>
                    <p>Email: {props.email}</p>
                    
                </div>
            ) : (
                <ProfileForm />
            )
        }
    </div>
);

const mapStateToProps = (state, props) => ({
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    email: state.user.email
});

export default connect(mapStateToProps)(ProfilePage);
