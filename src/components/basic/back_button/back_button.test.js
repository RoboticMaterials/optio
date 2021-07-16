import React from 'react';
import BackButton from './back_button';
import {shallow, mount} from 'enzyme'

it('renders without crashing', () => {
  shallow(<BackButton/>)
})
