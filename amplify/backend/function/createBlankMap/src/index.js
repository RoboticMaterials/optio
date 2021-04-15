/* Amplify Params - DO NOT EDIT
	API_RMSTUDIOCLOUD_GRAPHQLAPIENDPOINTOUTPUT
	API_RMSTUDIOCLOUD_GRAPHQLAPIIDOUTPUT
	API_RMSTUDIOCLOUD_MAPTABLE_ARN
	API_RMSTUDIOCLOUD_MAPTABLE_NAME
	AUTH_RMSTUDIOCLOUD298656C6_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");

const URL = require('url');
const axios = require('axios');

const tableNames = {
	map: process.env.API_RMSTUDIOCLOUD_MAPTABLE_NAME
};

const mapData = require('./mapData')

exports.handler = async (event) => {
    console.log("process.env",process.env);
    console.log("tableNames",tableNames);
    console.log("event.arguments.organizationId",event.arguments.organizationId);
    try {
        const blankMap = {
            id: uuidv4(),
            organizationId: event.arguments.organizationId,
            map: mapData.mapData,
            name: "Blank Map",
            resolution: 0.05,
            origin_theta: 0,
            origin_x: 0,
            origin_y: 0
        }

        // put the taskQI in the taskQevents
        // const mapParams = {
        //     TableName: tableNames.map,
        //     Item: blankMap
        // };

        await handlePostMap(blankMap, event)

        // let map = await docClient.put(mapParams, ((err, data) => {
        //     console.log("docClient.put err", err)
        //     console.log("docClient.put data", data)
        // })).promise();

        return {
            posted: true
        }
    } catch (error) {
        console.log(error);
    }
    
};

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const handlePostMap = async (blankMap, event) => {

    try {
        AWS.config.update({
            region: process.env.AWS_REGION,
            credentials: new AWS.Credentials(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY, event.request.headers.authorization)
        });

        const createMap = /* GraphQL */ `
  mutation CreateMap(
    $input: CreateMapInput!
    $condition: ModelMapConditionInput
  ) {
    createMap(input: $input, condition: $condition) {
      id
      organizationId
      createdAt
      updatedAt
      allowed_methods
      created_by
      created_by_id
      created_by_name
      map
      name
      one_way_map
      origin_theta
      origin_x
      origin_y
      path_guides
      paths
      positions
      resolution
      session_id
    }
  }
`;

        const details = {
            input: blankMap
        };


        const post_body = {
            query: createMap,
            operationName: 'CreateMap',
            variables: details
        };

        // POST the GraphQL mutation to AWS AppSync using a signed connection

        const uri = URL.parse(process.env.API_RMSTUDIOCLOUD_GRAPHQLAPIENDPOINTOUTPUT);
        const httpRequest = new AWS.HttpRequest(uri.href, process.env.REGION);
        httpRequest.headers.host = uri.host;
        httpRequest.headers['Content-Type'] = 'application/json';
        httpRequest.headers['Authorization'] = event.request.headers.authorization;
        httpRequest.method = 'POST';
        httpRequest.body = JSON.stringify(post_body);

        const graphqlData = await axios({
            url: uri.href,
            method: 'POST',
            headers: {...httpRequest.headers},
            data: JSON.stringify(post_body)
        });

        console.log("graphqlData",graphqlData)
    }
    catch(err) {
        console.log("err",err)
    }

}
