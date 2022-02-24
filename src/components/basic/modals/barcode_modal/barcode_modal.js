import React, {useEffect, useState, useRef, useMemo} from "react";
import Modal from 'react-modal';
import ReactToPrint from 'react-to-print'
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from 'react-router-dom'


import Button from "../../../basic/button/button";
import Textbox from "../../../basic/textbox/textbox";
import LotContainer from "../../../../components/side_bar/content/cards/lot/lot_container"

// actions
import {showBarcodeModal} from '../../../../redux/actions/card_actions'
// styles
import * as styled from './barcode_modal.style'

const BarcodeModal = (props) => {

    const {
        isOpen,
        title,
        close,
        handleClose,
        barcodeId,
        card
    } = props

    const dispatch = useDispatch()
    const dispatchShowBarcodeModal = (bool) => dispatch(showBarcodeModal(bool))
    const history = useHistory()
    var JsBarcode = require("jsbarcode")
    const buttonStyle = {marginBottom: '0rem', marginTop: 0}

    const [generated, setGenerated] = useState(false)
    const componentRef = useRef(null)

    useEffect(() => {
      if (!!componentRef.current) {
        JsBarcode("#barcode", barcodeId, {
          width: 12,
          height: 600,          
        })
        setGenerated(true)
      }
  	}, [componentRef.current])

    const parseFieldValue = (field) => {
      let fieldValue;
      if (field.dataType === 'DATE_RANGE') {
        if (field.value[0]) {
          fieldValue = new Date(field.value[0])?.toLocaleDateString();
        } else {
          fieldValue = 'None'
        }

        fieldValue += ' => ';
        if (field.value[1]) {
          fieldValue += new Date(field.value[1])?.toLocaleDateString()
        } else {
          fieldValue += 'None'
        }
      } else if (field.dataType === 'DATE') {
        if (field.value) {
          fieldValue = new Date(field.value)?.toLocaleDateString()
        } else {
          fieldValue = 'None'
        }
      } else {
        fieldValue = field.value
      }

      return fieldValue
    }

    const fields = useMemo(() => {
      if (!card) return null
      return (
        <styled.FieldsContainer>
          {card.fields.map(row => (
            <>
              {row.map(field => (field.showInBarcode && 
                <styled.Field>
                  <styled.FieldLabel>{field.fieldName}: </styled.FieldLabel>
                  <styled.FieldValue>{parseFieldValue(field)}</styled.FieldValue>
                </styled.Field>
              ))}
            </>
          ))}
        </styled.FieldsContainer>
      )
    }, [card])

    return (
        <styled.Container
            isOpen={isOpen}
            contentLabel="Confirm Delete Modal"
            onRequestClose={close}
            style={{
                overlay: {
                    zIndex: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                },
                content: {

                }
            }}
        >

            

            <styled.Header>
              {generated &&
                <ReactToPrint
                  trigger = {()=><styled.PrintIcon className = 'fas fa-print' style = {{paddingLeft: '1rem'}}/>}
                  content = {() => componentRef.current}
                />
              }
              <styled.Title
                  onClick = {()=>{
                  }}
              >{title}
              </styled.Title>
              <styled.CloseIcon className="fa fa-times" aria-hidden="true" onClick={()=>{handleClose(); setGenerated(false)}}/>
            </styled.Header>
            <styled.BodyContainer ref = {componentRef} generated = {generated}>
              {fields}

              <styled.BarcodeSVG
                id = "barcode"
              />

            </styled.BodyContainer>
        </styled.Container>
    );
};

export default BarcodeModal
