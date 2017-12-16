import React from 'react';
import {connect} from 'react-redux';
import EventListItem from './EventListItem';


export const EventList = (props) => (
    <div>
            {
                props.events.length === 0 ? (
                    <div className="list-item list-item--message">This may take some time to load. If it has been more than a minute, then there are no available event times for this group. </div>
                ) : (
                    props.events.map((event) => {
                        if (props.interest === event.interest) {
                            return (<EventListItem key={event.id} {...event} /> );
                        }
                    })
                )
            }
    </div>
);


const mapStateToProps = (state) => ({ events: state.events });

export default connect(mapStateToProps)(EventList);
