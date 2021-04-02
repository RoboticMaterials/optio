/* Amplify Params - DO NOT EDIT
	API_RMSTUDIOCLOUD_GRAPHQLAPIENDPOINTOUTPUT
	API_RMSTUDIOCLOUD_GRAPHQLAPIIDOUTPUT
	API_RMSTUDIOCLOUD_ORGANIZATIONTABLE_ARN
	API_RMSTUDIOCLOUD_ORGANIZATIONTABLE_NAME
	API_RMSTUDIOCLOUD_TASKQUEUEEVENTSTABLE_ARN
	API_RMSTUDIOCLOUD_TASKQUEUEEVENTSTABLE_NAME
	API_RMSTUDIOCLOUD_USERTABLE_ARN
	API_RMSTUDIOCLOUD_USERTABLE_NAME
	AUTH_RMSTUDIOCLOUD298656C6_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");

const tableNames = {
	taskQueueEvents: process.env.API_RMSTUDIOCLOUD_TASKQUEUEEVENTSTABLE_NAME,
	taskQueue: process.env.API_RMSTUDIOCLOUD_TASKQUEUETABLE_NAME
}

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const taskQueueItem = event.arguments.task_id

    console.log(taskQueueItem);

    const taskParams = {
        TableName: tableNames.task,
        Key: {
            'id': taskQueueItem.task_id ? taskQueueItem.task_id : ''
        }
    };

    let tasks = await docClient.scan(taskParams).promise();
	tasks = tasks.Items

    console.log(tasks);

};
