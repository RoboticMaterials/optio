import * as React from 'react'
import { render, fireEvent, configure } from '@testing-library/react'

// Import Test Components
import LoadUnloadFields from './load_unload_fields'

// Import components
import TestProviderRender from '../../../../../../methods/tests/test_provider_renderer'

// Import Store
import Store from '../../../../../../redux/store/index'


test('Renders Load Unload Fields Correctly', () => {
    const mockStore = Store

    mockStore.dispatch({
        type: 'SET_SELECTED_TASK', payload: {
            task: {

                "_id": "5dce4e79-758c-4a89-81f1-bd48a0a6550b",
                "name": "Route 1",
                "obj": "b81156bd-9859-498a-acfa-36c4451391f9",
                "type": "push",
                "quantity": 1,
                "device_type": "human",
                "handoff": true,
                "track_quantity": true,
                "map_id": "8cbe09ff-3bb0-11ea-975b-94c691a739e9",
                "processes": [
                    "2e0104ee-b145-4e88-9c84-6166e641284d"
                ],
                "load": {
                    "position": "1e133a26-dea9-4b06-b2b2-3b52d4b47ca2",
                    "station": "1e133a26-dea9-4b06-b2b2-3b52d4b47ca2",
                    "sound": null,
                    "instructions": "Load",
                    "timeout": "01:00"
                },
                "unload": {
                    "position": "824e5467-b497-478e-8004-d09fcf3efbad",
                    "station": "824e5467-b497-478e-8004-d09fcf3efbad",
                    "sound": null,
                    "instructions": "Unload"
                }

            }
        }
    })
    
    const { getByText, getByLabelText } = TestProviderRender(<LoadUnloadFields />, { store: mockStore })

    getByText('Confirm Unload?')
    getByText('Do you want to track transit time? This will display a Unload Button at the Unload Station')

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