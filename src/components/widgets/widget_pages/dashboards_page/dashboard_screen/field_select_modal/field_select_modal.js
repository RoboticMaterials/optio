import React, { Component, useState, useEffect } from 'react';
import { useSelector, useDispatch} from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

// Import Style
import * as styled from './field_select_modal.style'
import { putDashboard, getDashboards } from '../../../../../../redux/actions/dashboards_actions'
import {BASIC_DEFAULT_DATES_FIELD, BASIC_DEFAULT_DESCIPTION_FIELD } from "../../../../../../constants/lot_contants";
import {
	deleteLotTemplate,
} from "../../../../../../redux/actions/lot_template_actions";
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
    const dispatchDeleteLotTemplate = async (id) => await dispatch(deleteLotTemplate(id))

    const lotTemplates = useSelector(state => { return state.lotTemplatesReducer.lotTemplates }) || {}
    const dashboards = useSelector(state => state.dashboardsReducer.dashboards)
    const currentDashboard = dashboards[dashboardID]
    const [selectedFields, setSelectedFields] = useState({})

    useEffect(() => {
      if(!!currentDashboard.fields){
        setSelectedFields(currentDashboard.fields)
      }
    }, [])

    const onCheckBoxClick = (field, templateId) => {

       let id = field._id
        const updatedTemplateFields = {
          ...selectedFields[templateId],
          [id]: field
        }

        if(!selectedFields[templateId] || !selectedFields[templateId][id]){
          setSelectedFields({
            ...selectedFields,
            [templateId]: updatedTemplateFields
          })
        }
        else{
          delete selectedFields[templateId][id]
        }
        if(!!selectedFields[templateId] && Object.values(selectedFields[templateId]).length === 0) delete selectedFields[templateId]
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
          <styled.ListItem
            style = {{ background: '#5c6fff', borderColor: '#5c6fff', justifyContent: 'center', minHeight: '2.5rem'}}
          >
            <styled.ListItemTitle style = {{color: '#f7f7fa', fontSize: '1.2rem'}} >
              {'Product Group: Basic Template'}
            </styled.ListItemTitle>
          </styled.ListItem>
          <styled.ListItem style = {{minHeight: '2.5rem'}}>
            <Checkbox
              onClick = {()=> {
                onCheckBoxClick(BASIC_DEFAULT_DESCIPTION_FIELD, 'Basic')
              }}
              checked = {!!selectedFields['Basic'] && !!selectedFields['Basic'][BASIC_DEFAULT_DESCIPTION_FIELD._id]}

            />
            <styled.ListItemTitle>
              description
            </styled.ListItemTitle>
          </styled.ListItem>

          <styled.ListItem style = {{minHeight: '2.5rem'}}>
            <Checkbox
              onClick = {()=> {
                onCheckBoxClick(BASIC_DEFAULT_DATES_FIELD, 'Basic')
              }}
              checked = {!!selectedFields['Basic'] && !!selectedFields['Basic'][BASIC_DEFAULT_DATES_FIELD._id]}
            />
            <styled.ListItemTitle>
              dates
            </styled.ListItemTitle>
          </styled.ListItem>

          {Object.values(lotTemplates).map((template, index) =>
            <>
              {template.name !== 'Basic' &&
                <>
                <styled.ListItem
                  style = {{ background: '#5c6fff', borderColor: '#5c6fff', justifyContent: 'center', minHeight: '2.5rem'}}
                >
                  <styled.ListItemTitle style = {{color: '#f7f7fa', fontSize: '1.2rem'}} >
                    {'Product Group: '+ template.name}
                  </styled.ListItemTitle>
                </styled.ListItem>
                <>

                {template.fields.map((field, fieldIndex) =>
                  <>
                    {field.map((indField, ind) =>
                      <styled.ListItem style = {{minHeight: '2.5rem'}}>
                        <Checkbox
                          onClick = {()=> {
                            onCheckBoxClick(indField, template._id)
                          }}
                          checked = {!!selectedFields[template._id] && !!selectedFields[template._id][indField._id]}
                        />
                        <styled.ListItemTitle>
                          {indField.fieldName}
                        </styled.ListItemTitle>
                      </styled.ListItem>
                    )}
                    </>
                    )}
                  </>
                </>
              }
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
            </styled.ColumnContainer>
            <Button
              type={"button"}
              schema={'objects'}
              label={"Save"}
              onClick={()=>{
                handlePutDashboard()
                close()
              }}
              style={{minWidth: '14rem', minHeight: '3rem', marginTop: '2rem', marginLeft: '0rem', marginRight: '0rem', color: 'white'}}
            />
            </styled.BodyContainer>
        </styled.Container>
    )
}

export default FieldSelectModal
