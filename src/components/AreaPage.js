import React from 'react';
import {connect} from 'react-redux';
import getAreas from '../selectors/areas';

export const AreaPage = (props) => (
    <div>
        <h1>Areas</h1>
        <div>
            Put areas here
        </div>
    </div>
);

// const mapStateToProps = (state) => {
//     const view = 'Alpha Test List';
//     return {
//         areas: getAreas(view)
//     };
// };

// export default connect(mapStateToProps)(AreaPage);
