import React from 'react';
import BasicListItem from './basic_list_item';
import {shallow, mount} from 'enzyme'

it('renders without crashing', () => {
  shallow(<BasicListItem/>)
})

it('renders correctly', () => {
  const tree = shallow(<BasicListItem/>)
  expect(JSON.stringify(tree)).toMatchSnapshot()
})
