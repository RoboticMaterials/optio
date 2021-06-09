import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux'

import MapApp from './map_app/map_app'
import { deepCopy } from '../../../methods/utils/utils'
import { postSettings } from '../../../redux/actions/settings_actions'

const MapApps = (props) => {

    const {

    } = props;

    const settings = useSelector(state => state.settingsReducer.settings);

    const dispatch = useDispatch();
    const dispatchPostSettings = (settings) => dispatch(postSettings(settings))

    const toggleMapApp = (appName) => {

        const settingsCopy = deepCopy(settings)
        settingsCopy.mapApps[appName] = !settings.mapApps[appName];

        dispatchPostSettings(settingsCopy);
    }


    // handle if the mapApps hasnt been created in settings
    if (!settings.mapApps) {
        const settingsCopy = deepCopy(settings)
        settingsCopy.mapApps = {
            heatmap: true
        }

        dispatchPostSettings(settingsCopy);

        // return null;
    }

    return (
        <div style={{position: 'absolute', bottom: 0, right: 0}}>
            <g>
                <defs>
                    
                </defs>
            </g>
            {Object.keys(settings.mapApps).map(app => (
                <MapApp appName={app} enabled={settings.mapApps[app]} onClick={() => toggleMapApp(app)} />
            ))}
            
        </div>
    )

}

export default MapApps;