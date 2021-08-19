import React, { Component, useState, useEffect } from 'react';
import { useSelector, useDispatch} from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import Style
import * as styled from './field_select_modal.style'
import { putDashboard, getDashboards } from '../../../../../../redux/actions/dashboards_actions'

// Import Components
import Checkbox from '../../../../../../components/basic/checkbox/checkbox'
import Button from "../../../../../../components/basic/button/button";


const FieldSelectModal = (props) => {

    const {
        isOpen,
        close,
    } = props

    const params = useParams()
    const dispatch = useDispatch()

    const {
        stationID,
        dashboardID,
    } = params || {}

    const dispatchPutDashboard = (dashboard, id) => dispatch(putDashboard(dashboard, id))
    const dispatchGetDashboards = () => dispatch(getDashboards())

    const lotTemplates = useSelector(state => { return state.lotTemplatesReducer.lotTemplates }) || {}
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const currentDashboard = dashboards[dashboardID]
    const [selectedFields, setSelectedFields] = useState({})

    useEffect(() => {
      if(!!currentDashboard.fields){
        setSelectedFields(currentDashboard.fields)
      }
    }, [])

    const onCheckBoxClick = (field) => {
      var id = field[0]._id
      if(!selectedFields[field[0]._id]){
        setSelectedFields({
          ...selectedFields,
          [id]:field[0]
        })
      }
      else{
        delete selectedFields[field[0]._id]
      }
    }


    const handlePutDashboard = async() => {
      const updatedDashboard = {
        ...currentDashboard,
        fields: selectedFields
      }
      await dispatchPutDashboard(updatedDashboard, dashboardID)
    }

    const renderFields = () => {
      return (
        <>
          {Object.values(lotTemplates).map((template, index) =>
            <>
            {template.fields.map((field, fieldIndex) =>
                <styled.ListItem>
                  <Checkbox
                    onClick = {()=> {
                      onCheckBoxClick(field)
                    }}
                    checked = {!!selectedFields[field[0]._id]}
                  />
                  <styled.ListItemTitle>
                    {field[0].fieldName}
                  </styled.ListItemTitle>
                </styled.ListItem>
              )}
            </>
          )}
        </>
    )
  }


    return (
        <styled.Container
            isOpen={isOpen}
            contentLabel="Kick Off Modal"
            onRequestClose={close}
            style={{
                overlay: {
                    zIndex: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                },
            }}
        >
            <styled.BodyContainer>
                <styled.Title schema={'locations'}>Choose Fields to Display</styled.Title>
                <styled.CloseButton
                    className={'fas fa-times'}
                    onClick={() => {close()}}
                    style={{ cursor: 'pointer' }}
                />

            <styled.ColumnContainer>
              {renderFields()}
              <Button
                type={"button"}
                schema={'locations'}
                label={"Save"}
                onClick={()=>{
                  handlePutDashboard()
                  close()
                }}
                style={{minWidth: '14rem', minHeight: '3rem', marginLeft: '0rem', marginRight: '0rem', color: 'white'}}
              />
            </styled.ColumnContainer>


            </styled.BodyContainer>
        </styled.Container>
    )
}

export default FieldSelectModal
