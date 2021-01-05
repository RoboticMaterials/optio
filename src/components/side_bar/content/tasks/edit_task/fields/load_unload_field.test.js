import * as React from 'react'
import { render, fireEvent, configure } from '@testing-library/react'

// Import Test Components
import LoadUnloadFields from './load_unload_fields'

// Import components
import TestProviderRender from '../../../../../../methods/tests/test_provider_renderer'

// Import Store
import Store from '../../../../../../redux/store/index'

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

test('Renders Load Unload Fields Correctly', () => {

    const { getByText, getByLabelText } = TestProviderRender(<LoadUnloadFields />, { store: mockStore })

    getByText('Confirm Unload?')
    getByText('Do you want to track transit time? This will display a Unload Button at the Unload Station')

})

// test('Load Unload Field Snapshot', () => {
//     const component = renderer.create(
//         TestProviderRender(<LoadUnloadFields />, { store: mockStore })
//     )

//     let tree = component.toJSON()
//     expect(tree).toMatchSnapshot()
// })
