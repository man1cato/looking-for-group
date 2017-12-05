import React from 'react';
import {connect} from 'react-redux';
import {startUpdateUser, startUpdateUserLocation} from '../actions/user';
// import InterestSelector from './InterestSelector';
import filterAvailabilities from '../utils/filterAvailabilities';


export class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {      //default state
            uid: props.user.uid,
            email: props.user.email,
            recordId: props.user.recordId,
            firstName: props.user.firstName ? props.user.firstName : '',
            lastName: props.user.lastName ? props.user.lastName : '',
            postalCode: props.user.postalCode ? props.user.postalCode : '',
            birthYear: props.user.birthYear ? props.user.birthYear : 1990,
            interest1: props.user.interest1 ? props.user.interest1 : '',
            interest2: props.user.interest2 ? props.user.interest2 : '',
            interest3: props.user.interest3 ? props.user.interest3 : '',
            availability: props.user.availability ? props.user.availability : '',
            area: props.user.area
        };
    }
    onTextChange = (e) => {
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
        this.setState(() => ({ [name]: value }));
    }
    onAvailabilityChange = (e) => {
        const checked = e.target.checked;
        const changedAvailability = e.target.name;
        console.log('changedAvailability:',changedAvailability);
        if (checked) {
            this.setState(() => ({ availability: [changedAvailability, ...this.state.availability] }));
            console.log('checked after:',this.state.availability);
        } else {
            this.setState(() => ({ availability: this.state.availability.filter((availability) => availability !== changedAvailability) }));
            console.log('unchecked after:',this.state.availability);
        }
    }
    onSubmit = (e) => {
        e.preventDefault();
        // if (this.state.user.postalCode !== this.props.postalCode) {             //IF POSTAL CODE CHANGES, TRIGGER LOCATION DATA UPDATES
        //     this.props.startUpdateUserLocation(this.state);
        // }
        this.props.startUpdateUser(this.state);
        this.props.history.push('/');
        console.log(this.state);
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
                                onChange={this.onTextChange}
                            />
                            <input 
                                className="text-input"
                                type="text"
                                name="lastName"
                                value={this.state.lastName}
                                onChange={this.onTextChange}
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
                            Postal Code: <input 
                                className="text-input"
                                type="text" 
                                name="postalCode"
                                value={this.state.postalCode}
                                onChange={this.onTextChange}
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
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Availability:</th>
                                        <td>Mon</td>
                                        <td>Tue</td>
                                        <td>Wed</td>
                                        <td>Thu</td>
                                        <td>Fri</td>
                                        <td>Sat</td>
                                        <td>Sun</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="table__first-column">Morning (8am-12pm)</td>
                                        {filterAvailabilities(this.props.availabilities, 'Morning').map((availability) => (
                                            <td key={availability.recordId}>
                                                <input 
                                                    type="checkbox" 
                                                    key={availability.recordId} 
                                                    name={availability.recordId} 
                                                    defaultChecked={this.state.availability.indexOf(availability.recordId) > -1 && true}
                                                    onChange={this.onAvailabilityChange}
                                                />
                                            </td> 
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="table__first-column">Afternoon (12pm-5pm)</td>
                                        {filterAvailabilities(this.props.availabilities, 'Afternoon').map((availability) => (
                                            <td key={availability.recordId}>
                                                <input 
                                                    type="checkbox" 
                                                    key={availability.recordId}
                                                    name={availability.recordId} 
                                                    defaultChecked={this.state.availability.indexOf(availability.recordId) > -1 && true}
                                                    onChange={this.onAvailabilityChange}
                                                />
                                            </td> 
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="table__first-column">Evening (5pm-10pm)</td>
                                        {filterAvailabilities(this.props.availabilities, 'Evening').map((availability) => (
                                            <td key={availability.recordId}>
                                                <input 
                                                    type="checkbox" 
                                                    key={availability.recordId} 
                                                    name={availability.recordId} 
                                                    defaultChecked={this.state.availability.indexOf(availability.recordId) > -1 && true}
                                                    onChange={this.onAvailabilityChange}
                                                />
                                            </td> 
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="table__first-column">Late Night (10pm-2am)</td>
                                        {filterAvailabilities(this.props.availabilities, 'Late Night').map((availability) => (
                                            <td key={availability.recordId}>
                                                <input 
                                                    type="checkbox" 
                                                    key={availability.recordId} 
                                                    name={availability.recordId} 
                                                    defaultChecked={this.state.availability.indexOf(availability.recordId) > -1 && true}
                                                    onChange={this.onAvailabilityChange}
                                                />
                                            </td> 
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
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
    interests: state.interests,
    availabilities: state.availabilities
});

const mapDispatchToProps = (dispatch) => ({
    startUpdateUser: (user) => dispatch(startUpdateUser(user)),
    startUpdateUserLocation: (user) => dispatch(startUpdateUserLocation(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);


                            // <select 
//                                 className="multiple-select" 
//                                 name="availability" 
//                                 size="6" 
//                                 multiple
//                                 defaultValue={['recDmj0waZL3td5fS','recmiujOyHwlG42hH']}
//                             >
//                                 {this.props.availabilities.map((availabilities) => (<option key={availabilities.recordId} value={availabilities.recordId}>{availabilities.name}</option>) )}
//                             </select>