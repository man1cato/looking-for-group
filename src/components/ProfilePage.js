import React from 'react';
import {connect} from 'react-redux';
import {startUpdateUser, startUpdateUserArea, startUpdateUsersGroups} from '../actions/user';
// import InterestSelector from './InterestSelector';
import filterAvailabilities from '../utils/filterAvailabilities';
import geolocateUser from '../utils/geolocateUser';
import addUserToGroups from '../utils/addUserToGroups';

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
            additionalInterests: props.user.additionalInterests ? props.user.additionalInterests : [],
            availability: props.user.availability ? props.user.availability : '',
            area: props.user.area,
            groups: props.user.groups 
        };
    };
    onTextChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(() => ({ [name]: value }));
    };
    onBirthYearChange = (e) => {
        const birthYear = e.target.value;
        this.setState(() => ({ birthYear }));
    };
    onInterestChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(() => ({ [name]: value }));
    }
    onAvailabilityChange = (e) => {
        const checked = e.target.checked;
        const changedAvailability = e.target.name;
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
        if (this.state.postalCode !== this.props.user.postalCode) {
            
            const scriptBlock = document.createElement('div');          //CREATE <DIV> TO HOLD TEMPORARY DATA
            scriptBlock.id = 'scriptBlock';
            document.body.appendChild(scriptBlock);
            
            const scriptNode = document.createElement('script');
            scriptNode.innerHTML = `getPlaceDetails('${this.state.recordId}','${this.state.postalCode}')`;  //MAKE CALL TO GOOGLE PLACES THEN CREATE <DIV> WITH RESPONSE INSIDE
            document.getElementById('scriptBlock').appendChild(scriptNode);
            
            setTimeout(() => {
                const placeDetails = JSON.parse(document.getElementById('placeDetails').textContent);
                this.props.startUpdateUserArea(this.state, placeDetails);                      //UPDATE USER'S AREA
                document.body.removeChild(scriptBlock);                         //DELETE <DIV> BLOCK TO CLEAR DATA
            }, 2000);
        } 
        
        setTimeout(() => {this.props.startUpdateUser(this.state)}, 6000);                                 //UPDATE USER'S PROFILE
        
        const snackbar = document.getElementById("snackbar");
        snackbar.className = "snackbar--show";
        setTimeout(() => { snackbar.className = snackbar.className.replace("snackbar--show", ""); }, 2000);
        
        setTimeout(() => {this.props.history.push('/')}, 8000);
        
    };
    render() {
        return (
            <div className="content-container">
            {console.log('Render ProfilePage:', this.state)}
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
                            <button id="profile-button" className="button">Save Profile</button>
                        </div>
                        <div id="map"></div>
                    </form>
                </div>
                <div className="snackbar" id="snackbar">Profile has been updated! Redirecting to dashboard...</div>
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
    startUpdateUserArea: (recordId, placeDetails) => dispatch(startUpdateUserArea(recordId, placeDetails))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);


// e.preventDefault();
//         if (this.state.postalCode !== this.props.user.postalCode) {
//             const script = document.createElement('script');
//             script.innerHTML = `getPlaceDetails('${this.state.recordId}','${this.state.postalCode}')`;
//             document.body.appendChild(script);
//             setTimeout(() => {
//                 const placeDetails = JSON.parse(document.getElementById('placeDetails').textContent);
//                 this.props.startUpdateUserArea(this.state, placeDetails);                      //UPDATE USER'S AREA
//             },2000);
            
//             setTimeout(() => console.log('State after startUpdateUserArea:', this.state), 5000);
//         }
//         const snackbar = document.getElementById("snackbar");
//         snackbar.className = "snackbar--show";
//         setTimeout(() => { snackbar.className = snackbar.className.replace("snackbar--show", "") }, 2000);
        
//         setTimeout(() => this.props.startUpdateUser(this.state), 5000);                                 //UPDATE USER'S PROFILE
//         // setTimeout(() => {this.props.history.push('/')}, 5000);
//         setTimeout(() => console.log('Dispatched state:', this.state), 8000); 