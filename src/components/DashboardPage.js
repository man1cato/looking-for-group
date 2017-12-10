import React from 'react';
import {Link} from 'react-router-dom';
import GroupList from './GroupList';


const DashboardPage = () => (
    <div>
        <div className="content-container">
            First time here? Make sure to set up your <Link to="/profile">profile</Link>
        </div>
        <GroupList />
    </div>
);


export default DashboardPage;