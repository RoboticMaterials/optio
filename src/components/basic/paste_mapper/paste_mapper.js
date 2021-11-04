import React, {useContext, useEffect, useRef, useState, useMemo } from 'react'
import { useDispatch, useSelector } from "react-redux";

import PropTypes from "prop-types";
import { Formik } from "formik";
import set from "lodash/set";
import ReactTooltip from 'react-tooltip';

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
import SimpleModal from '../modals/simple_modal/simple_modal';


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
    const [fieldMapping, setFieldMapping] = useState(new Array(availableFields.length).fill(null))
    const [disableMergeButton, setDisableMergeButton] = useState(false)
    const [showAutoCompleteModal, setShowAutoCompleteModal] = useState(false)
    const dispatch = useDispatch()
    const dispatchPutLotTemplate = async (lotTemplate, id) => await dispatch(putLotTemplate(lotTemplate, id))
    const parseMode = useSelector(state => state.settingsReducer.settings.parseMode)
    useEffect(() => {
        if (!!lotTemplate?.uploadFieldMapping) {
            let originalFieldMapping = lotTemplate.uploadFieldMapping
                .map(displayName => availableFields
                    .find(field => field.displayName === displayName))

            setFieldMapping(originalFieldMapping)
        }
    }, [])

    useEffect(() => {
      if(!!lotTemplate?.uploadFieldMapping){
        const foundQtyField = lotTemplate.uploadFieldMapping.find(field => field == 'LILIQuantity')
        if(foundQtyField === 'LILIQuantity') {
          console.log(foundQtyField)
          setDisableMergeButton(false)
        }
        else setDisableMergeButton(true)
      }
      else{
        return setDisableMergeButton(true)
      }
    }, [lotTemplate])

    const renderColumnDropdown = ({ column }) => {

        const unusedFields = availableFields.map(availField => {

            let disabled = false;

            const usedValueIndex = fieldMapping.findIndex((field, ind) => field?.displayName === availField.displayName && ind !== column)
            if (usedValueIndex !== -1 && usedValueIndex < table[0].length) {
                disabled = true
            }

            return {
                ...availField,
                disabled,
            }

        })

        const savedDName = (fieldMapping[column]?.displayName || null)
        const savedValue = !!savedDName ? [unusedFields.find(field => field.displayName === savedDName)] : []

        return (
            <td style={{minWidth: '4rem'}}>
                <ContextMenuTrigger id={`context-menu-column-${column}`}>
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
                        onClick={() => console.log("CLICK")}
                        onChange={values => {
                            // Save this value locally to be used when creating the payload
                            let fieldMappingCopy = deepCopy(fieldMapping)
                            fieldMappingCopy[column] = values[0]
                            setFieldMapping(fieldMappingCopy)

                            // Save this value in the product group template for next time you paste
                            let lotTemplateCopy = deepCopy(lotTemplate)
                            if(!lotTemplateCopy.uploadFieldMapping){
                              lotTemplateCopy = {
                                ...lotTemplateCopy,
                                uploadFieldMapping: new Array(availableFields.length).fill(null)
                              }
                            }
                            lotTemplateCopy.uploadFieldMapping[column] = values[0]?.displayName
                            dispatchPutLotTemplate(lotTemplateCopy, lotTemplateCopy._id)
                        }}
                        className="w-100"
                    />
                </ContextMenuTrigger>

                <ContextMenu id={`context-menu-column-${column}`}>
                    <MenuItem onClick={() => {
                        let fieldMappingCopy = deepCopy(fieldMapping)
                        fieldMappingCopy[column] = null
                        setFieldMapping(fieldMappingCopy)

                        // Save this value in the product group template for next time you paste
                        let lotTemplateCopy = deepCopy(lotTemplate)
                        if(lotTemplate && lotTemplate.uploadFieldMapping){
                          lotTemplateCopy.uploadFieldMapping[column] = null
                          dispatchPutLotTemplate(lotTemplateCopy, lotTemplateCopy._id)
                        }

                    }}>
                        Clear
                    </MenuItem>
                </ContextMenu>
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

    const handleApplyLotTemplateFields = () => {

      let lotTemplateCopy = deepCopy(lotTemplate)
      if(!lotTemplateCopy.uploadFieldMapping){
        lotTemplateCopy = {
          ...lotTemplateCopy,
          uploadFieldMapping: []
        }
      }

      let fieldMappingCopy = deepCopy(fieldMapping)

      //Loop thgrough available fields and assign dropdown choices
      for(const i in availableFields){
        fieldMappingCopy[i] = availableFields[i]
        lotTemplateCopy.uploadFieldMapping[i] = availableFields[i].displayName
      }
      setFieldMapping(fieldMappingCopy)
      dispatchPutLotTemplate(lotTemplateCopy, lotTemplateCopy._id)
    }

    const handleMergeIdenticalLots = () => {

      let tableCopy = deepCopy(table)
      for(let a = 0; a<tableCopy.length; a++){
        for(let i = a+1; i<tableCopy.length; i++){
          let match = true
          let qtyIndex = null
          for(const j in tableCopy[i]){
            if(lotTemplate?.uploadFieldMapping && lotTemplate.uploadFieldMapping[j] && lotTemplate.uploadFieldMapping[j] === 'LILIQuantity'){
              qtyIndex = j
            }
            if(tableCopy[i][j].value !== tableCopy[a][j].value) {
              match = false
              break
            }
          }
          if(match === true){
            if(!!tableCopy[a] && !!tableCopy[a][qtyIndex]){
              tableCopy[a][qtyIndex].value = (parseInt(tableCopy[a][qtyIndex].value) + parseInt(tableCopy[i][qtyIndex].value)).toString()
              tableCopy.splice(i, 1)
            }
            else{
              console.log('No qty field')
            }
          }

        }
      }
      setTable(tableCopy)
    }

    /**
     * Auto Fill the dropdowns based on the first row of the table. The matcher will lower case
     * and delete any spaces when comparing the strings
     */
    const autoComplete = () => {
      const firstRow = table[0]
      let tempFieldMap = new Array(availableFields.length).fill(null)

      // Create mapping if one doesnt exist
      let lotTemplateCopy = deepCopy(lotTemplate)
      if(!lotTemplateCopy.uploadFieldMapping){
        lotTemplateCopy = {
          ...lotTemplateCopy,
          uploadFieldMapping: new Array(availableFields.length).fill(null)
        }
      }

      let formattedFields = availableFields.map(field => field.displayName.toLowerCase().replace(/\s/g, ''));
      let value, formattedValue, matchIdx;
      for (var i in firstRow) {
        value = firstRow[i].value
        formattedValue = value.toLowerCase().replace(/\s/g, '')
        matchIdx = formattedFields.findIndex(formattedField => formattedField === formattedValue)
        if (matchIdx !== -1) {
          tempFieldMap[i] = availableFields[matchIdx]
          lotTemplateCopy.uploadFieldMapping[i] = availableFields[matchIdx]?.displayName
        }
      }

      // let tableCopy = deepCopy(table);
      // tableCopy.splice(0, 1)
      // setTable(tableCopy)

      setFieldMapping(tempFieldMap)
      dispatchPutLotTemplate(lotTemplateCopy, lotTemplateCopy._id)
      setShowAutoCompleteModal(false)
    }

    const renderRowLabel = ({ row }) => {
        return (

                <styled.RowLabelContainer>
                    <ContextMenuTrigger id={`context-menu-${row}`}>
                        <div style={{display: 'flex', width: '100%', flexGrow: '1', justifyContent: 'center', position: 'relative'}}>
                          <styled.RowLabel>{row+1}</styled.RowLabel>
                          {row === 0 &&
                            <>
                              <styled.AutoIcon className="fas fa-magic" data-tip data-for="autocomplete-tooltip" onClick={() => setShowAutoCompleteModal(true)}/>
                              <ReactTooltip id="autocomplete-tooltip" effect="solid"><div style={{width: '10rem'}}>Auto fill columns based on values in the first row.</div></ReactTooltip>
                            </>
                          }
                        </div>
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

    const renderCornerCounter = () => {
      const usedQty = fieldMapping.filter((field, ind) => field !== null).length
      return (
        <styled.RowLabelContainer>
          <styled.RowLabel style={{minWidth: '8rem'}}>
            {usedQty}/{availableFields.length} used
          </styled.RowLabel>
        </styled.RowLabelContainer>
      )
    }

    const Table = useMemo(() => {
        return <Spreadsheet data={table} ColumnIndicator={renderColumnDropdown} RowIndicator={renderRowLabel} CornerIndicator={renderCornerCounter}/>
    }, [table, fieldMapping])

    return (
      <>
        {showAutoCompleteModal && 
          <SimpleModal 
            isOpen={showAutoCompleteModal}
            title="Confirm Auto Complete" 
            onRequestClose={() => setShowAutoCompleteModal(false)}
            onCloseButtonClick={() => setShowAutoCompleteModal(false)}
            handleOnClick1={() => setShowAutoCompleteModal(false)}
            handleOnClick2={autoComplete}
            button_1_text="Cancel"
            button_2_text="Confirm"
            content="Are you sure you want to continue? This may overwrite dropdowns that have already been filled out and will delete this row."
          />
        }
        <styled.Container>
            <styled.Header>
                <BackButton schema={'lots'} onClick={onCancel}/>
                <styled.Title>Upload Lot Data</styled.Title>
                <styled.CloseIcon className="fa fa-times" aria-hidden="true" onClick={onCancel}/>
            </styled.Header>

            <styled.Body>
                <styled.ContentContainer>
                  {!!parseMode && parseMode === 'Alpen' &&
                      <Button
                          style={{maxWidth: '18rem', marginLeft: '2rem'}}
                          secondary
                          label={'Apply lot template fields'}
                          onClick = {()=>{
                            handleApplyLotTemplateFields()
                          }}
                          type="button"
                      />
                    }
                    {!!parseMode && parseMode === 'Alpen' &&
                      <Button
                          style={{maxWidth: '18rem', marginLeft: '1rem'}}
                          secondary
                          disabled = {disableMergeButton}
                          label={'Merge identical lots'}
                          onClick = {()=>{
                            handleMergeIdenticalLots()
                          }}
                          type="button"
                          schema = {'lots'}
                      />
                    }

                    <styled.SectionDescription style = {{flex: parseMode === 'Alpen' && '0.75'}}>Select the dropdown at the top of each column to assign it to one of the fields in your Product Group Template</styled.SectionDescription>
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
                        onCreateClick(payload)
                    }}
                    style={{minWidth: '14rem', minHeight: '3rem'}}
                />
            </styled.Footer>
        </styled.Container>
      </>
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
