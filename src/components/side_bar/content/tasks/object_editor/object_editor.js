import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'


import BackButton from '../../../../basic/back_button/back_button'
import Button from '../../../../basic/button/button'
import TextField from '../../../../basic/form/text_field/text_field'
import Textbox from '../../../../basic/textbox/textbox'
import PlusButton from '../../../../basic/plus_button/plus_button'

// Import actions
import { setSelectedStation } from '../../../../../redux/actions/stations_actions'
import { handlePostTaskQueue } from '../../../../../redux/actions/task_queue_actions'
import {setSelectedObject, setRouteObject, setEditingObject} from '../../../../../redux/actions/objects_actions'

// Import styles
import * as styled from './object_editor.style'
import theme from '../../../../../theme'

const ObjectEditor = (props) => {

  const {
    onBackClick,
    name,
    description,
    focus,
    onSaveObject,
    onAddObject,
    onDeleteObject,
    onSelectObject,
    disabled,
    saveDisabled,
    deleteDisabled,
  } = props

    const dispatch = useDispatch()
    const dispatchSetSelectedStation = (station) => dispatch(setSelectedStation(station))
    const dispatchSetSelectedObject = (object) => dispatch(setSelectedObject(object))
    const dispatchSetEditingObject = (bool)=>dispatch(setEditingObject(bool))

    const stations = useSelector(state => state.stationsReducer.stations)
    const objects = useSelector(state => state.objectsReducer.objects)
    const selectedTask = useSelector(state => state.tasksReducer.selectedTask)
    const editingObject = useSelector(state=> state.objectsReducer.editingObject)
    const selectedObject = useSelector(state => state.objectsReducer.selectedObject)
    const routeObject = useSelector(state=>state.objectsReducer.routeObject)
    const [pageName, setPageName] = useState('')
    const url = useLocation().pathname

      return (
          <styled.ObjectContainer>
            <styled.RowContainer>
                <BackButton
                  style = {{ color: theme.main.schema['processes'].solid, marginBottom:'2rem'}}
                  containerStyle={{borderColor: theme.main.schema['processes'].solid }}
                  schema = {'processes'}
                  onClick = {onBackClick}

                />
                {!editingObject ?
                  <styled.ListItemTitle style = {{fontSize:'1.2rem', paddingLeft:'.5rem', width: '75%', textAlign: "start"}}>Pick Object</styled.ListItemTitle>
                  :
                  <styled.ListItemTitle style = {{fontSize:'1.2rem', paddingLeft:'.5rem', width: '75%', textAlign: "start"}}>Editing Object</styled.ListItemTitle>

                }
                {!editingObject ?
                  <PlusButton
                    style={{marginTop: '0.2rem', color: theme.main.schema['processes'].solid}}
                    onClick = {()=>{
                      dispatchSetEditingObject(true)
                      onAddObject()
                    }}
                  />
                  :
                  <div
                    style = {{width: "2.5rem"}}
                  />
                }

              </styled.RowContainer>

              {!editingObject ?
              <styled.ScrollableContainer>
              {Object.values(objects).map((object) => {

                return (
                  <>
                    <styled.ListItem
                      onMouseEnter = {()=>dispatchSetSelectedObject(object)}
                      onMouseLeave = {()=>dispatchSetSelectedObject(null)}

                    >
                    <styled.HoverContainer onClick = {onSelectObject}>
                        <styled.ListItemIcon
                            className='fas fa-box'
                        />
                        <styled.ListItemTitle>{object.name}</styled.ListItemTitle>
                      </styled.HoverContainer>
                      <styled.ListItemIcon
                          className='fas fa-edit'
                          style={{ color: 'white', marginRight: '0.5rem' }}
                          onClick = {()=>dispatchSetEditingObject(true)}
                      />
                    </styled.ListItem>
                  </>
                )
              })}
            </styled.ScrollableContainer>
            :
            <>
                  <styled.ListItemTitle style = {{marginBottom: '0.2rem', textAlign: "start", paddingLeft: "0.2rem"}}>Name</styled.ListItemTitle>

                  <styled.RowContainer style = {{paddingLeft:'0.5rem', paddingRight: '0.5rem'}}>
                    <TextField
                        autoFocus
                        InputComponent={Textbox}
                        name={name}
                        placeholder={"Object Name"}
                        schema={'objects'}
                        focus={focus}
                        style={{ fontSize: '1.2rem', fontWeight: '600'}}
                    />
                  </styled.RowContainer>

                  <styled.ListItemTitle style = {{marginBottom: '0.2rem', marginTop: '0.5rem', textAlign: "start", paddingLeft: "0.2rem"}}>Description</styled.ListItemTitle>

                  <styled.RowContainer style = {{paddingLeft:'0.5rem', paddingRight: '0.5rem'}}>
                    <TextField
                        InputComponent={Textbox}
                        name={description}
                        placeholder={"Add a Description..."}
                        schema={'objects'}
                        //focus={focus}
                        style={{ fontSize: '0.9rem', fontWeight: '600'}}
                        lines = {2}
                    />
                  </styled.RowContainer>

                  <styled.RowContainer style = {{marginTop: '0.5rem'}}>
                    <Button
                        schema={'objects'}
                        style = {{width: '50%'}}
                        secondary
                        disabled = {saveDisabled}
                        onClick= {()=>{
                          onSaveObject()

                        }}

                    >
                        Save
                    </Button>
                    <Button
                        schema={'error'}
                        style = {{width: '50%'}}
                        secondary
                        disabled = {deleteDisabled}
                        onClick={() => {
                          onDeleteObject()
                          dispatchSetEditingObject(false)
                        }}
                    >
                        Delete
                    </Button>
                </styled.RowContainer>
            </>
          }


            </styled.ObjectContainer>
          )
    }


export default ObjectEditor
