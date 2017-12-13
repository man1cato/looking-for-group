import React from 'react';
import {connect} from 'react-redux';
import EventList from './EventList';

export const GroupPage = (props) => (
    <div className="content-container">
        <div className="page-header">
            <h2 className="page-header__title">{props.group.interest} Events in {props.group.area}</h2>
        </div>
        <h3>Available Times</h3>
        <EventList interest={props.group.interest} area={props.group.area} />
    </div>
);


const mapStateToProps = (state, props) => ({
    group: state.user.groups.find((group) => group.id === props.match.params.id)     //RETURNS GROUP OBJECT WHERE ID MATCHES URL ID PARAM
});

export default connect(mapStateToProps)(GroupPage);