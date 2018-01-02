import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import GroupListItem from './GroupListItem';
import {Link} from 'react-router-dom';


export const GroupList = (props) => (
    <div>
        <div className="content-container">
            <div className="list-body">
                {
                    !_.isEmpty(props.groups) && !_.isEmpty(props.events) && (
                        props.groups.map((group) => group.eventCount > 0 && <GroupListItem key={group.id} {...group} /> )
                    ) || !_.isEmpty(props.groups) && _.isEmpty(props.events) && (
                        <div className="list-item list-item--message">
                            <div>It seems that your interest groups are still growing their populations. As an early tester, this is expected. Please check back soon to see which interests groups become available as other users join!</div>
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
