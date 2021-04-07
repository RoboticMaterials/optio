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

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
	try {

		const taskQueueItem = JSON.parse(event.arguments.taskQueueItem)

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
			
			// Put the updated lot back in
			const lotParams = {
				TableName: tableNames.lots,
				Item: lot
				
			};

			await docClient.put(lotParams).promise();
		}	
		
		// put the taskQI in the taskQevents
		const taskQEventsParams = {
			TableName: tableNames.taskQueueEvents,
			Item: taskQueueItem
			
		};

		await docClient.put(taskQEventsParams).promise();
		
		// delete from the TQ
		const TQParams = {
			TableName: tableNames.taskQueue,
			Key: {
				'id': taskQueueItem.id
			}
		};

		await docClient.delete(TQParams).promise();
	
	} catch (e) {
		console.log(e)
	}


    return null;
};