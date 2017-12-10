import React from 'react';
import {Link} from 'react-router-dom';

const GroupListItem = ({id, interest}) => (
    <Link className="list-item" to={`/groups/${id}`}>                             
        <div>
            <h3 className="list-item__title">{interest}</h3>
        </div>
    </Link>
);


export default GroupListItem;