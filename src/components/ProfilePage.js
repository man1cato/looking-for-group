import React from 'react';
import {connect} from 'react-redux';
import ProfileForm from './ProfileForm';


export class ProfilePage extends React.Component {
    render() {
        return (
            <div className="content-container">
                <div>
                    <h2>Profile</h2>
                </div>
                {
                    this.props.user.email ? (
                        <div>
                            <p>Name: {this.props.user.firstName} {this.props.user.lastName}</p>
                            <p>Email: {this.props.user.email}</p>
                            <form>
                                <div>
                                    #1 Interest: <select name="interest1" defaultValue={this.props.user.interest1 ? this.props.user.interest1 : ""}>
                                        {this.props.interests.map((interest) => (<option key={interest.id} value={interest.id}>{interest.name}</option>) )}
                                    </select>
                                </div>
                                <div>
                                    #2 Interest: <select name="interest2" defaultValue={this.props.user.interest2 ? this.props.user.interest2 : ""}>
                                        {this.props.interests.map((interest) => (<option key={interest.id} value={interest.id}>{interest.name}</option>) )}
                                    </select>
                                </div>
                                <div>
                                    #3 Interest: <select name="interest3" defaultValue={this.props.user.interest3 ? this.props.user.interest3 : ""}>
                                        {this.props.interests.map((interest) => (<option key={interest.id} value={interest.id}>{interest.name}</option>) )}
                                    </select>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <ProfileForm />
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    user: state.user,
    interests: state.interests
});

export default connect(mapStateToProps)(ProfilePage);
