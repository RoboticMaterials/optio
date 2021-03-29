import React, { useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// Import Styles
import * as styled from '../../tasks_content.style'

// Import basic components
import Switch from 'react-ios-switch';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import DropDownSearch from '../../../../../basic/drop_down_search_v2/drop_down_search'
import Textbox from '../../../../../basic/textbox/textbox.js'

// Import actions
import { setSelectedTask, setTaskAttributes } from '../../../../../../redux/actions/tasks_actions'
import {isHumanTask, isMiRandHumanTask, isMiRTask, isOnlyHumanTask} from "../../../../../../methods/utils/route_utils";
import {DEVICE_CONSTANTS} from "../../../../../../constants/device_constants";
import SwitchField from "../../../../../basic/form/switch_field/switch_field";
import TimePickerField from "../../../../../basic/form/time_picker_field/time_picker_field";
import TextField from "../../../../../basic/form/text_field/text_field";
import DropDownSearchField from "../../../../../basic/form/drop_down_search_field/drop_down_search_field";
import {isArray} from "../../../../../../methods/utils/array_utils";
import {isString} from "../../../../../../methods/utils/string_utils";
import {isObject} from "../../../../../../methods/utils/object_utils";
import { ThemeContext } from 'styled-components';


const LoadUnloadFields = (props) => {

    const {
        fieldParent,
        setFieldValue,
        values,
        isProcess
    } = props

    const dispatch = useDispatch()
    const dispatchSetSelectedTask = (task) => dispatch(setSelectedTask(task))
    const dispatchSetTaskAttributes = (id, attr) => dispatch(setTaskAttributes(id, attr))

    let selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const sounds = useSelector(state => state.soundsReducer.sounds)
    const stations = useSelector(state => state.stationsReducer.stations)

    const themeContext = useContext(ThemeContext)

    // This handles if any position of a route is a human position, then it cant be done by a robot
    let humanLocation = false
    const mirEnabled = isMiRTask(selectedTask)

    if ((!!stations[selectedTask.load.position] && stations[selectedTask.load.position].type === 'human') || (!!stations[selectedTask.unload.position] && stations[selectedTask.unload.position].type === 'human')) {
        humanLocation = true

        if (!isOnlyHumanTask(selectedTask)) {
            dispatchSetSelectedTask({
                ...selectedTask,
                device_types: [DEVICE_CONSTANTS.HUMAN],
            })
        }
    }
    else if(!isMiRandHumanTask(selectedTask)) {
        dispatchSetSelectedTask({
            ...selectedTask,
            device_types: [DEVICE_CONSTANTS.HUMAN, DEVICE_CONSTANTS.MIR_100],
        })
    }

    return (
        <>
            {/*{!humanLocation &&*/}
            {/*    <>*/}
            {/*        <styled.RowContainer>*/}
            {/*            <styled.Header>Robot Enabled</styled.Header>*/}
            {/*            <SwitchField*/}
            {/*                name={fieldParent ? `${fieldParent}.device_types` : "device_types"}*/}
            {/*                // checked={mirEnabled}*/}
            {/*                mapInput={(devices)=> {*/}
            {/*                    if(devices.includes(DEVICE_CONSTANTS.MIR_100) && devices.includes(DEVICE_CONSTANTS.HUMAN)) {*/}
            {/*                        return true*/}
            {/*                    }*/}
            {/*                    else {*/}
            {/*                        return false*/}
            {/*                    }*/}
            {/*                }}*/}
            {/*                mapOutput={(enable) => {*/}
            {/*                    if(enable) {*/}
            {/*                        return([DEVICE_CONSTANTS.MIR_100, DEVICE_CONSTANTS.HUMAN])*/}
            {/*                    }*/}
            {/*                    else {*/}
            {/*                        return([DEVICE_CONSTANTS.HUMAN])*/}
            {/*                    }*/}
            {/*                }}*/}
            {/*                onColor='red'*/}
            {/*                style={{ marginRight: '1rem' }}*/}
            {/*            />*/}

            {/*        </styled.RowContainer>*/}
            {/*        <styled.HelpText>Do you want a robot to perform this task? If selected, there will be an option for a person to take over the task when the button is placed onto the dashboard.</styled.HelpText>*/}
            {/*    </>*/}
            {/*}*/}

            <styled.Card dark={isProcess}>

            <styled.RowContainer>

                    <styled.Header style={{ marginTop: '0rem',marginRight: ".5rem", fontSize: '1.2rem' }}>Load</styled.Header>

            </styled.RowContainer>

            <TextField
                name={fieldParent ? `${fieldParent}.load.instructions` : "load.instructions"}
                schema={'tasks'}
                focus={!!selectedTask && selectedTask.type == null}
                lines={2}
                InputComponent={Textbox}
                inputStyle={!isProcess && {background: themeContext.bg.primary}}
            />

            {!humanLocation &&

            <div style={{ display: "flex", flexDirection: "row", marginTop: "0.5rem" }}>
                <styled.Label>Timeout: </styled.Label>

                <TimePickerField
                    mapInput={(value) => {
                        if(value) {
                            const splitVal = value.split(':')
                            return moment().set({ 'minute': splitVal[0], 'second': splitVal[1] })
                        }
                    }}
                    mapOutput={(value) => {
                        return value.format("mm:ss")
                    }}
                    name={fieldParent ? `${fieldParent}.load.timeout` : "load.timeout"}
                    style={{ flex: '0 0 7rem', display: 'flex', flexWrap: 'wrap', textAlign: 'center', backgroundColor: '#6c6e78' }}
                    showHour={false}
                    schema={'tasks'}
                    className="xxx"
                    autocomplete={"off"}
                    allowEmpty={false}
                    defaultOpenValue={!!selectedTask.load.timeout ? moment().set({ 'minute': selectedTask.load.timeout.split(':')[0], 'second': selectedTask.load.timeout.split(':')[1] }) : moment().set({ 'minute': 1, 'second': 0 })}
                    defaultValue={!!selectedTask.load.timeout ? moment().set({ 'minute': selectedTask.load.timeout.split(':')[0], 'second': selectedTask.load.timeout.split(':')[1] }) : moment().set({ 'minute': 1, 'second': 0 })}
                    onChange={(time) => {
                        dispatchSetSelectedTask({
                            ...selectedTask,
                            load: {
                                ...selectedTask.load,
                                timeout: time.format("mm:ss")
                            }
                        })
                    }}
                />
            </div>
            }

            {!isOnlyHumanTask(selectedTask) &&
                <div style={{ display: "flex", flexDirection: "row", marginTop: "0rem" }}>
                    <styled.Label>Sound: </styled.Label>
                    <DropDownSearchField
                        name={fieldParent ? `${fieldParent}.load.sound` : "load.sound"}
                        placeholder="Select Sound"
                        label="Sound to be played upon arrival"
                        labelField="name"
                        valueField="name"
                        options={Object.values(sounds)}
                        mapInput={(val)=>{
                            if(isString(val) && isObject(sounds[val])) return [sounds[val]]
                            return []
                        }}
                        mapOutput={(val) => {
                            let output = null
                            if(isArray(val) && val.length > 0) {
                                output = val[0]?._id || null
                            }
                            return output
                        }}
                        // values={!!selectedTask.load.sound ? [sounds[selectedTask.load.sound]] : []}
                        dropdownGap={2}
                        style={!isProcess && {background: themeContext.bg.primary}}
                        noDataLabel="No matches found"
                        closeOnSelect="true"
                        className="w-100"
                        schema="tasks" />
                </div>
            }

            </styled.Card>

            <styled.Card dark={isProcess}>
                {/* If its a human task, then the task can also be defined as a handoff.
                    A handoff does not require unload confirmation.
                */}
                {isHumanTask(selectedTask) &&
                    <styled.ContentContainer style={{ paddingBottom: '0rem' }}>
                        <styled.RowContainer>
                            <styled.Label style={{ marginBottom: '0rem' }}>
                                {"Confirm Unload?"}
                            </styled.Label>

                            <SwitchField
                                mapInput={(val)=>!val}
                                mapOutput={(val)=>!val}
                                name={fieldParent ? `${fieldParent}.handoff` : "handoff"}
                                onColor='red'
                                containerStyle={{ marginRight: '1rem' }}
                            />
                        </styled.RowContainer>
                        <styled.HelpText>
                            Tracks transit time by requiring button to be pressed at Unload Location
                        </styled.HelpText>

                        {isMiRTask(selectedTask) &&
                            <styled.HelpText>
                                (Not used when executed by a robot)
                            </styled.HelpText>
                        }

                    </styled.ContentContainer>
                }
            </styled.Card>

            {/* Hides the unload field if its a handoff task */}
            {(!values.handoff || isMiRTask(selectedTask)) &&

                <styled.Card dark={isProcess}>
                    <styled.Header>Unload</styled.Header>
                    <TextField
                        name={fieldParent ? `${fieldParent}.unload.instructions` : "unload.instructions"}
                        schema={'tasks'}
                        focus={!!selectedTask && selectedTask.type == null}
                        lines={2}
                        InputComponent={Textbox}
                        inputStyle={!isProcess && {background: themeContext.bg.primary}}
                    />

                    {/* If its a human task, then you shouldnt require people to make noises. I personally would though...  */}
                    {!isOnlyHumanTask(selectedTask) &&

                        <div style={{ display: "flex", flexDirection: "row", marginTop: "0.5rem" }}>
                            <styled.Label>Sound </styled.Label>
                            <DropDownSearchField
                                name={fieldParent ? `${fieldParent}.unload.sound` : "unload.sound"}
                                placeholder="Select Sound"
                                label="Sound to be played upon arrival"
                                labelField="name"
                                valueField="name"
                                options={Object.values(sounds)}
                                dropdownGap={2}
                                noDataLabel="No matches found"
                                closeOnSelect="true"
                                mapInput={(val)=>{
                                    if(isString(val) && isObject(sounds[val])) return [sounds[val]]
                                    return []
                                }}
                                mapOutput={(val) => {
                                    let output = null
                                    if(isArray(val) && val.length > 0) {
                                        output = val[0]?._id || null
                                    }
                                    return output
                                }}
                                className="w-100"
                                schema="tasks"
                                style={!isProcess && {background: themeContext.bg.primary}}
                            />
                        </div>
                    }
                </styled.Card>
            }
            

            


            {/* {selectedTask.device_type === 'MiR_100' &&
                    <>
                        <styled.Header>Idle Location</styled.Header>
                        <DropDownSearch
                            placeholder="Select Location"
                            label="Idle Location for MiR Cart"
                            labelField="name"
                            valueField="name"
                            options={Object.values(positions)}
                            values={!!selectedTask.idle_location ? [positions[selectedTask.idle_location]] : []}
                            dropdownGap={2}
                            noDataLabel="No matches found"
                            closeOnSelect="true"
                            onChange={values => {

                                const idleLocation = values[0]._id

                                dispatchSetSelectedTask({
                                    ...selectedTask,
                                    idle_location: idleLocation,
                                })
                            }}
                            className="w-100"
                            schema="tasks"
                        />
                    </>
                } */}


        </>
    )
};

export default LoadUnloadFields
