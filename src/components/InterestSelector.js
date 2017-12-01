import React from 'react';
import {connect} from 'react-redux';


export class InterestSelector extends React.Component{
    // onChange = () => {
    //     this.props.onChange
    // }
    render() {
        return (
            <select 
                className="select" 
                name={this.props.name} 
                defaultValue={this.props.defaultValue}
                // onChange={this.onChange}
            >
                <option key="0" value=""></option>          //blank option
                {this.props.interests.map((interest) => (<option key={interest.id} value={interest.id}>{interest.name}</option>) )}
            </select>
        );
    }
} 


const mapStateToProps = (state) => ({
    interests: state.interests
});

export default connect(mapStateToProps)(InterestSelector);