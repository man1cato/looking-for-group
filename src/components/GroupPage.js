import React from 'react';
import {connect} from 'react-redux';
import EventList from './EventList';

export const GroupPage = (props) => (
    <div>
        <div className="page-header">
            <div className="content-container page-header--flex">
                <img src={props.group.icons.large.url} height="62" width="auto" />
                <div>
                    <h2 className="page-header__title">{props.group.interest} Event Groups</h2>
                    <span>{props.group.area}</span>
                </div>
            </div>
        </div>
        <div className="content-container">
            <div className="list-header">
                <div className="list-header__title">Available Times</div>
                <div className="list-header__subtitle">
                    Viewing {props.events.length} of {props.group.eventCount} event groups. Filtering is based on your availability. Select a time to be taken to the corresponding GroupMe chat group.
                </div>
            </div>
            <div className="list-body">
                <EventList interest={props.group.interest} area={props.group.area} groupAvailabilities={props.group.availabilities}/>
            </div>
        </div>
    </div>
);


const mapStateToProps = (state, props) => ({
    group: state.user.groups.find((group) => group.id === props.match.params.id),       //RETURNS GROUP OBJECT WHERE ID MATCHES URL ID PARAM
    events: state.events.filter((event) => event.groupId === props.match.params.id)     //RETURNS ARRAY OF EVENT OBJECTS WHERE GROUPID MATCHES URL ID PARAM
});

export default connect(mapStateToProps)(GroupPage);