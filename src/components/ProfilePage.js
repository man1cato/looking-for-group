import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import {startUpdateUser} from '../actions/user';

// import loader from '!!file-loader!../../public/images/loader.gif';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {      //default state
            firebaseId: props.user.firebaseId,
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
            groups: props.user.groups,
            buttonDisabled: true
        };
    }
    // componentDidMount() {
    //     if (this.state.area === undefined) {
    //         try {
    //             navigator.geolocation.getCurrentPosition((position) => {
    //                 console.log("User's position:", position);
    //                 const lat = position.coords.latitude;
    //                 const lng = position.coords.longitude;
    //                 const areaId = newGeolocateUser(this.state.recordId,lat,lng);
    //                 this.setState(() => ({ 
    //                     area: {id: areaId, ...this.state.area}, 
    //                     lat,
    //                     lng
    //                 }));
    //             });
                
    //             const scriptBlock = document.createElement('div');                  //CREATE <DIV> TO HOLD TEMPORARY DATA
    //             scriptBlock.id = 'scriptBlock';
    //             document.body.appendChild(scriptBlock);
            
    //             const scriptNode = document.createElement('script');
    //             scriptNode.innerHTML = `reverseGeocode(${this.state.lat},${this.state.lng})`;  //MAKE CALL TO GOOGLE GEOCODER THEN CREATE <DIV> WITH RESPONSE INSIDE
    //             document.getElementById('scriptBlock').appendChild(scriptNode);
                
    //             setTimeout(async () => {
    //                 console.log('geocoder textContent from ProfilePage:',document.getElementById('placeDetails').textContent);
    //                 const placeDetails = await JSON.parse(document.getElementById('placeDetails').textContent);
    //                 // console.log('placeDetails:',placeDetails);
    //                 await this.props.startUpdateUser(this.state, placeDetails);                                 //UPDATE USER'S PROFILE
    //                 document.body.removeChild(scriptBlock);                         //DELETE <DIV> BLOCK TO CLEAR DATA
    //                 this.props.history.push('/');
    //             }, 2500);
                
    //         } catch (e) {
    //             switch(e.code) {
    //                 case e.PERMISSION_DENIED:
    //                     console.log("User denied the request for Geolocation.");
    //                     alert("Location is needed to match users. Please make sure to provide your postal code.");
    //                     break;
    //                 case e.POSITION_UNAVAILABLE:
    //                     console.log("Location information is unavailable.");
    //                     alert("Could not retrieve location information. Please make sure to provide your postal code to be matched with others.");
    //                     break;
    //                 case e.TIMEOUT:
    //                     console.log("The request to get user location timed out.");
    //                     break;
    //                 case e.UNKNOWN_ERROR:
    //                     console.log("An unknown error occurred.");
    //                     break;
    //             }
    //         }
    //     }
        
    // }
    filterInterests = (interests, filteringInterests) => {        //array of objects, array
        const filterArray = filteringInterests.map((interestId) => _.find(interests, ['id', interestId]) );
        const filteredInterests = _.difference(interests, filterArray);
        return filteredInterests;
    };
    filterAvailabilities = (availabilities, dayOfWeek) => {
        return availabilities.filter((availability) => availability.dayOfWeek === dayOfWeek );
    };
    onFormChange = () => {
        this.setState(() => ({ buttonDisabled: false }));
        document.getElementById('profile-button').className = "button button--profile";
    }
    onTextChange = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        this.setState(() => ({ [id]: value }));
    }
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
        this.setState(() => ({ buttonDisabled: true }));
        document.getElementById('profile-button').className = "button button--disabled button--profile";
        document.getElementById("snackbar").className = "snackbar animated-show";    // TRIGGER SNACKBAR ANIMATION
        
        if (this.state.postalCode !== this.props.user.postalCode) {             //IF POSTAL CODE WAS UPDATED...
            console.log('Postal code changed');
            const scriptBlock = document.createElement('div');                  //CREATE <DIV> TO HOLD TEMPORARY DATA
            scriptBlock.id = 'scriptBlock';
            document.body.appendChild(scriptBlock);
            
            const scriptNode = document.createElement('script');
            scriptNode.innerHTML = `getPlaceDetails('${this.state.recordId}','${this.state.postalCode}')`;  //MAKE CALL TO GOOGLE PLACES THEN CREATE <DIV> WITH RESPONSE INSIDE
            document.getElementById('scriptBlock').appendChild(scriptNode);
            
            setTimeout(async () => {
                console.log('placeDetails textContent from ProfilePage:',document.getElementById('placeDetails').textContent);
                const placeDetails = await JSON.parse(document.getElementById('placeDetails').textContent);
                // console.log('placeDetails:',placeDetails);
                await this.props.startUpdateUser(this.state, placeDetails);                                 //UPDATE USER'S PROFILE
                document.body.removeChild(scriptBlock);                         //DELETE <DIV> BLOCK TO CLEAR DATA
                this.props.history.push('/');
            }, 2500);
        } else {
            console.log('Profile changed');
            setTimeout(async () => {
                await this.props.startUpdateUser(this.state);                   //UPDATE USER'S PROFILE
                this.props.history.push('/');
            }, 2000);
        }
    };
    render() {
        return (
            <div className="content-container">
                <div>
                    <h2>User Profile</h2>
                </div> 
                <div>
                    <form className="form" onChange={this.onFormChange} onSubmit={this.onSubmit}>
                        <div className="input">
                            <h4>Name:</h4> 
                            <input
                                className="text-input"
                                type="text"
                                id="firstName"
                                placeholder="First"
                                value={this.state.firstName}
                                onChange={this.onTextChange}
                            />
                            <input 
                                className="text-input"
                                type="text"
                                id="lastName"
                                placeholder="Last"
                                value={this.state.lastName}
                                onChange={this.onTextChange}
                            />
                        </div>
                        <div className="input">
                            <h4>Birth Year:</h4> 
                            <input 
                                className="text-input"
                                type="number" 
                                id="birthYear" 
                                min="1900" 
                                max="2020"
                                value={this.state.birthYear}
                                onChange={this.onTextChange}
                            />
                        </div>
                        <div className="input">
                            <h4>Postal Code:</h4> 
                            <input 
                                className="text-input"
                                type="text" 
                                id="postalCode"
                                value={this.state.postalCode}
                                onChange={this.onTextChange}
                            />
                        </div>
                        <div className="input">
                            <h4>#1 Interest:</h4> 
                            <select 
                                className="select" 
                                id="interest1" 
                                defaultValue={this.state.interest1}
                                onChange={this.onInterestChange}
                            >
                                <option></option>          //blank option
                                {this.props.interests.map( (interest) => (<option key={interest.id} value={interest.id}>{interest.name}</option>) )}
                            </select>
                        </div>
                        <div className="input">
                            <h4>#2 Interest:</h4> 
                            <select 
                                className="select" 
                                id="interest2" 
                                defaultValue={this.state.interest2}
                                onChange={this.onInterestChange}
                            >
                                <option></option>          //blank option
                                {this.props.interests.map( (interest) => (<option key={interest.id} value={interest.id}>{interest.name}</option>) )}
                            </select>
                        </div>
                        <div className="input">
                            <h4>#3 Interest:</h4> 
                            <select 
                                className="select" 
                                id="interest3" 
                                defaultValue={this.state.interest3}
                                onChange={this.onInterestChange}
                            >
                                <option></option>          //blank option
                                {this.props.interests.map( (interest) => (<option key={interest.id} value={interest.id}>{interest.name}</option>) )}
                            </select>
                        </div>
                        <div className="input">
                            <h4>Other Interests:</h4> 
                            <select 
                                className="multiple-select" 
                                id="additionalInterests" 
                                size="6"
                                defaultValue={this.state.additionalInterests}
                                onChange={this.onOtherInterestsChange}
                                multiple
                            >
                                <option></option>          //blank option
                                {
                                    this.filterInterests(this.props.interests, [this.state.interest1, this.state.interest2, this.state.interest3])
                                        .map( (interest) => (<option key={interest.id} value={interest.id}>{interest.name}</option>) )
                                }
                            </select>
                        </div>
                        <h4>Availability:</h4>
                        <div className="input">
                            <table className="table" cellSpacing="0" cellPadding="0">
                                <tbody>
                                    <tr>
                                        <th className="table__first-column"></th>
                                        <th><div><span>Morning <nobr>(8am-12pm)</nobr></span></div></th>
                                        <th><div><span>Afternoon <nobr>(12pm-5pm)</nobr></span></div></th>
                                        <th><div><span>Evening <nobr>(5pm-10pm)</nobr></span></div></th>
                                        <th><div><span><nobr>Late Night</nobr> <nobr>(10pm-2am)</nobr></span></div></th>
                                    </tr>
                                    {weekdays.map((weekday) => (
                                        <tr key={weekday}>
                                            <td className="table__first-column" key={weekday}>{weekday.substr(0,3)}</td>
                                            {this.filterAvailabilities(this.props.availabilities, weekday).map((availability) => (
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <button id="profile-button" className="button button--disabled button--profile" disabled={this.state.buttonDisabled}>Save Profile</button>
                        </div>
                        <div id="map"></div>
                    </form>
                </div>
                <div className="snackbar" id="snackbar">
                    Profile has been updated. Redirecting to dashboard. This may take a minute... 
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
    startUpdateUser: (user, placeDetails) => dispatch(startUpdateUser(user, placeDetails))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);