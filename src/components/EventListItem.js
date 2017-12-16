import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

const apiKey = 'keyzG8AODPdzdkhjG';
const baseUrl = 'https://api.airtable.com/v0/appOY7Pr6zpzhQs6l';


export class EventListItem extends React.Component {
    constructor(props) {
        super(props);
    };
    onSelectChatGroup = () => {
        const eventId = this.props.id;
        const memberIds = this.props.memberIds || [];
        memberIds.push(this.props.user.recordId);
        axios.patch(`${baseUrl}/Events/${eventId}?api_key=${apiKey}`, {
            "fields": {
                "Members": memberIds
            }
        })
    }
    render() {
        return (
            <a className="list-item" href={this.props.chatGroupUrl} target="_blank" onClick={this.onSelectChatGroup}>        
                <div className="list-item__content--wrap">
                    <div className="list-item__left">
                        <h3 className="list-item__title">{this.props.occurrence}</h3>
                    </div>
                    <div>{this.props.date}, {this.props.startTime}</div>
                </div>
            </a>
        )
    }
}

/***To replace content once member count is figured out***/
// <div className="list-item__wrap">
//     <h3 className="list-item__title list-item__left">{this.props.occurrence}</h3>
//     <span>{this.props.date}, {this.props.startTime}</span>
// </div>
// <div className="list-item__right">
//     <div>{this.props.memberCount}</div>
//     <img src="/images/users-black.png" height="24" width="auto" /> 
// </div>
/*********************************************************/

const mapStateToProps = (state) => ({
    user: state.user
});

export default connect(mapStateToProps)(EventListItem);