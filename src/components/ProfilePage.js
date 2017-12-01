import React from 'react';
import {connect} from 'react-redux';
import {startUpdateUser} from '../actions/user';
import InterestSelector from './InterestSelector';

export class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {      //default state
            recordId: props.user.recordId,
            firstName: props.user.firstName ? props.user.firstName : '',
            lastName: props.user.lastName ? props.user.lastName : '',
            postalCode: props.user.postalCode ? props.user.postalCode: '',
            birthYear: props.user.birthYear ? props.user.birthYear: 1990,
            interest1: props.user.interest1 ? props.user.interest1: '',
            interest2: props.user.interest2 ? props.user.interest2: '',
            interest3: props.user.interest3 ? props.user.interest3: ''
        };
    }
    onNameChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(() => ({ [name]: value }));
    };
    onBirthYearChange = (e) => {
        const birthYear = e.target.value;
        this.setState(() => ({ birthYear }));
    }
    onInterestChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(() => ({[name]: value}));
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.props.startUpdateUser(this.state);
        this.props.history.push('/');
    };
    render() {
        return (
            <div className="content-container">
                <div>
                    <h2>User Profile</h2>
                </div>
                <div>
                    <form className="form" onSubmit={this.onSubmit}>
                        <div>
                            Name: <input
                                className="text-input"
                                type="text"
                                name="firstName"
                                value={this.state.firstName}
                                onChange={this.onNameChange}
                            />
                            <input 
                                className="text-input"
                                type="text"
                                name="lastName"
                                value={this.state.lastName}
                                onChange={this.onNameChange}
                            />
                        </div>
                        <div>
                            Birth Year: <input 
                                className="text-input"
                                type="number" 
                                name="birthYear" 
                                min="1900" 
                                max="2020"
                                value={this.state.birthYear}
                                onChange={this.onBirthYearChange}
                            />
                        </div>
                        <div>
                            #1 Interest: <select 
                                className="select" 
                                name="interest1" 
                                defaultValue={this.state.interest1}
                                onChange={this.onInterestChange}
                            >
                                <option key="0" value=""></option>          //blank option
                                {this.props.interests.map((interest) => (<option key={interest.id} value={interest.id}>{interest.name}</option>) )}
                            </select>
                        </div>
                        <div>
                            #2 Interest: <select 
                                className="select" 
                                name="interest2" 
                                defaultValue={this.state.interest2}
                                onChange={this.onInterestChange}
                            >
                                <option key="0" value=""></option>          //blank option
                                {this.props.interests.map((interest) => (<option key={interest.id} value={interest.id}>{interest.name}</option>) )}
                            </select>
                        </div>
                        <div>
                            #3 Interest: <select 
                                className="select" 
                                name="interest3" 
                                defaultValue={this.state.interest3}
                                onChange={this.onInterestChange}
                            >
                                <option key="0" value=""></option>          //blank option
                                {this.props.interests.map((interest) => (<option key={interest.id} value={interest.id}>{interest.name}</option>) )}
                            </select>
                        </div>
                        <div>
                            <button className="button">Save Profile</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    interests: state.interests
});

const mapDispatchToProps = (dispatch) => ({
    startUpdateUser: (user) => dispatch(startUpdateUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
