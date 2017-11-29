import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import AreaListItem from './AreaListItem';


export const AreaList = (props) => (
    <div>
        {console.log('from AreaList:', props)}
        <div>
            {
                props.areas.length === 0 ? (
                    <div className="list-item list-item--message">No areas</div>
                ) : (
                    props.areas.map((area) => <AreaListItem key={area.id} {...area} /> )    
                )
            }
        </div>
    </div>
);


// const mapStateToProps = (state) =>  state.areas;

const mapStateToProps = (state) => ({ areas: state.areas.areas });

export default connect(mapStateToProps)(AreaList);
