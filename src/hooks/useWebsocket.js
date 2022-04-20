import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import io from 'socket.io-client/dist/socket.io';

import { apiIPAddress } from '../settings/settings';

// Actions
import { addCard, updateCard, removeCard } from '../redux/actions/card_actions';
import { addStation, updateStation, removeStation } from '../redux/actions/stations_actions';
import { addDashboard, updateDashboard, removeDashboard } from '../redux/actions/dashboards_actions';
import { addTask, updateTask, removeTask } from '../redux/actions/tasks_actions';
import { addProcess, updateProcess, removeProcess } from '../redux/actions/processes_actions';
import { addLotTemplate, updateLotTemplate, removeLotTemplate } from '../redux/actions/lot_template_actions';
import { updateSettings } from '../redux/actions/settings_actions';

const useWebsocket = (props) => {

    const socket = useRef(null);

    const idToken = useSelector((settings) => settings.localReducer.idToken)
    //console.log(idToken)
    const dispatch = useDispatch();


    // Cards
    const dispatchAddCard = (card) => dispatch(addCard(card));
    const dispatchUpdateCard = (card) => dispatch(updateCard(card));
    const dispatchRemoveCard = (id) => dispatch(removeCard(id))

    // Stations
    const dispatchAddStation = (station) => dispatch(addStation(station));
    const dispatchUpdateStation = (station) => dispatch(updateStation(station));
    const dispatchRemoveStation = (id) => dispatch(removeStation(id))

    // Dashboards
    const dispatchAddDashboard = (dashboard) => dispatch(addDashboard(dashboard));
    const dispatchUpdateDashboard = (dashboard) => dispatch(updateDashboard(dashboard));
    const dispatchRemoveDashboard = (id) => dispatch(removeDashboard(id))

    // Tasks
    const dispatchAddTask = (task) => dispatch(addTask(task));
    const dispatchUpdateTask = (task) => dispatch(updateTask(task));
    const dispatchRemoveTask = (id) => dispatch(removeTask(id))

    // Processes
    const dispatchAddProcess = (process) => dispatch(addProcess(process));
    const dispatchUpdateProcess = (process) => dispatch(updateProcess(process));
    const dispatchRemoveProcess = (id) => dispatch(removeProcess(id))

    //Lot Templates
    const dispatchAddLotTemplate = (lotTemplate) => dispatch(addLotTemplate(lotTemplate));
    const dispatchUpdateLotTemplate = (lotTemplate) => dispatch(updateLotTemplate(lotTemplate));
    const dispatchRemoveLotTemplate = (id) => dispatch(removeLotTemplate(id))

    // Settings
    const dispatchUpdateServerSettings = (settings) => dispatch(updateSettings(settings));

    const switchMessage = ({type, method, payload}) => {
        console.debug('ws:', method, type, payload)

        switch (type) {
            case "cards":
                switch (method) {
                    case "POST":
                        dispatchAddCard(payload);
                        break;
                    case "PUT":
                        dispatchUpdateCard(payload);
                        break;
                    case "DELETE":
                        dispatchRemoveCard(payload);
                        break;
                    default: 
                        console.warn(`Method ${method} is not valid for type ${type}`);
                        break;
                }
                break;

            case "stations":
                switch (method) {
                    case "POST":
                        dispatchAddStation(payload);
                        break;
                    case "PUT":
                        dispatchUpdateStation(payload);
                        break;
                    case "DELETE":
                        dispatchRemoveStation(payload);
                        break;
                    default: 
                        console.warn(`Method ${method} is not valid for type ${type}`);
                        break;
                }
                break;

            case "dashboards":
                switch (method) {
                    case "POST":
                        dispatchAddDashboard(payload);
                        break;
                    case "PUT":
                        dispatchUpdateDashboard(payload);
                        break;
                    case "DELETE":
                        dispatchRemoveDashboard(payload);
                        break;
                    default: 
                        console.warn(`Method ${method} is not valid for type ${type}`);
                        break;
                }
                break;

            case "tasks":
                switch (method) {
                    case "POST":
                        dispatchAddTask(payload);
                        break;
                    case "PUT":
                        dispatchUpdateTask(payload);
                        break;
                    case "DELETE":
                        dispatchRemoveTask(payload);
                        break;
                    default: 
                        console.warn(`Method ${method} is not valid for type ${type}`);
                        break;
                }
                break;

            case "processes":
                switch (method) {
                    case "POST":
                        dispatchAddProcess(payload);
                        break;
                    case "PUT":
                        dispatchUpdateProcess(payload);
                        break;
                    case "DELETE":
                        dispatchRemoveProcess(payload);
                        break;
                    default: 
                        console.warn(`Method ${method} is not valid for type ${type}`);
                        break;
                }
                break;

            case "lot_templates":
                switch (method) {
                    case "POST":
                        dispatchAddLotTemplate(payload);
                        break;
                    case "PUT":
                        dispatchUpdateLotTemplate(payload);
                        break;
                    case "DELETE":
                        dispatchRemoveLotTemplate(payload);
                        break;
                    default: 
                        console.warn(`Method ${method} is not valid for type ${type}`);
                        break;
                }
                break;

            case "settings":
                switch (method) {
                    case "PUT":
                        dispatchUpdateServerSettings(payload);
                        break;
                    default: 
                        console.warn(`Method ${method} is not valid for type ${type}`);
                        break;
                }
                break;

            default:
                console.warn(`Type ${type} is not recognized`);
                break;
        }

    }

    useEffect(() => {
        console.log(idToken)
        socket.current = io.connect(apiIPAddress('wss', ''), {transports: ['websocket'], path: "/opmtwo", Authorization: {idToken}})
        socket.current.on("message", msg => switchMessage(msg))
    }, [])

    return socket.current;

}

export default useWebsocket;
