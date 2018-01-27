import React from 'react';
import {connect} from 'react-redux';
import EventListItem from './EventListItem';


export const EventList = (props) => (
    <div>
            {
                props.events.length > 0 ? (
                    props.events.map((event) => {
                        if (props.interest === event.interest) {
                            return (<EventListItem key={event.id} {...event} groupAvailabilities={props.groupAvailabilities}/> );
                        }
                    })
                ) : (
                    <div className="list-item list-item--message">There are currently no available event times for this group. As more people join, this page will populate.</div>
                )
            }
    </div>
);


const mapStateToProps = (state) => ({ events: state.events });

export default connect(mapStateToProps)(EventList);
