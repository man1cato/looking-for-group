import React from 'react';
import {Link} from 'react-router-dom';
import AreaList from './AreaList';


const DashboardPage = () => (
    <div>
        <div>
            First time here? Make sure to set up your <Link to="/profile">Profile</Link>
        </div>
        <AreaList />
    </div>
);


export default DashboardPage;