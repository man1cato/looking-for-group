import React from 'react';
import {connect} from 'react-redux';

export const AreaPage = (props) => (
    <div>                            
        <div>
            <h2>{props.area.name}</h2>
        </div>
        <div>
            Airtable list goes here
            
        </div>
    </div>
);


const mapStateToProps = (state, props) => ({
    area: state.areas.areas.find((area) => area.id === props.match.params.id)     
});

export default connect(mapStateToProps)(AreaPage);

