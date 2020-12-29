import * as React from 'react'
import { render, fireEvent, configure } from '@testing-library/react'

import LoadUnloadFields from './load_unload_fields'

import { getDevices } from '../../../../../../api/devices_api'

import { Provider } from 'react-redux'

const ReduxProvider = ({ children, reduxStore }) => (
    <Provider store={reduxStore}>{children}</Provider>
)



test('Renders Load Unload Fields Correctly', () => {
    jest.mock('react-redux', () => {
        const AcutalRedux = require.requireActual('react-redux')
        return {
            ...AcutalRedux,
            useSelector: jest.fn().mockImplementation(() => {
                return mockState
            })
        }
    })
    const { getByText, getByLabelText } = render(<LoadUnloadFields />)

    getByText('Unload')

})

// test('Allows the ability to change field data', () => {

//     const { getByText, getByLabelText } = render(<LoadUnloadFields />)

//     const input = getByLabelText('Some Label')

//     fireEvent.change(input, { target: { value: 'Some Value' } })
//     fireEvent.click(getByText('Some Button'))

//     // The value should now be here
//     getByText('Some Value')

//     // The label should ahve chnaged
//     getByText('Some new label')

// })


// test('Allow user to interact with API', () => {
//     jest.mock('../../../../../../api/devices_api')
// })