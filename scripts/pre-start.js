'use strict';

const fs = require('fs')

try {
  if (fs.existsSync('src/settings/config.js')) {

  }else{

    var writeStream = fs.createWriteStream('src/settings/config.js');
    writeStream.write("export default { authenticationNeeded: false, Region: '', UserPoolId: '', ClientId: ''}");
    writeStream.end();

  }
} catch(err) {
  console.error(err)
}

// Adding a random serial number into the database which will trigger the clients to 
// update automatically
var MongoClient = require('mongodb').MongoClient;
const { v4 : uuidv4} = require('uuid')

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const database = client.db("ContactDB"); //client.db("sample_mflix");
    const settings = database.collection("settings");
       
        const result = await settings.updateOne({},{$set: {currentVersion : uuidv4()}});
        console.log(`Updated random serial number, result: ${result.matchedCount}`);
        } finally {
        await client.close();
        }
    }
    run().catch(console.dir);
