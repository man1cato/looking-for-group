import React from 'react';
import {connect} from 'react-redux';
import EventListItem from './EventListItem';


export const EventList = (props) => (
    <div className="content-container">
        <div className="list-body">
            {
                props.events.length === 0 ? (
                    <div className="list-item list-item--message">Please update your availability to be matched with events in your area. Otherwise, give this a few seconds to load.</div>
                ) : (
                    props.events.map((event) => {
                        if (props.interest === event.interest) {
                            return (<EventListItem key={event.id} {...event} /> );
                        }
                    })
                )
            }
        </div>
    </div>
);


const mapStateToProps = (state) => ({ events: state.events });

export default connect(mapStateToProps)(EventList);
