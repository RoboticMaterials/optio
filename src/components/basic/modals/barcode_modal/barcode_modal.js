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
        dashboard,
        onSubmit,
        handleClose,
        children,
        barcodeId,
    } = props

    const cards = useSelector(state => state.cardsReducer.cards)
    const stations = useSelector(state =>state.stationsReducer.stations)
    const barcodeModal = useSelector(state => state.cardsReducer.showBarcodeModal)

    const dispatch = useDispatch()
    const dispatchShowBarcodeModal = (bool) => dispatch(showBarcodeModal(bool))
    const history = useHistory()
    var JsBarcode = require("jsbarcode")
    const buttonStyle = {marginBottom: '0rem', marginTop: 0}

    const [generated, setGenerated] = useState(false)
    const componentRef = useRef()

    useEffect(() => {
  	}, [])

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
              {!!generated &&
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
            <styled.BodyContainer generated = {generated}>

                {!generated &&
                  <Button
                    schema={'lots'}
                    type={"button"}
                    style={{...buttonStyle, marginBottom: '0rem', marginTop: 0}}
                    onClick={() => {
                      JsBarcode("#barcode", barcodeId)
                      setGenerated(true)
                    }}
                  >
                  Load Barcode
                  </Button>
                }

                  <svg
                    id = "barcode"
                    ref = {componentRef}
                  />

            </styled.BodyContainer>
        </styled.Container>
    );
};

export default BarcodeModal
