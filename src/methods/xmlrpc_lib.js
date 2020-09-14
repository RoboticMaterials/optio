var xmlrpc = require('xmlrpc')
var response = null;

window.XmlRpcClient = function(_hostName, _port) {
  this.client = xmlrpc.createClient({host: _hostName, port: _port}); 
}
window.XmlRpcClient.prototype.send = async function(_request) {
  var response = await this.client.methodCall(_request.method, _request.params, async function(_error, _response) {
    if (_error) {
        console.error('ERROR:' + '/n __method__: ' + _request.method + '\n __error__: ' + _error);
    }
    response = _response;
  });
    
  var start = Date.now();
  await wait_for(function() {return response != null || Date.now()-start > 3000;});
  var response_filled = response;
  response = null;
  return response_filled;
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function wait_for(_conditional_function) {
    while (!_conditional_function()) {
        await sleep(10);
    }
    return;
}

window.XmlRpcRequest = function(_method) {
  this.method = _method;
  this.params = [];
}
window.XmlRpcRequest.prototype.addParam = function(_param) {
  this.params.push(_param);
}


// browserify xmlrpc_lib.js -o bundle.js
