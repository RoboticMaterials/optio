import React, {useContext, useEffect, useRef, useState, useMemo } from 'react'
import PropTypes from "prop-types";
import { Formik } from "formik";
import set from "lodash/set";
import { useDispatch } from 'react-redux'

// components external
import Spreadsheet from "react-spreadsheet";

// components internal
import Button from "../button/button";
import DropDownSearch from '../drop_down_search_v2/drop_down_search'

//utils
import { templateMapperSchema } from "../../../methods/utils/form_schemas";
import { deepCopy, uuidv4 } from '../../../methods/utils/utils'

// style
import * as styled from './paste_mapper.style'

// actions
import { putLotTemplate } from '../../../redux/actions/lot_template_actions'

const PasteMapper = (props) => {

    const {
        formikProps,
        onPreviewClick,
        onCreateClick,
        onCancel,
        availableFields,
        lotTemplate
    } = props
        
    const {
        values,
    } = formikProps;

    const {
        table
    } = values

    const dispatch = useDispatch()
    const dispatchPutLotTemplate = async (lotTemplate, id) => await dispatch(putLotTemplate(lotTemplate, id))

    const createPayload = () => {}

    const renderColumnDropdown = ({ column }) => {

        const unusedFields = availableFields.map(field => {

            let disabled = false;
            if (!!lotTemplate?.uploadFieldMapping) {
                if (lotTemplate.uploadFieldMapping.find((fieldDName, ind) => fieldDName === field.displayName && ind !== column)) {
                    disabled = true
                }
            }
            return {
                displayName: field.displayName,
                disabled: false,
                _id: uuidv4()
            }

        })

        const savedDName = (!!lotTemplate?.uploadFieldMapping ? lotTemplate.uploadFieldMapping[column] : null)
        const savedValue = !!savedDName ? [unusedFields.find(field => field.displayName === savedDName)] : []

        return (
            <td style={{minWidth: '8rem'}}>
                <DropDownSearch
                    placeholder="Column Field"
                    labelField="displayName"
                    valueField="_id"
                    options={unusedFields}
                    disabledLabel={''}
                    values={savedValue}
                    dropdownGap={2}
                    schema={'lots'}
                    noDataLabel="No matches found"
                    closeOnSelect="true"
                    searchable={false}
                    onChange={values => {
                        let lotTemplateCopy = deepCopy(lotTemplate)
                        if (lotTemplateCopy.uploadFieldMapping === undefined) { // If mapping does not exist yet, create it
                            lotTemplateCopy.uploadFieldMapping = new Array(availableFields.length).fill(null);
                        }
                        lotTemplateCopy.uploadFieldMapping[column] = values[0].displayName
                        dispatchPutLotTemplate(lotTemplateCopy, lotTemplateCopy._id)
                    }}
                    className="w-100"
                />
            </td>
        )
    }

    const Table = useMemo(() => {
        return <Spreadsheet data={table} ColumnIndicator={renderColumnDropdown}/>
    }, [table, lotTemplate.uploadFieldMapping])

    return (
        <styled.Container>
            <styled.Header>
                <styled.Title>Map Data</styled.Title>
                <styled.CloseIcon className="fa fa-times" aria-hidden="true" onClick={onCancel}/>
            </styled.Header>

            <styled.Body>
                <styled.TableContainer style={{backdropFilter: 'none !important'}}>
                    {Table}
                </styled.TableContainer>
                <styled.SectionBreak/>
            </styled.Body>



            <styled.Footer>
                <Button
                    type={"button"}
                    schema={'lots'}
                    label={"Preview Lots"}
                    onClick={()=>{
                        const payload = createPayload()
                        onCreateClick(payload)
                    }}
                    style={{minWidth: '14rem', minHeight: '3rem'}}
                />
            </styled.Footer>
        </styled.Container>
    )
}


export const PasteForm = (props) => {

	const {
		onPreviewClick,
        onCreateClick,
        onCancel,
		hidden
	} = props

	const [selectedFieldNames, setSelectedFieldNames] = useState([])


	const handlePreviewClick = (payload) => {
		onPreviewClick && onPreviewClick(payload)
	}


	return(
		<Formik
			initialValues={{
				selectedFieldNames: [],
				table: props.table
			}}

			validate={(values, props) => {
				try {
					templateMapperSchema.validateSync(values, {
						abortEarly: false,
						context: values
					});
				} catch (error) {
					if (error.name !== "ValidationError") {
						throw error;
					}

					return error.inner.reduce((errors, currentError) => {
						errors = set(errors, currentError.path, currentError.message)
						return errors;
					}, {});
				}
			}}
			validateOnChange={true}
			validateOnMount={false} // leave false, if set to true it will generate a form error when new data is fetched
			validateOnBlur={true}
			enableReinitialize={false}

			onSubmit={async (values, { setSubmitting, setTouched, resetForm }) => {
				// set submitting to true, handle submit, then set submitting to false
				// the submitting property is useful for eg. displaying a loading indicator
				const {
					buttonType
				} = values

				setSubmitting(true)
				// await handleSubmit(values, formMode)
				setTouched({}) // after submitting, set touched to empty to reflect that there are currently no new changes to save
				setSubmitting(false)
			}}
		>
			{formikProps =>
				<PasteMapper
					onPreviewClick={handlePreviewClick}
					formikProps={formikProps}
					setSelectedFieldNames={setSelectedFieldNames}
                    {...props}
				/>
			}
		</Formik>
	)
}

// Specifies propTypes
PasteMapper.propTypes = {
	table: PropTypes.arrayOf(	// array of array of strings
		PropTypes.arrayOf(
			PropTypes.string
		)
	)
};

// Specifies the default values for props:
PasteMapper.defaultProps = {
	table: [],
	schema: "lots",
	onCancel: () => {}
};


export default PasteMapper
