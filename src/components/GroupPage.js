import React from 'react';
import {connect} from 'react-redux';

export const GroupPage = (props) => (
    <div className="content-container">                            
        <div>
            <h2>{props.group.interest} in {props.group.area}</h2>
        </div>
        <div>
            List of matching availability groups with user count link to chat group goes here.
        </div>
    </div>
);


const mapStateToProps = (state, props) => ({
    group: state.groups.find((group) => group.id === props.match.params.id)     //RETURNS GROUP OBJECT WHERE ID MATCHES URL ID PARAM
});

export default connect(mapStateToProps)(GroupPage);