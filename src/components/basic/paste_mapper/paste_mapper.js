import React, {useContext, useEffect, useRef, useState, useMemo } from 'react'
import PropTypes from "prop-types";
import { Formik } from "formik";
import set from "lodash/set";
import { useDispatch } from 'react-redux'

// components external
import Spreadsheet from "react-spreadsheet";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";


// components internal
import Button from "../button/button";
import DropDownSearch from '../drop_down_search_v2/drop_down_search'

//utils
import { templateMapperSchema } from "../../../methods/utils/form_schemas";
import { deepCopy } from '../../../methods/utils/utils'
import { createPastePayload } from '../../../methods/utils/lot_utils'

// style
import * as styled from './paste_mapper.style'

// actions
import { putLotTemplate } from '../../../redux/actions/lot_template_actions'
import BackButton from '../back_button/back_button';

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

    const [table, setTable] = useState(values.table)
    const [fieldMapping, setFieldMapping] = useState([])

    const dispatch = useDispatch()
    const dispatchPutLotTemplate = async (lotTemplate, id) => await dispatch(putLotTemplate(lotTemplate, id))

    useEffect(() => {
        if (!!lotTemplate?.uploadFieldMapping) {
            let originalFieldMapping = lotTemplate.uploadFieldMapping
                .map(displayName => availableFields
                    .find(field => field.displayName === displayName))

            setFieldMapping(originalFieldMapping)
        }
    }, [])

    const renderColumnDropdown = ({ column }) => {

        const unusedFields = availableFields.map(field => {

            let disabled = false;
            if (!!lotTemplate?.uploadFieldMapping) {
                const usedValueIndex = lotTemplate.uploadFieldMapping.findIndex((fieldDName, ind) => fieldDName === field.displayName && ind !== column)
                if (usedValueIndex !== -1 && usedValueIndex < table[0].length) {
                    disabled = true
                }
            }
            return {
                ...field,
                disabled,
            }

        })

        const savedDName = (!!lotTemplate?.uploadFieldMapping ? lotTemplate.uploadFieldMapping[column] : null)
        const savedValue = !!savedDName ? [unusedFields.find(field => field.displayName === savedDName)] : []

        return (
            <td style={{minWidth: '4rem'}}>
                <DropDownSearch
                    placeholder="Column Field"
                    labelField="displayName"
                    valueField="displayName"
                    options={unusedFields}
                    disabledLabel={''}
                    values={savedValue}
                    dropdownGap={2}
                    schema={'lots'}
                    noDataLabel="No matches found"
                    closeOnSelect="true"
                    searchable={false}
                    onChange={values => {
                        // Save this value locally to be used when creating the payload
                        let fieldMappingCopy = deepCopy(fieldMapping)
                        fieldMappingCopy[column] = values[0]
                        setFieldMapping(fieldMappingCopy)

                        // Save this value in the product group template for next time you paste
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

    const deleteRow = (row) => {
        let tableCopy = deepCopy(table);
        tableCopy.splice(row, 1)
        setTable(tableCopy)
    }   

    const addAbove = (row) => {
        let tableCopy = deepCopy(table);
        const numCols = tableCopy[0].length
        const newRow = new Array(numCols).fill('')
        tableCopy.splice(row, 0, newRow)
        setTable(tableCopy)
    }

    const addBelow = (row) => {
        let tableCopy = deepCopy(table);
        const numCols = tableCopy[0].length
        const newRow = new Array(numCols).fill('')
        tableCopy.splice(row+1, 0, newRow)
        setTable(tableCopy)
    }

    const renderRowLabel = ({ row }) => {
        return (
                
                <styled.RowLabelContainer>
                    <ContextMenuTrigger id={`context-menu-${row}`}>
                        <styled.RowLabel>{row+1}</styled.RowLabel>
                    </ContextMenuTrigger>

                    <ContextMenu id={`context-menu-${row}`}>
                        <MenuItem onClick={() => deleteRow(row)}>
                            Delete Row
                        </MenuItem>
                        <MenuItem onClick={() => addAbove(row)}>
                            Add Row Above
                        </MenuItem>
                        <MenuItem onClick={() => addBelow(row)}>
                            Add Row Below
                        </MenuItem>
                </ContextMenu>
                </styled.RowLabelContainer>
            
        )
    }

    const Table = useMemo(() => {
        return <Spreadsheet data={table} ColumnIndicator={renderColumnDropdown} RowIndicator={renderRowLabel}/>
    }, [table])

    return (
        <styled.Container>
            <styled.Header>
                <BackButton schema={'lots'} onClick={onCancel}/>
                <styled.Title>Upload Lot Data</styled.Title>
                <styled.CloseIcon className="fa fa-times" aria-hidden="true" onClick={onCancel}/>
            </styled.Header>

            <styled.Body>
                <styled.ContentContainer>
                    <styled.SectionDescription>Select the dropdown at the top of each column to assign it to one of the fields in your Product Group Template</styled.SectionDescription>
                </styled.ContentContainer>
                <styled.SectionBreak />
                <styled.TableContainer style={{backdropFilter: 'none !important'}}>
                    {Table}
                </styled.TableContainer>
                <styled.SectionBreak/>
            </styled.Body>



            <styled.Footer>
                <Button
                    type={"button"}
                    schema={'lots'}
                    label={"Validate Lots"}
                    onClick={()=>{
                        const payload = createPastePayload(table, fieldMapping)
                        console.log(payload)
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
