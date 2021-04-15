/* Amplify Params - DO NOT EDIT
	API_RMSTUDIOCLOUD_CARDTABLE_ARN
	API_RMSTUDIOCLOUD_CARDTABLE_NAME
	API_RMSTUDIOCLOUD_GRAPHQLAPIENDPOINTOUTPUT
	API_RMSTUDIOCLOUD_GRAPHQLAPIIDOUTPUT
	API_RMSTUDIOCLOUD_ORGANIZATIONTABLE_ARN
	API_RMSTUDIOCLOUD_ORGANIZATIONTABLE_NAME
	API_RMSTUDIOCLOUD_TASKQUEUEEVENTSTABLE_ARN
	API_RMSTUDIOCLOUD_TASKQUEUEEVENTSTABLE_NAME
	API_RMSTUDIOCLOUD_TASKQUEUETABLE_ARN
	API_RMSTUDIOCLOUD_TASKQUEUETABLE_NAME
	API_RMSTUDIOCLOUD_TASKTABLE_ARN
	API_RMSTUDIOCLOUD_TASKTABLE_NAME
	API_RMSTUDIOCLOUD_USERTABLE_ARN
	API_RMSTUDIOCLOUD_USERTABLE_NAME
	AUTH_RMSTUDIOCLOUD298656C6_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");

const tableNames = {
	task: process.env.API_RMSTUDIOCLOUD_TASKTABLE_NAME,
	lots: process.env.API_RMSTUDIOCLOUD_CARDTABLE_NAME,
	taskQueueEvents: process.env.API_RMSTUDIOCLOUD_TASKQUEUEEVENTSTABLE_NAME,
	taskQueue: process.env.API_RMSTUDIOCLOUD_TASKQUEUETABLE_NAME
}

const URL = require('url');
const axios = require('axios');

const docClient = new AWS.DynamoDB.DocumentClient({
	endpoint: process.env.DDB_ENDPOINT,
});

exports.handler = async (event) => {
	try {
		const taskQueueItem = event.arguments.taskQueueItem

		const taskParams = {
			TableName: tableNames.task,
			Key: {
				'id': taskQueueItem.taskId ? taskQueueItem.taskId : ''
			}
		};

		const lotParams = {
			TableName: tableNames.lots,
			Key: {
				'id': taskQueueItem.lotId
			}
		};

		let task = await docClient.get(taskParams).promise();
		task = task.Item

		let lot = null

		if(taskQueueItem.lotId){
			lot = await docClient.get(lotParams).promise();
			lot = lot.Item
		}
		
		// is there a lot
		if(lot){
			// are we moving the whole lot?
			if(taskQueueItem.quantity === task.totalQuantity){
				// move the whole lot
				delete lot.bins[task.load.station]

				lot.bins[task.unload.station] = {
					count: taskQueueItem.quantity
				}

			}else if(lot.bins[task.load.station]){
				//check how much they want to move and update it accordingly
				const diff = lot.bins[task.load.station].count - taskQueueItem.quantity

				if(diff === 0){
					// move the res of the lot
					delete lot.bins[task.load.station]

					if(lot.bins[task.unload.station]){
						lot.bins[task.unload.station].count = taskQueueItem.quantity + lot.bins[task.unload.station].count
					}else{
						lot.bins[task.unload.station] = {
							count: taskQueueItem.quantity
						}
					}
				}else{
					lot.bins[task.load.station].count = diff

					if(lot.bins[task.unload.station]){
						lot.bins[task.unload.station].count +=  taskQueueItem.quantity
					}else{
						lot.bins[task.unload.station] = {
							count: taskQueueItem.quantity
						}
					}
				}
			}

			await handlePostLot(lot, event)

		}
		
		// put the taskQI in the taskQevents
		const taskQEventsParams = {
			TableName: tableNames.taskQueueEvents,
			Item: taskQueueItem

		};

		await docClient.put(taskQEventsParams).promise();

		// delete from the TQ
		await handleDeleteTaskQueueItem(taskQueueItem.id, event)

	} catch (e) {
		console.log(e)
	}

    return null;
};

const handleDeleteTaskQueueItem = async (id, event) => {

	try {
		AWS.config.update({
			region: process.env.AWS_REGION,
			credentials: new AWS.Credentials(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY, event.request.headers.authorization)
		});

		const deleteTaskQueue = `
			mutation DeleteTaskQueue( $input: DeleteTaskQueueInput!) {
				deleteTaskQueue(input: $input) {
					id
					organizationId
					createdAt
					updatedAt
					device_type
					mission_status
					owner
					taskId
					custom_task
					dashboard
					showModal
					hil_response
					quantity
					lotId
					start_time
					end_time
					hil_station_id
					hil_message
				}
			}
		`

		const details = {
			input: {
				id
			}
		};


		const post_body = {
			query: deleteTaskQueue,
			operationName: 'DeleteTaskQueue',
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
	}
	catch(err) {
		console.log("err",err)
	}

}

const handlePostLot = async (lot, event) => {

	AWS.config.update({
		region: process.env.AWS_REGION,
		credentials: new AWS.Credentials(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY, event.request.headers.authorization)
	});

	const updateCard = `
		mutation UpdateCard( $input: UpdateCardInput!) {
			updateCard(input: $input) {
				id
				organizationId
				createdAt
				updatedAt
				bins
				flags
				templateValues
				lotNumber
				lotTemplateId
				name
				processId
				count
			}
		}
	`

	delete lot.__typename
	
    const details = {
        input: {
        	...lot,
        	bins: JSON.stringify(lot.bins),
        	flags: JSON.stringify(lot.flags),
        	templateValues: JSON.stringify(lot.templateValues)
        }
    };

	const post_body = {
        query: updateCard,
        operationName: 'UpdateCard',
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
	})

}