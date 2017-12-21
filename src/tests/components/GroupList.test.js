import React from 'react';
import {shallow} from 'enzyme';
import {GroupList} from '../../components/GroupList';
import user from '../fixtures/user';
import group from '../fixtures/group';
import events from '../fixtures/events';


test('should render GroupList message for a user without groups', () => {
    const wrapper = shallow(<GroupList groups={[]} events={[]}/>);
    expect(wrapper).toMatchSnapshot();
});

test('should render GroupList for a user with groups', () => {
    const wrapper = shallow(<GroupList groups={user.groups} area={user.area} events={events}/>);
    expect(wrapper).toMatchSnapshot();
});

test('should render GroupList message for a user with groups but no matching events', () => {
    const wrapper = shallow(<GroupList groups={user.groups} area={user.area} events={[]}/>);
    expect(wrapper).toMatchSnapshot();
});