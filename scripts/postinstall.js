const replace = require('replace-in-file');

const removeAllSideEffectsFalseFromReactSpringPackages = async () => {
	try {
		console.log("running removeAllSideEffectsFalseFromReactSpringPackages")
		const results = await replace({
			files: "node_modules/@react-spring/*/package.json",
			from: `"sideEffects": false`,
			to: `"sideEffects": true`
		});

		// console.log(results); // uncomment to log changed files
	} catch (e) {
		console.log('error while trying to remove string "sideEffects:false" from react-spring packages', e);
	}

}

removeAllSideEffectsFalseFromReactSpringPackages();

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