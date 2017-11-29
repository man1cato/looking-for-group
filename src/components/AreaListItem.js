import React from 'react';
import {Link} from 'react-router-dom';

const AreaListItem = ({id, name}) => (
    <Link className="list-item" to={`/areas/${id}`}>                             
        <div>
            <h3 className="list-item__title">{name}</h3>
        </div>
    </Link>
);


export default AreaListItem;