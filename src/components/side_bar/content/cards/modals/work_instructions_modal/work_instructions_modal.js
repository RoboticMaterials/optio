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
import * as styled from './work_instructions_modal.style'
// Import Components
import Checkbox from '../../../../../../components/basic/checkbox/checkbox'
import Button from "../../../../../../components/basic/button/button";

const WorkInstructionsModal = (props) => {

  const processes = useSelector(state => state.processesReducer.processes)
  const stations = useSelector(state => state.stationsReducer.stations)
  const lotTemplates = useSelector(state => {return state.lotTemplatesReducer.lotTemplates})

  const dispatch = useDispatch()
  const dispatchPutLotTemplate = async (lotTemplate, id) => await dispatch(putLotTemplate(lotTemplate, id))

  const [progress , setProgress] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [uint8Array, setUint8Array] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [stationFiles, setStationFiles] = useState({})
  const {
    values,
    setShowWorkInstructionModal,
    showWorkInstructionsModal,
    lotTemplateId,
    setWorkInstructions,
  } = props

  const onDocumentLoadSuccess = (numPages) => {
    setNumPages(numPages);
  }

  const handleFileInput = (e, id) => {
    if(!!lotTemplates[lotTemplateId].workInstructions && !!lotTemplates[lotTemplateId].workInstructions[id]){
      handleDeleteFile(lotTemplates[lotTemplateId].workInstructions[id], id)
    }

    let fileID = uuidv4()
      setSelectedFile(e.target.files[0]);
      setStationFiles({//Keeps track of upload status percent at each station
        ...stationFiles,
        [id]: e.target.files[0].name
      })

      setWorkInstructions(id, e.target.files[0].name)
      const params = {
          ACL: 'public-read',
          Body: e.target.files[0],
          Bucket: S3_BUCKET,
          Key: e.target.files[0].name,
      };


      myBucket.putObject(params)
          .on('httpUploadProgress', (evt) => {
              setProgress({
                ...progress,
               [id]: Math.round((evt.loaded / evt.total) * 100)
              })
          })
          .send((err) => {
              if (err) console.log(err)
          })

      }

  const handleUploadAll = (e) => {

    let process = processes[values.processId]

    for(const i in process.flattened_stations){
      let id = process.flattened_stations[i].stationID
      if(!!lotTemplates[lotTemplateId].workInstructions && !!lotTemplates[lotTemplateId].workInstructions[id]){
        handleDeleteFile(lotTemplates[lotTemplateId].workInstructions[id], id)
      }
    }
      setWorkInstructions(process.flattened_stations, e.target.files[0].name, process.flattened_stations)


      const params = {
          ACL: 'public-read',
          Body: e.target.files[0],
          Bucket: S3_BUCKET,
          Key: e.target.files[0].name,
      };


      myBucket.putObject(params)
          .on('httpUploadProgress', (evt) => {

          })
          .send((err) => {
              if (err) console.log(err)
          })

      }


  const handleDeleteFile = async(key, stationID) => {

      const params = {
          Bucket: S3_BUCKET,
          Key: key

      };

      let usedElsewhere = false
      for(const i in lotTemplates[lotTemplateId].workInstructions){//if file is used by other station dont delete from s3
        if(lotTemplates[lotTemplateId].workInstructions[i] === key && stationID!==i){
          usedElsewhere = true
        }
      }

      if(!usedElsewhere){
        const objects = myBucket
          .deleteObject(params, function(err, data){
            if(err)throw err
          })
        }


      let template = lotTemplates[lotTemplateId]
      delete template.workInstructions[stationID]
      await dispatchPutLotTemplate(template, lotTemplateId)
      }

  const renderStationList = () => {
    let process = processes[values.processId]
      return (
      Object.values(process.flattened_stations).map((station)=>{
        return (
          <styled.ListItem
            onClick = {()=> {
            }}
          >
            <styled.FileContainer style = {{minWidth: '20rem'}}>
              <styled.ListItemTitle>Station:</styled.ListItemTitle>
              <styled.ListItemTitle style = {{fontWeight: '600', padding: '.5rem 0.5rem 0.5rem 0.5rem'}}>{stations[station.stationID].name}</styled.ListItemTitle>
            </styled.FileContainer>

            <styled.FileContainer style = {{minWidth: '20rem', flex: '2'}}>
              <styled.ListItemTitle
              >
              {!!lotTemplates && !!lotTemplates[lotTemplateId] && !!lotTemplates[lotTemplateId].workInstructions && lotTemplates[lotTemplateId].workInstructions[station.stationID] ? 'Uploaded File:' : 'No File Uploaded'}
              </styled.ListItemTitle>
                <styled.RowContainer style = {{maxWidth: '17rem',}}>
                  <styled.ListItemTitle style = {{fontWeight: '600', padding: '.5rem 0.5rem 0.5rem 0.5rem'}}>
                    {!!lotTemplates && !!lotTemplates[lotTemplateId] && !!lotTemplates[lotTemplateId].workInstructions && lotTemplates[lotTemplateId].workInstructions[station.stationID]}
                  </styled.ListItemTitle>
                  {!!lotTemplates && !!lotTemplates[lotTemplateId] && !!lotTemplates[lotTemplateId].workInstructions && lotTemplates[lotTemplateId].workInstructions[station.stationID] &&
                  <i
                    class = 'fas fa-minus-circle'
                    style = {{fontSize: '1.5rem', color: '#FF4B4B', cursor: 'pointer'}}
                    onClick = {()=>{
                      handleDeleteFile(lotTemplates[lotTemplateId].workInstructions[station.stationID], station.stationID)
                    }}
                  />
                }
                </styled.RowContainer>
            </styled.FileContainer>

            <styled.FileContainer style = {{flex: 'none', justifyContent: 'start'}}>
            <styled.UploadButton>
              <input type="file" style = {{position: 'relative', zIndex: '2', opacity: '0.001'}} onChange={(e)=>handleFileInput(e, station.stationID)}/>
              <styled.ListItemIcon
                className = 'fas fa-cloud-upload-alt'
                style = {{position: 'absolute'}}
              />
              <styled.ListItemTitle style = {{position: 'absolute', paddingLeft: '2.2rem', paddingTop: '0.5rem'}}>
              {!!lotTemplates[lotTemplateId] &&  !!lotTemplates[lotTemplateId].workInstructions && !!lotTemplates[lotTemplateId].workInstructions[station.stationID]? 'Change File' : 'Upload File'}
              </styled.ListItemTitle>
            </styled.UploadButton>

            {progress[station.stationID]>0 && progress[station.stationID]<100 &&
              <styled.RowContainer>
                <styled.StatusText>Progress:</styled.StatusText>
                <styled.SelectedFileDiv>
                  <styled.ListItemTitle style = {{color: 'white', marginLeft: '0.5rem'}}>{progress[station.stationID]}%</styled.ListItemTitle>
                </styled.SelectedFileDiv>
              </styled.RowContainer>
            }
            </styled.FileContainer>
          </styled.ListItem>
        )
      })
    )
  }
  return (

        <styled.Container
            isOpen={showWorkInstructionsModal}
            contentLabel="Kick Off Modal"
            style={{
                overlay: {
                    zIndex: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                },
            }}
        >
            <styled.BodyContainer>
                <styled.Title schema={'lots'}>Add Work Instructions</styled.Title>
                <styled.CloseButton
                    className={'fas fa-times'}
                    style={{ cursor: 'pointer', padding: '1rem' }}
                    onClick = {()=> {
                      setShowWorkInstructionModal(false)
                    }}
                />

            <styled.UploadAllButton>
              <styled.ListItemTitle style = {{position: 'absolute'}}>Upload File To All Stations</styled.ListItemTitle>
              <input
                type="file"
                style = {{position: 'relative', zIndex: '2', opacity: '0.001'}}
                onChange={(e)=>{
                    handleUploadAll(e)
                  }}
              />
              <styled.ListItemIcon
                className = 'fas fa-cloud-upload-alt'
                style = {{position: 'absolute', left: '17.5rem'}}
              />
            </styled.UploadAllButton>

            <styled.ColumnContainer>
            {renderStationList()}
            </styled.ColumnContainer>
            <Button
              type={"button"}
              schema={'lots'}
              label={"Close"}
              onClick={()=>{
                setShowWorkInstructionModal(false)
              }}
              style={{minWidth: '14rem', minHeight: '3rem', marginTop: '2rem', marginLeft: '0rem', marginRight: '0rem', color: 'white'}}
            />
            </styled.BodyContainer>
        </styled.Container>
    )
}

export default WorkInstructionsModal
