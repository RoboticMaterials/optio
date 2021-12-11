import React, { useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FieldArray, Form, Formik } from 'formik'
import { useParams } from 'react-router-dom'

// Import Style
import * as styled from './dashboard_lot_input_box.style'

// Import Components
import TextField from '../../../../../../basic/form/text_field/text_field'
import Button from '../../../../../../basic/button/button'
import Textbox from '../../../../../../basic/textbox/textbox'

// Import Constants
import { FIELD_COMPONENT_NAMES } from "../../../../../../../constants/lot_contants"

// Import Utils
import { deepCopy } from '../../../../../../../methods/utils/utils'

// Import Actions
import { putCard } from '../../../../../../../redux/actions/card_actions'


const DashboardLotInputBox = (props) => {



    const {
        currentLot,
        onGetCards
    } = props
    const params = useParams()

    const {
      dashboardID
    } = params

    const dashboard = useSelector(state => state.dashboardsReducer.dashboards[dashboardID]) || {}
    const stationBasedLots = useSelector(state => state.settingsReducer.settings.stationBasedLots)
    const processCards = useSelector(state => state.cardsReducer.processCards)
    const card = processCards[currentLot.process_id][currentLot._id]
    useEffect(() => {
    }, [])

    const dispatch = useDispatch()
    const dispatchPutCard = async (currentLot, iD) => await dispatch(putCard(currentLot, iD))


    // Since fields are nested arrays, you need to reference the location of the field in each array
    // That is also how the name of the formik component works: inputBox.firstIndex.secondIndex.input
    const onInitialValues = () => {
        let initialValues = {}
        card.fields.forEach((field, ind1) => {
            field.forEach((subField, ind2) => {
                if (subField?.component === FIELD_COMPONENT_NAMES.INPUT_BOX) {
                    initialValues = {
                        ...initialValues,
                        [ind1]: {
                            ...initialValues.ind1,
                            [ind2]: { input: subField.value }
                        }
                    }
                }
            })
        })

        initialValues = { inputBox: initialValues }

        return initialValues
    }

    const onSave = (values) => {
        let lotCopy = deepCopy(card)
        const fieldValues = values.inputBox
        Object.keys(fieldValues).forEach((ind1) => {
            const subFieldValues = fieldValues[ind1]
            Object.keys(subFieldValues).forEach((ind2) => {
                const inputValue = subFieldValues[ind2].input
                lotCopy.fields[ind1][ind2].value = inputValue
            })
        })
        const result = dispatchPutCard(lotCopy, lotCopy._id)
    }


    const renderLotInputBoxes = () => {

        return currentLot.fields.map((field, ind1) => {
            return field.map((subField, ind2) => {
                if (subField?.component === FIELD_COMPONENT_NAMES.INPUT_BOX) {
                  if(stationBasedLots === true && dashboard.fields && dashboard.fields[currentLot.lotTemplateId] && !!dashboard.fields[currentLot.lotTemplateId][subField._id]){
                    return (
                        <styled.Container key={`${ind1}.container.${ind2}`}>
                            <styled.Title>{subField.fieldName}</styled.Title>
                            <TextField
                                name={`inputBox.${ind1}.${ind2}.input`}
                                InputComponent={Textbox}
                                lines={5}
                                placeholder='Add a Note...'
                            />
                            <Button
                                schema={'dashboards'}
                                type={'submit'}
                                style={{width:'10rem', alignSelf:'center', marginTop:'.5rem'}}
                            >
                                Save
                            </Button>
                        </styled.Container>
                    )
                  }
                }
            })
        })
    }

    return (
        <Formik
            onSubmit={values => {
                onSave(values)
            }}
            initialValues={
                onInitialValues()
            }
        >
            <styled.InputForm>
                <FieldArray
                    name={'inputBox'}
                    // validateOnChange={true}
                    render={arrayHelpers => (
                        <>
                            {renderLotInputBoxes()}
                        </>
                    )

                    }
                />
            </styled.InputForm>
        </Formik>
    )

}

export default DashboardLotInputBox
