import React from 'react';
import {Link} from 'react-router-dom';

const EventListItem = ({chatGroup, occurrence, startTime, date}) => (
    // <Link className="list-item" >        
    <div className="list-item">
        <div className="list-item__content">
            <h3 className="list-item__title">{occurrence}</h3>
            <span>{date}, {startTime}</span>
        </div>
    </div>
    // </Link>
);


export default EventListItem;