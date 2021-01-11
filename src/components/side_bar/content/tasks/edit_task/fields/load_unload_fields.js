import React, { useEffect } from 'react'
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
import {isHumanTask, isMiRTask, isOnlyHumanTask} from "../../../../../../methods/utils/route_utils";
import {DEVICE_CONSTANTS} from "../../../../../../constants/device_constants";


const LoadUnloadFields = () => {

    const dispatch = useDispatch()
    const dispatchSetSelectedTask = (task) => dispatch(setSelectedTask(task))
    const dispatchSetTaskAttributes = (id, attr) => dispatch(setTaskAttributes(id, attr))

    let selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const sounds = useSelector(state => state.soundsReducer.sounds)
    const stations = useSelector(state => state.locationsReducer.stations)


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

    return (
        <>
            {!humanLocation &&
                <>
                    <styled.RowContainer>
                        <styled.Header>Robot Enabled</styled.Header>
                        <Switch
                            checked={mirEnabled}
                            onChange={() => {
                                dispatchSetSelectedTask({
                                    ...selectedTask,
                                    // Just setting this to MiR100 for now. Need to expand in the future for other devices
                                    device_types: mirEnabled ? [DEVICE_CONSTANTS.HUMAN] : [DEVICE_CONSTANTS.MIR_100, DEVICE_CONSTANTS.HUMAN],
                                })
                            }}
                            onColor='red'
                            style={{ marginRight: '1rem' }}
                        />

                    </styled.RowContainer>
                    <styled.HelpText>Do you want a robot to perform this task? If selected, there will be an option for a person to take over the task when the button is placed onto the dashboard.</styled.HelpText>
                </>
            }



            <styled.RowContainer style={{ marginTop: '2rem' }}>

                <styled.Header style={{ marginTop: '0rem' }}>Load</styled.Header>

                {!humanLocation &&

                    <styled.RowContainer style={{ justifyContent: 'flex-end', alignItems: 'baseline' }}>
                        <styled.HelpText style={{ fontSize: '1rem', marginRight: '.5rem' }}>TimeOut: </styled.HelpText>

                        <TimePicker
                            // format={'mm:ss'}
                            style={{ flex: '0 0 7rem', display: 'flex', flexWrap: 'wrap', textAlign: 'center', backgroundColor: '#6c6e78' }}
                            showHour={false}
                            className="xxx"
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
                    </styled.RowContainer>
                }

            </styled.RowContainer>

            <Textbox
                value={!!selectedTask && selectedTask.load.instructions}
                schema={'tasks'}
                focus={!!selectedTask && selectedTask.type == null}
                onChange={e => {
                    let load = selectedTask.load
                    load.instructions = e.target.value
                    // dispatch(taskActions.setTaskAttributes(selectedTask._id, { load }))
                    dispatchSetTaskAttributes(selectedTask._id, { load })
                }}
                lines={2}>
            </Textbox>

            {!isHumanTask(selectedTask) &&
                <div style={{ display: "flex", flexDirection: "row", marginTop: "0.5rem" }}>
                    <styled.Label>Sound </styled.Label>
                    <DropDownSearch
                        placeholder="Select Sound"
                        label="Sound to be played upon arrival"
                        labelField="name"
                        valueField="name"
                        options={Object.values(sounds)}
                        values={!!selectedTask.load.sound ? [sounds[selectedTask.load.sound]] : []}
                        dropdownGap={5}
                        noDataLabel="No matches found"
                        closeOnSelect="true"
                        onChange={values => {
                            dispatchSetSelectedTask({
                                ...selectedTask,
                                load: {
                                    ...selectedTask.load,
                                    sound: values[0]._id,
                                }
                            })
                        }}
                        className="w-100"
                        schema="tasks" />
                </div>
            }

            {/* If its a human task, then the task can also be defined as a handoff.
                    A handoff does not require unload confirmation.
                */}
            {isHumanTask(selectedTask) &&
                <styled.ContentContainer style={{ paddingBottom: '0rem' }}>
                    <styled.RowContainer>
                        <styled.Label style={{ marginBottom: '0rem' }}>Confirm Unload?</styled.Label>
                        <Switch
                            checked={!selectedTask.handoff}
                            onChange={() => {
                                dispatchSetSelectedTask({
                                    ...selectedTask,
                                    handoff: !selectedTask.handoff
                                })
                            }}
                            onColor='red'
                            style={{ marginRight: '1rem' }}
                        />
                    </styled.RowContainer>
                    <styled.HelpText>Do you want to track transit time? This will display a Unload Button at the Unload Station</styled.HelpText>
                </styled.ContentContainer>
            }

            {/* Hides the unload field if its a handoff task */}
            {!selectedTask.handoff &&

                <>
                    <styled.Header>Unload</styled.Header>
                    <Textbox
                        value={!!selectedTask && selectedTask.unload.instructions}
                        schema={'tasks'}
                        focus={!!selectedTask && selectedTask.type == null}
                        onChange={e => {
                            let unload = selectedTask.unload
                            unload.instructions = e.target.value
                            // dispatch(taskActions.setTaskAttributes(selectedTask._id, { unload }))
                            dispatchSetTaskAttributes(selectedTask._id, { unload })
                        }}
                        lines={2}>
                    </Textbox>

                    {/* If its a human task, then you shouldnt require people to make noises. I personally would though...  */}
                    {!isHumanTask(selectedTask) &&

                        <div style={{ display: "flex", flexDirection: "row", marginTop: "0.5rem" }}>
                            <styled.Label>Sound </styled.Label>
                            <DropDownSearch
                                placeholder="Select Sound"
                                label="Sound to be played upon arrival"
                                labelField="name"
                                valueField="name"
                                options={Object.values(sounds)}
                                values={!!selectedTask.unload.sound ? [sounds[selectedTask.unload.sound]] : []}
                                dropdownGap={5}
                                noDataLabel="No matches found"
                                closeOnSelect="true"
                                onChange={values => {

                                    dispatchSetSelectedTask({
                                        ...selectedTask,
                                        unload: {
                                            ...selectedTask.unload,
                                            sound: values[0]._id,
                                        }
                                    })

                                }}
                                className="w-100"
                                schema="tasks" />
                        </div>
                    }
                </>
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
                            dropdownGap={5}
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
