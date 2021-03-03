'use strict';

const fs = require('fs')

try {
  if (fs.existsSync('src/settings/config.js')) {

  }else{

    var writeStream = fs.createWriteStream('src/settings/config.js');
    writeStream.write("export default { authenticationNeeded: false, UserPoolId: '', ClientId: ''}");
    writeStream.end();

  }
} catch(err) {
  console.error(err)
}