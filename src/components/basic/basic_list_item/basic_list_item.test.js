import React from 'react';
import BasicListItem from './basic_list_item';
import {theme} from '../../../theme';
import { ThemeProvider } from 'styled-components';

//Testing Tool Imports
import {shallow, mount} from 'enzyme'
import renderer from 'react-test-renderer';
import {render, screen} from '@testing-library/react'

/*
  Basic test shallow renders component and makes sure it doesn't crash.
  Shallow rendering renders a component but not its children.
  This is Good for isolating the component for testing
*/
it('Renders without crashing', () => {
  shallow(<BasicListItem/>)
})

/*
  Snapshot testing ensures the current render matches the stored Snapshot
  for example, If the component is 'squished' by nearby containers this will
  be caught. Just type 'u' on terminal if you want to update snapshot
*/
it('Matches the stored UI snapshot', () => {
  const tree = renderer
    .create(<ThemeProvider theme={theme['main']}>
              <BasicListItem/>
            </ThemeProvider>
            )
    .toJSON()

  expect(tree).toMatchSnapshot()
})

/*
  Using the react testing library we can make sure props that should be visible
  on the screen are actually there. In this case the task Queue list item should
  be displaying the route title. screen.getbytext searches for this text on the screen
*/
it('Renders the correct title', () => {
  render(<ThemeProvider theme={theme['main']}>
            <BasicListItem title = 'Awesome Route'/>
          </ThemeProvider>
        )
  screen.getByText('wesome Rou', {exact: false})
  screen.getByText('Awesome Route')
})


/*
  Enzyme can be used to simulate actions on elements. Here we find the container
  that has the onClick prop passed to it in the component. Next a click is simulated
  and then we check that the mock function is called. Other things can be done too
  like seeing what args were passed
*/
it('Calls the right functions when clicked', () => {
    const onClickMock = jest.fn()
    const wrapper = shallow(
      <BasicListItem onClick = {onClickMock}/>
  )

  const clickableArea = wrapper.find('.content-container')
  clickableArea.simulate('click')

  expect(onClickMock).toHaveBeenCalledTimes(1)
  //expect(onClickMock).toHaveBeenCalledWith(true)
})

/*
  This test checks that a prop passed into the component is contained by the
  correct element. In this case we check that the status container recieves the
  status prop.
*/
it('Ensures Status prop is correct', () => {
    const wrapper = shallow(
      <BasicListItem status = 'running'/>
  )
  const status = wrapper.find('.status')
  expect(status.props().children).toBe('running')
})
