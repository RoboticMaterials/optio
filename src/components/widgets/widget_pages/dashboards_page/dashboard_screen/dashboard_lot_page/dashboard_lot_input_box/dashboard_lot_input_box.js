import React, { useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FieldArray, Form, Formik } from 'formik'

// Import Style
import * as styled from './dashboard_lot_input_box.style'

// Import Components
import TextField from '../../../../../../basic/form/text_field/text_field'
import Button from '../../../../../../basic/button/button'
import Textbox from '../../../../../../basic/textbox/textbox'

// Import Constants
import { FIELD_COMPONENT_NAMES } from "../../../../../../../constants/lot_contants"

// Import Utils
// IMPORT DEEP COPY


const DashboardLotInputBox = (props) => {

    const {
        currentLot,
    } = props

    useEffect(() => {
    }, [])

    // Since fields are nested arrays, you need to reference the location of the field in each array
    // That is also how the name of the formik component works: inputBox.firstIndex.secondIndex.input
    const onInitialValues = () => {
        let initialValues = {}
        currentLot.fields.forEach((field, ind1) => {
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
        console.log('QQQQ values', values)

        const fieldValues = values.inputBox
        console.log('QQQQ field', fieldValues)
        Object.keys(fieldValues).forEach((ind1) => {
            console.log('QQQQ ind1', ind1)
            const subFieldValues = fieldValues[ind1]
            console.log('QQQQ Subfield vals', subFieldValues)
            Object.keys(subFieldValues).forEach((ind2) => {
                const inputValue = subFieldValues[ind2].input



            })
        })

    }


    const renderLotInputBoxes = () => {

        return currentLot.fields.map((field, ind1) => {
            return field.map((subField, ind2) => {
                if (subField?.component === FIELD_COMPONENT_NAMES.INPUT_BOX) {

                    return (
                        <styled.Container key={`${ind1}.container.${ind2}`}>
                            <p>{subField.fieldName}</p>
                            <TextField
                                name={`inputBox.${ind1}.${ind2}.input`}
                                InputComponent={Textbox}
                                placeholder='Schedule Name'

                            />
                            <Button
                                schema={'dashboards'}
                                type={'submit'}
                            >
                                Save
                            </Button>
                        </styled.Container>
                    )
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