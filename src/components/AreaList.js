import React from 'react';
import {connect} from 'react-redux';
import AreaListItem from './AreaListItem';


export const AreaList = (props) => (
    <div>
        <div className="page-header">
            <div className="content-container">
                <h2 className="page-header__title">Areas</h2>
                <span>Select the area in which you live.</span>
            </div>
        </div>
        <div className="content-container">
            <div className="list-body">
                {
                    props.areas.length === 0 ? (
                        <div className="list-item list-item--message">No areas</div>
                    ) : (
                        props.areas.map((area) => <AreaListItem key={area.id} {...area} /> )    
                    )
                }
            </div>
        </div>
    </div>
);


// const mapStateToProps = (state) =>  state.areas;

const mapStateToProps = (state) => ({ areas: state.areas });

export default connect(mapStateToProps)(AreaList);
