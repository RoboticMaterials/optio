const xmlrpc = require('xmlrpc')
 
// var doLog = false;
// var doSend = true;
var gripper_ip = '10.1.12.165'; // TODO Update depending on gripper IP address
var xmlrpc_port = '8100'; 

var client = xmlrpc.createClient({
    host: gripper_ip,
    port: xmlrpc_port,
    path: '/RPC2'
})

// ======================================== //
//                                          //
//        CONNECTION COMMANDS               //
//                                          //
// ======================================== //



export const has_hand = async(callback) => {
    var result = await client.methodCall('has_hand',[], function (error, value){    
        return callback(value)
    })      
}

export const has_arm = async(callback) => {
    var result = await client.methodCall('has_arm',[], function (error,value){
        return callback(value)
    })      
}

export const has_cart = async(callback) => {
    var result = await client.methodCall('has_cart',[], function (error,value){
        return callback(value)
    })      
}

export const get_cart_waypoints = async(callback) => {
    var result = await client.methodCall('get_cart_waypoints', [], function (error,value){
        return callback(value)
    })      
}

export const get_cart_state = async(callback) => {
    var result = await client.methodCall('get_cart_state',[], function (error,value){
        return callback(value)
    })      
}

export const get_cart_status = async(callback) => {
    var result = await client.methodCall('get_cart_status',null, function (error,value){
        return callback(value)
    })      
}

export const move_cart = (waypoint_location,blocking) => {
    var request = client.methodCall('move_to_waypoint',[waypoint_location, blocking=false],function (error,value){
    }) 
}

export const pause_cart = (waypoint_location) => {
    var request = client.methodCall('pause_mission',[],function (error,value){
    }) 
}

export const clear_queue = (waypoint_location) => {
    var request = client.methodCall('clear_mission_queue',[],function (error,value){
    }) 
}

export const save_image = (origin_waypoint, destination_waypoint) => {
    var request = client.methodCall('save_cart_image',[origin_waypoint, destination_waypoint],function (error,value){
    })
}