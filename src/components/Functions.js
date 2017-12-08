// import _ from 'lodash';
import getPlaceDetails from '../../public/getPlaceDetails';

// export const hello = () => {
//   var element = document.createElement('div');

//   element.innerHTML = _.join(['Hello', 'webpack'], ' ');

//   return element;
// };

export const initialize = () => {
    const script = document.createElement('script');
    script.innerHTML = getPlaceDetails;
    return document.body.appendChild(script);
};

