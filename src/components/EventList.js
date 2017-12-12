import React from 'react';
import {connect} from 'react-redux';
import EventListItem from './EventListItem';


export const EventList = (props) => (
    <div>
        <div className="page-header">
            <div className="content-container">
                <h2 className="page-header__title">${interest} Events in {area}</h2>
            </div>
        </div>
        <div className="content-container">
            <div className="list-body">
                {
                    props.events.length === 0 ? (
                        <div className="list-item list-item--message">Please update your availability to be matched with events in your area.</div>
                    ) : (
                        props.events.map((event) => <EventListItem key={event.id} {...event} /> )    
                    )
                }
            </div>
        </div>
    </div>
);


// const mapStateToProps = (state) =>  state.areas;

const mapStateToProps = (state) => ({ events: state.events });

export default connect(mapStateToProps)(EventList);
