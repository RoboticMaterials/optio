import React, {useEffect, useState, useRef} from "react";
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
          width: 16,
          height: 300,          
        })
        setGenerated(true)
      }
  	}, [componentRef.current])

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

                  <styled.BarcodeSVG
                    id = "barcode"
                  />
            
            {!!card && card.fields.map((row) => {
              return <div style={{display: 'flex', flexDirection: 'center', width: '100%', justifyContent: 'space-around'}}>
                {
                  row.map((field) => {
                      return !!field.showInBarcode && <styled.Field>
                      <styled.FieldLabel>{field.fieldName}</styled.FieldLabel>: <styled.FieldValue>{field.dataType === 'DATE_RANGE' ?
                          !! field.value[0] ? `${new Date(field.value[0])?.toLocaleDateString()} -> ${new Date(field.value[1])?.toLocaleDateString()}` : ``
                          : field.dataType === 'DATE_SINGLE' ?
                             new Date(field.value)?.toLocaleDateString() 
                            :
                            field.value}</styled.FieldValue>
                    </styled.Field>
                    
                  }
                  )
                }
              </div>
            })}

            </styled.BodyContainer>
        </styled.Container>
    );
};

export default BarcodeModal
