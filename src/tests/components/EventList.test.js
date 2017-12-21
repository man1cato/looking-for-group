import React from 'react';
import {shallow} from 'enzyme';
import {EventList} from '../../components/EventList';
import events from '../fixtures/events';


test('should render event list with events', () => {
    const wrapper = shallow(<EventList interest={events[0].interest} area={events[0].area} events={events}/>);
    expect(wrapper).toMatchSnapshot();
});

test('should render event list with empty message', () => {
    const wrapper = shallow(<EventList events={[]}/>);
    expect(wrapper).toMatchSnapshot();
});