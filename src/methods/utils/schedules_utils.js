import { TEMP_NEW_SCHEDULE_ID, DEFAULT_TASK_ID } from '../../constants/scheduler_constants';
import {timeString24HrToDate, uuidv4} from './utils';
import moment from 'moment';

const timeStringRegex = '^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$'
const timeStringRegex2 = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/
const timeStringRegex3 = /(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)$/

export function getScheduleItemTemplate() {

	let start_time = new Date();
	start_time.setSeconds(0);
	start_time.setHours(8);
	start_time.setMinutes(0);
	start_time = start_time.toTimeString().split(' ')[0];
	start_time = moment(timeString24HrToDate(start_time))
	// let start_time = '07:00:00';

	// let  = '00:15:00';
	let time_interval = new Date();
	time_interval.setSeconds(0);
	time_interval.setMinutes(15);
	time_interval.setHours(0);
	time_interval= time_interval.toTimeString().split(' ')[0];
	time_interval = moment(timeString24HrToDate(time_interval))


	let stop_time = new Date();
	stop_time.setSeconds(0);
	stop_time.setMinutes(0);
	stop_time.setHours(20);
	stop_time= stop_time.toTimeString().split(' ')[0];
	stop_time = moment(timeString24HrToDate(stop_time))
	// let stop_time ="8:00:00 PM";

	const id = uuidv4();

	return {
		id: id,
		_id: {
			$oid: id
		},
		task_id: DEFAULT_TASK_ID,
		days_on: [],
		interval_on: false,
		schedule_on: true,
		start_time: start_time,
		time_interval: time_interval,
		stop_time: stop_time,
		new: true,
		name: "",
		task: []
	}
}

export function getScheduleItemTemplate2(timeString) {
	return {
		id: uuidv4(),
		task_id: DEFAULT_TASK_ID,
		days_on: {
			friday: false,
			monday: false,
			saturday: false,
			sunday: false,
			thursday: false,
			tuesday: false,
			wednesday: false
		},
		interval_on: false,
		schedule_on: false,
		start_time: new Date().toTimeString().split(' ')[0],
		time_interval: new Date().toTimeString().split(' ')[0],
		label: ""
	};
}

export function formatScheduleItemOld(scheduleItem) {
	console.log('formatScheduleItem scheduleItem', scheduleItem)
	scheduleItem.id = scheduleItem._id.$oid;
	if(!scheduleItem.name) scheduleItem.name = "";
	if(!scheduleItem.label) scheduleItem.label = "";
	if(!scheduleItem.task_id) scheduleItem.task_id = "";



	const startTimeIsValid = timeStringRegex3.test(scheduleItem.start_time);
	if(!startTimeIsValid) {
		scheduleItem.start_time = "00:00:00";
		scheduleItem.start_time_label = "NOT SET";
	} else {
		scheduleItem.start_time_label = scheduleItem.start_time;
	}

	const timeIntervalIsValid = timeStringRegex3.test(scheduleItem.time_interval);
	if(!timeIntervalIsValid) {
		scheduleItem.time_interval = "00:00:00";
		scheduleItem.time_interval_label = "NOT SET";
	} else {
		scheduleItem.time_interval_label = scheduleItem.time_interval;
	}

	const stopTimeIsValid = timeStringRegex3.test(scheduleItem.stop_time);
	if(!stopTimeIsValid) {
		scheduleItem.stop_time = "00:00:00";
		scheduleItem.stop_time_label = "NOT SET";
	} else {
		scheduleItem.stop_time_label = scheduleItem.stop_time;
	}



	console.log('startTimeIsValid', startTimeIsValid)
	console.log('timeIntervalIsValid', timeIntervalIsValid)
	console.log('stopTimeIsValid', stopTimeIsValid)

	return scheduleItem;
}

export function formatScheduleItem(scheduleItem) {


	return scheduleItem;
}

/*
function isSchedule(arg: any): arg is Schedule {
	return arg && arg.prop && typeof(arg.prop) == 'number';
}
*/

export class Schedule_v2 {
	constructor(apiResponse){
		this.days_on = {
			friday: 'boolean',
			monday: 'boolean',
			saturday: 'boolean',
			sunday: 'boolean',
			thursday: 'boolean',
			tuesday: 'boolean',
			wednesday: 'boolean',
		};

		this.interval_on = 'boolean';
		this.name = 'string';
		this.precondition_id = 'string';
		this.schedule_on = 'boolean';
		this.start_time = 'string';
		this.time_interval = 'string';
	}
}

export class Schedule {
	constructor(apiResponse){
		let days_on = {
			friday: 'boolean',
			monday: 'boolean',
			saturday: 'boolean',
			sunday: 'boolean',
			thursday: 'boolean',
			tuesday: 'boolean',
			wednesday: 'boolean',
		};

		let interval_on = 'boolean';
		let name = 'string';
		let precondition_id = 'string';
		let schedule_on = 'boolean';
		let start_time = 'string';
		let time_interval = 'string';
	}
}

interface ScheduleInterface{
	days_on: {
		friday: string;
		monday: boolean;
		saturday: boolean;
		sunday: boolean;
		thursday: boolean;
		tuesday: boolean;
		wednesday: boolean;
	},
	interval_on: boolean;
	name: string;
	precondition_id: string;
	schedule_on: boolean;
	start_time: string;
	time_interval: string;
}
