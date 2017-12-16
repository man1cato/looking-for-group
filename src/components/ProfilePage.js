import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import {startUpdateUser} from '../actions/user';
import filterInterests from '../utils/filterInterests';
import filterAvailabilities from '../utils/filterAvailabilities';
import geolocateUser from '../utils/geolocateUser';


export class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {      //default state
            uid: props.user.uid,
            email: props.user.email,
            recordId: props.user.recordId,
            firstName: props.user.firstName || '',
            lastName: props.user.lastName || '',
            postalCode: props.user.postalCode || '',
            birthYear: props.user.birthYear || moment().year(),
            interest1: props.user.interest1 || '',
            interest2: props.user.interest2 || '',
            interest3: props.user.interest3 || '',
            additionalInterests: props.user.additionalInterests || [],
            allInterests: props.user.allInterests,
            availability: props.user.availability || '',
            area: props.user.area,
            groups: props.user.groups 
        };
    };
    onTextChange = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        this.setState(() => ({ [id]: value }));
    };
    onInterestChange = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        const interest1 = id === 'interest1' ? value : this.state.interest1;
        const interest2 = id === 'interest2' ? value : this.state.interest2;
        const interest3 = id === 'interest3' ? value : this.state.interest3;
        const additionalInterests = this.state.additionalInterests;
        const values = additionalInterests.filter((interest) => interest !== value);
        const allInterests = [interest1, interest2, interest3, ...values];
        this.setState(() => ({ [id]: value, additionalInterests: values, allInterests: _.compact(allInterests) }));
    }
    onOtherInterestsChange = (e) => {
        const selected = document.querySelectorAll('#additionalInterests option:checked');
        const values = Array.from(selected).map((el) => el.value);
        const allInterests = [this.state.interest1, this.state.interest2, this.state.interest3, ...values];
        this.setState(() => ({ additionalInterests: _.compact(values), allInterests: _.compact(allInterests) }));
    }
    onAvailabilityChange = (e) => {
        const checked = e.target.checked;
        const changedAvailability = e.target.id;
        if (checked) {
            this.setState(() => ({ availability: [changedAvailability, ...this.state.availability] }));
        } else {
            this.setState(() => ({ availability: this.state.availability.filter((availability) => availability !== changedAvailability) }));
        }
    }
    onSubmit = (e) => {
        e.preventDefault();
        
        if (this.state.postalCode !== this.props.user.postalCode) {
            
            const scriptBlock = document.createElement('div');                  //CREATE <DIV> TO HOLD TEMPORARY DATA
            scriptBlock.id = 'scriptBlock';
            document.body.appendChild(scriptBlock);
            
            const scriptNode = document.createElement('script');
            scriptNode.innerHTML = `getPlaceDetails('${this.state.recordId}','${this.state.postalCode}')`;  //MAKE CALL TO GOOGLE PLACES THEN CREATE <DIV> WITH RESPONSE INSIDE
            document.getElementById('scriptBlock').appendChild(scriptNode);
            setTimeout(() => {const placeDetails = JSON.parse(document.getElementById('placeDetails').textContent);},2000)
            setTimeout(() => {
                console.log('placeDetails:',placeDetails)
                this.props.startUpdateUser(this.state, placeDetails);                                 //UPDATE USER'S PROFILE
                document.body.removeChild(scriptBlock);                         //DELETE <DIV> BLOCK TO CLEAR DATA
            }, 3000);
        } else {
            this.props.startUpdateUser(this.state);                                 //UPDATE USER'S PROFILE
        }
        
        /*****SNACKBAR*****/
        const x = document.getElementById("snackbar");                                      // Get the snackbar DIV
        x.className = "show";                                                               // Add the "show" class to DIV
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);     // After 3 seconds, remove the show class from DIV
        /******************/
        
        setTimeout(() => {this.props.history.push('/')}, 4000);
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
                                id="firstName"
                                value={this.state.firstName}
                                onChange={this.onTextChange}
                            />
                            <input 
                                className="text-input"
                                type="text"
                                id="lastName"
                                value={this.state.lastName}
                                onChange={this.onTextChange}
                            />
                        </div>
                        <div>
                            Birth Year: <input 
                                className="text-input"
                                type="number" 
                                id="birthYear" 
                                min="1900" 
                                max="2020"
                                value={this.state.birthYear}
                                onChange={this.onTextChange}
                            />
                        </div>
                        <div>
                            Postal Code: <input 
                                className="text-input"
                                type="text" 
                                id="postalCode"
                                value={this.state.postalCode}
                                onChange={this.onTextChange}
                            />
                        </div>
                        <div>
                            #1 Interest: <select 
                                className="select" 
                                id="interest1" 
                                defaultValue={this.state.interest1}
                                onChange={this.onInterestChange}
                            >
                                <option></option>          //blank option
                                {this.props.interests.map( (interest) => (<option key={interest.id} value={interest.id}>{interest.name}</option>) )}
                            </select>
                        </div>
                        <div>
                            #2 Interest: <select 
                                className="select" 
                                id="interest2" 
                                defaultValue={this.state.interest2}
                                onChange={this.onInterestChange}
                            >
                                <option></option>          //blank option
                                {this.props.interests.map( (interest) => (<option key={interest.id} value={interest.id}>{interest.name}</option>) )}
                            </select>
                        </div>
                        <div>
                            #3 Interest: <select 
                                className="select" 
                                id="interest3" 
                                defaultValue={this.state.interest3}
                                onChange={this.onInterestChange}
                            >
                                <option></option>          //blank option
                                {this.props.interests.map( (interest) => (<option key={interest.id} value={interest.id}>{interest.name}</option>) )}
                            </select>
                        </div>
                        <div>
                            Other Interests: <select 
                                className="multiple-select" 
                                id="additionalInterests" 
                                size="6"
                                defaultValue={this.state.additionalInterests}
                                onChange={this.onOtherInterestsChange}
                                multiple
                            >
                                <option></option>          //blank option
                                {
                                    filterInterests(this.props.interests, [this.state.interest1, this.state.interest2, this.state.interest3])
                                        .map( (interest) => (<option key={interest.id} value={interest.id}>{interest.name}</option>) )
                                }
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
                                                    id={availability.recordId} 
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
                                                    id={availability.recordId} 
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
                                                    id={availability.recordId} 
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
                                                    id={availability.recordId} 
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
    startUpdateUser: (user, placeDetails) => dispatch(startUpdateUser(user, placeDetails))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);

