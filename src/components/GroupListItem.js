import React from 'react';
import {Link} from 'react-router-dom';

const GroupListItem = ({id, interest, userCount, icons}) => (
    <Link className="list-item" to={`/groups/${id}`}>                             
        <img src={icons.large.url} height="40" width="auto" />
        <div className="list-item__content">
                <h3 className="list-item__title">{interest}</h3> 
            <div className="list-item__right">
                <div>{userCount}</div> 
                <img src="/images/users-black.png" height="24" width="auto" /> 
            </div>
        </div>
    </Link>
);


export default GroupListItem;