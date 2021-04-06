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
	const orgId = event.arguments.organizationId

    let taskParams = {
        TableName: tableNames.taskQueueEvents,
        Key: {
            'organizationId': orgId
        }
    };

    let tasks = await docClient.scan(taskParams).promise();
	tasks = tasks.Items

	let calculatedTasks = []

	let ids = []

	tasks.forEach(task => {
		ids.push(task.task_id)
	});

	let uniqueChars = [...new Set(ids)]

	for (const id of uniqueChars) {

		taskParams = {
			TableName: tableNames.taskQueueEvents,
			Key: {
				'id': id
			}
		};
	
		tasks = await docClient.scan(taskParams).promise();

		let stats,
			items = tasks.Items,
			num_of_items = items.length,
			time_sum = 0,
			success_count = 0,
			fail_count = 0
	
		items.forEach(task => {

			let ex_time = task['end_time'] - task['start_time']
			
			time_sum += ex_time
	
			if(task['success']){
				success_count++
			}else{
				fail_count++
			}
		});
	
		let time_avg = time_sum/num_of_items
	
		stats = {
					// 'task_name' : items[0]['task_name'],
					'task_id' : items[0]['task_id'],
					'times_run' : num_of_items, 
					'avg_run_time' : Math.round(time_avg),
					'successes' : success_count,
					'failures' : fail_count,
				}

		calculatedTasks.push(stats)
	}

	return { 
		id: '1',
		organizationId: '1',
		device_type: '1',
		task_id: '1',
		_id: 'not_an_ID',
		custom_task: calculatedTasks 
	}
};