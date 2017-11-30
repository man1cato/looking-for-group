import React from 'react';
import {connect} from 'react-redux';

export const AreaPage = (props) => {
    let src;
    if (props.area.id == 'rec9sdndkH9ZaQBqh') {
        src = 'shrFAaCad57e1C0yc';
    } else if (props.area.id == 'rec6NLE3ZCpBgsYIT') {
        src = 'shrpH6QWCSvvWzjgQ';
    }
    return (
        <div className="content-container">                            
            <div>
                <h2>{props.area.name}</h2>
            </div>
            <iframe 
                className="airtable-embed" 
                src={`https://airtable.com/embed/${src}?backgroundColor=orange&layout=card&viewControls=on`}
            >
            </iframe>
        </div>
    );
};


const mapStateToProps = (state, props) => ({
    area: state.areas.find((area) => area.id === props.match.params.id)     
});

export default connect(mapStateToProps)(AreaPage);

