import React from 'react';
import {shallow} from 'enzyme';
import {GroupPage} from '../../components/GroupPage';
import user from '../fixtures/user';
import group from '../fixtures/group';
import events from '../fixtures/events';


test('should render GroupPage correctly', () => {
    const wrapper = shallow(<GroupPage group={group} events={events}/>);
    expect(wrapper).toMatchSnapshot();
});