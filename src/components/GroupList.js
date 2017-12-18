import React from 'react';
import {connect} from 'react-redux';
import GroupListItem from './GroupListItem';
import {Link} from 'react-router-dom';


export const GroupList = (props) => (
    <div>
        <div className="page-header">
            <div className="content-container">
                <h2 className="page-header__title">My Local Groups</h2>
                {!!props.area && <span>{props.area.name}</span>}
            </div>
        </div>
        <div className="content-container">
            <div className="list-body">
                {
                    props.groups.length === 0 ? (
                        <div className="list-item list-item--message">
                            <div>Please update your <span><Link to='/profile'>profile</Link></span> to see available groups in your area.</div>
                        </div>
                    ) : (
                        props.groups.map((group) => <GroupListItem key={group.id} {...group} /> )    
                    )
                }
            </div>
        </div>
    </div>
);


// const mapStateToProps = (state) =>  state.areas;

const mapStateToProps = (state) => ({ 
    groups: state.user.groups, 
    area: state.user.area
});

export default connect(mapStateToProps)(GroupList);
