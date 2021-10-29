import React, {useState} from 'react';
import AWS from 'aws-sdk'

import {Document, Page} from 'react-pdf'

const S3_BUCKET ='winstructions';
const REGION ='us-west-1';




AWS.config.update({
    accessKeyId: 'AKIAYKB6JQEJI3A35AFN',
    secretAccessKey: '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'
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

const AwsS3BucketUpload = () => {

    const [progress , setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uint8Array, setUint8Array] = useState(null)
    const [fileUrl, setFileUrl] = useState(null)
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);


    const onDocumentLoadSuccess = (numPages) => {
      setNumPages(numPages);
    }

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const uploadFile = (file) => {

        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3_BUCKET,
            Key: file?.name
        };

        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100))
            })
            .send((err) => {
                if (err) console.log(err)
            })
    }

    const listObjects = () => {

        const params = {
            Bucket: S3_BUCKET,
            Delimiter: '',

        };

       const objects = myBucket
        .listObjects(params, function(err, data){
          if(err)throw err
          console.log(data)
        })
      }


    const getObject = (key) => {

        const params = {
            Bucket: S3_BUCKET,
            Key: key

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

        const deleteObject = (key) => {

            const params = {
                Bucket: S3_BUCKET,
                Key: key

            };

             const objects = myBucket
              .deleteObject(params, function(err, data){
                if(err)throw err
              })
            }


    return(

     <div>
        <div>Native SDK File Upload Progress is {progress}%</div>
        <input type="file" onChange={handleFileInput}/>
        <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>
        <button
          onClick={() => {
            listObjects()
          }}
          >
          List objects
        </button>
        <button
          onClick={() => {
            getObject("sensors-18-04492.pdf")
          }}
          >
          Get object
        </button>

        <button
          onClick={() => {
            deleteObject("sensors-18-04492.pdf")
          }}
          >
          delete object
        </button>

        {!!uint8Array && fileUrl &&
          <div>
          <iframe src = {fileUrl}/>
          </div>
        }
        </div>
      )
    }

export default AwsS3BucketUpload;
