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

const docClient = new AWS.DynamoDB.DocumentClient();

const tableNames = {
	map: process.env.API_RMSTUDIOCLOUD_MAPTABLE_NAME
};

const mapData = require('./mapData')

exports.handler = async (event) => {
    console.log(process.env);
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
        const mapParams = {
            TableName: tableNames.map,
            Item: blankMap
        };

        let map = await docClient.put(mapParams).promise();

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
