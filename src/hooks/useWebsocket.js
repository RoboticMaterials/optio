import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';

import { getSocketBaseUrl } from '../settings/settings';

// Actions — Cards
import { addCard, updateCard, removeCard } from '../redux/actions/card_actions';
// Actions — Stations
import { addStation, updateStation, removeStation } from '../redux/actions/stations_actions';
// Actions — Dashboards
import { addDashboard, updateDashboard, removeDashboard } from '../redux/actions/dashboards_actions';
// Actions — Tasks
import { addTask, updateTask, removeTask } from '../redux/actions/tasks_actions';
// Actions — Processes
import { addProcess, updateProcess, removeProcess } from '../redux/actions/processes_actions';
// Actions — Lot Templates
import { addLotTemplate, updateLotTemplate, removeLotTemplate } from '../redux/actions/lot_template_actions';
// Actions — Settings
import { updateSettings } from '../redux/actions/settings_actions';

const useWebsocket = () => {
    const socket = useRef(null);
    const dispatch = useDispatch();

    const switchMessage = ({ type, method, payload }) => {
        console.debug('ws:', method, type, payload);

        switch (type) {
            case 'cards':
                switch (method) {
                    case 'POST': dispatch(addCard(payload)); break;
                    case 'PUT':  dispatch(updateCard(payload)); break;
                    case 'DELETE': dispatch(removeCard(payload)); break;
                    default: break;
                }
                break;

            case 'stations':
                switch (method) {
                    case 'POST': dispatch(addStation(payload)); break;
                    case 'PUT':  dispatch(updateStation(payload)); break;
                    case 'DELETE': dispatch(removeStation(payload)); break;
                    default: break;
                }
                break;

            case 'dashboards':
                switch (method) {
                    case 'POST': dispatch(addDashboard(payload)); break;
                    case 'PUT':  dispatch(updateDashboard(payload)); break;
                    case 'DELETE': dispatch(removeDashboard(payload)); break;
                    default: break;
                }
                break;

            case 'tasks':
                switch (method) {
                    case 'POST': dispatch(addTask(payload)); break;
                    case 'PUT':  dispatch(updateTask(payload)); break;
                    case 'DELETE': dispatch(removeTask(payload)); break;
                    default: break;
                }
                break;

            case 'processes':
                switch (method) {
                    case 'POST': dispatch(addProcess(payload)); break;
                    case 'PUT':  dispatch(updateProcess(payload)); break;
                    case 'DELETE': dispatch(removeProcess(payload)); break;
                    default: break;
                }
                break;

            case 'lot_templates':
                switch (method) {
                    case 'POST': dispatch(addLotTemplate(payload)); break;
                    case 'PUT':  dispatch(updateLotTemplate(payload)); break;
                    case 'DELETE': dispatch(removeLotTemplate(payload)); break;
                    default: break;
                }
                break;

            case 'settings':
                switch (method) {
                    case 'PUT': dispatch(updateSettings(payload)); break;
                    default: break;
                }
                break;

            default:
                console.warn(`useWebsocket: unrecognized type "${type}"`);
                break;
        }
    };

    useEffect(() => {
        const url = getSocketBaseUrl();
        console.log('useWebsocket: connecting to', url);
        socket.current = io(url, { transports: ['websocket'] });
        socket.current.on('connect', () => console.log('useWebsocket: connected'));
        socket.current.on('disconnect', () => console.log('useWebsocket: disconnected'));
        socket.current.on('message', (msg) => switchMessage(msg));

        return () => {
            socket.current.disconnect();
        };
    }, []);

    return socket.current;
};

export default useWebsocket;
