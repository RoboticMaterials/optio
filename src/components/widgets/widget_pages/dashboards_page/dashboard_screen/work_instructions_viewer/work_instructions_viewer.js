import React, { Component, useState, useEffect } from 'react';
import AWS from 'aws-sdk'

import { useSelector, useDispatch} from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { uuidv4 } from '../../../../../../methods/utils/utils';
import {putLotTemplate} from "../../../../../../redux/actions/lot_template_actions";


//S3 constants
const S3_BUCKET ='winstructions';
const REGION ='us-west-1';

//AWS config keys
AWS.config.update({
    accessKeyId: 'AKIAYKB6JQEJI3A35AFN',
    secretAccessKey: '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'
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

// Import Style
import * as styled from './work_instructions_viewer.style'
// Import Components
import Checkbox from '../../../../../../components/basic/checkbox/checkbox'
import Button from "../../../../../../components/basic/button/button";

const WorkInstructionsViewer = (props) => {

  const processes = useSelector(state => state.processesReducer.processes)
  const stations = useSelector(state => state.stationsReducer.stations)
  const lotTemplates = useSelector(state => {return state.lotTemplatesReducer.lotTemplates})

  const dispatch = useDispatch()
  const dispatchPutLotTemplate = async (lotTemplate, id) => await dispatch(putLotTemplate(lotTemplate, id))

  const [uint8Array, setUint8Array] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)
  const [numPages, setNumPages] = useState(null);

  const {
    setShowWorkInstructionsViewer,
    showWorkInstructionsViewer,
    stationID,
    lotTemplateId
  } = props

  useEffect(() => {

    if(!!lotTemplates[lotTemplateId].workInstructions && !!lotTemplates[lotTemplateId].workInstructions[stationID]){
      const params = {
          Bucket: S3_BUCKET,
          Key: lotTemplates[lotTemplateId].workInstructions[stationID]

      };

     const objects = myBucket
      .getObject(params, function(err, data){
        if(err)throw err
        var file = new Blob([data.Body], {type: 'application/pdf'})
        setUint8Array(true)
        var fileURL = URL.createObjectURL(file)
        setFileUrl(fileURL)
        //window.open(fileURL)
      })
    }
  }, [])


  const onDocumentLoadSuccess = (numPages) => {
    setNumPages(numPages);
  }


  return (

        <styled.Container
            isOpen={showWorkInstructionsViewer}
            contentLabel="Kick Off Modal"
            style={{
                overlay: {
                    zIndex: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                },
            }}
        >
            <styled.BodyContainer>
                <styled.Title schema={'lots'}>{stations[stationID].name}  Work Instructions</styled.Title>
                <styled.CloseButton
                    className={'fas fa-times'}
                    style={{ cursor: 'pointer', padding: '1rem' }}
                    onClick = {()=> {
                      setShowWorkInstructionsViewer(false)
                    }}
            />

            <div>
            {!!fileUrl &&
              <iframe src = {fileUrl} style = {{width: '100%', minHeight: '80rem'}}/>
            }
            </div>
            <Button
              type={"button"}
              schema={'lots'}
              label={"Close"}
              onClick={()=>{
                setShowWorkInstructionsViewer(false)
              }}
              style={{minWidth: '14rem', minHeight: '3rem', marginTop: '2rem', marginLeft: '0rem', marginRight: '0rem', color: 'white'}}
            />
            </styled.BodyContainer>
        </styled.Container>
    )
}

export default WorkInstructionsViewer
