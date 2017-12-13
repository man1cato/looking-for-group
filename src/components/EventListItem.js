import React from 'react';
import {Link} from 'react-router-dom';

const EventListItem = ({id, occurrence, startTime, date}) => (
    <Link className="list-item" to={`/event/${id}`}>                             
        <div className="list-item--text">
            <h3 className="list-item__title">{occurrence}</h3>
            <span>{date}, {startTime}</span>
        </div>
    </Link>
);


export default EventListItem;