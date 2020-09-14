const xmlrpc = require('xmlrpc')
 
// var doLog = false;
// var doSend = true;
var gripper_ip = '10.1.12.165'; // TODO Update depending on gripper IP address
var xmlrpc_port = '8101'; 

var client = xmlrpc.createClient({
    host: gripper_ip,
    port: xmlrpc_port,
    path: '/RPC2'
})

export const init = async(callback) => {
    var result = await client.methodCall('restart', [], function (error,value){
        if(error){
            return callback(error,null)
        }else {
            return callback(null,value)            
        }
    })      
}