import React from 'react';
import GroupList from './GroupList';
import {Link} from 'react-router-dom';
import Footer from '../components/Footer';

const DashboardPage = () => (
    <div>
        <div className="page-header">
            <div className="content-container">
                <h2 className="page-header__title">My Local Interest Groups</h2>
                <div>Groups will only appear for those interests that have a sufficient number of people in the area who share that interest.</div>
            </div>
        </div>
        <GroupList />
        <Footer />
    </div>
);


export default DashboardPage;