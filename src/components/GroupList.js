import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import GroupListItem from './GroupListItem';
import {Link} from 'react-router-dom';


export const GroupList = (props) => (
    <div>
        <div className="page-header">
            <div className="content-container">
                <h2 className="page-header__title">My Local Interest Groups</h2>
                <div>Groups will only appear for those interests that have a sufficient number of people in the area who share that interest.</div>
            </div>
        </div>
        <div className="content-container">
            <div className="list-body">
                {
                    !_.isEmpty(props.groups) && !_.isEmpty(props.events) && (
                        props.groups.map((group) => group.eventCount > 0 && <GroupListItem key={group.id} {...group} /> )
                    ) || !_.isEmpty(props.groups) && _.isEmpty(props.events) && (
                        <div className="list-item list-item--message">
                            <div>Apologies, but it seems there are insufficient users in your area who match your interests. We are currently testing in Roanoke, VA and Miami, FL.</div>
                        </div>
                    ) || (
                        <div className="list-item list-item--message">
                            <div>Please update your <span><Link to='/profile'>profile</Link></span> to see available groups in your area. If you've already done so, please give this a moment to load.</div>
                        </div>
                    )
                }
            </div>
        </div>
    </div>
);


const mapStateToProps = (state) => ({ 
    groups: state.user.groups, 
    area: state.user.area,
    events: state.events
});

export default connect(mapStateToProps)(GroupList);
