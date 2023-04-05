const { MongoClient } = require("mongodb");

// The uri string must be the connection string for the database (obtained on Atlas).
const uri = "mongodb+srv://mills415wrany:D88whBQ9NYyYgcS@cmps415.gt9j9mr.mongodb.net/?retryWrites=true&w=majority";

// --- This is the standard stuff to get it to work on the browser
const express = require('express');
const app = express();
const port = 3000;
app.listen(port);
console.log('Server started at http://localhost:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes will go here

// Default route:
app.get('/', function(req, res) {
  const myquery = req.query;
  var outstring = "<h1>Welcome</h1>;
  res.send(outstring);
});

//Return all JSON objects in memory.
app.get('/rest/list/', function(req, res) {
  res.send(tickets);
});


/*

  //Return object with matching ID
  app.get('/rest/ticket/id/', function(req, res) {});

*/

/*

  //Create a new ticket by sending a JSON file
  app.post('/rest/ticket/', function(req, res) {});

*/

// Here we store the basic JSON bits into memory using an array of JSON objects.

var tickets = []
tickets[0] = {
"id": 35436,
"created_at": "2015-07-20T22:55:29Z",
"updated_at": "2016-05-05T10:38:52Z",
"type": "incident",
"subject": "MFP not working right",
"description": "PC Load Letter? What does that even mean???",
"priority": "med",
"status": "open",
"recipient": "support_example@selu.edu",
"submitter": "Michael_bolton@selu.edu",
"assignee_id": 235323,
"follower_ids": [235323, 234],
"tags": ["enterprise", "printers"],
}

/* 
Currently Unneeded Mongo Stuff

Route to access database:

app.get('/api/mongo/:item', function(req, res) {
const client = new MongoClient(uri);
const searchKey = "{ partID: '" + req.params.item + "' }";
console.log("Looking for: " + searchKey);

async function run() {
  try {
    const database = client.db('CMPS415');
    const parts = database.collection('415Parts');

    // Hardwired Query for a part that has partID '12345'
    // const query = { partID: '12345' };
    // But we will use the parameter provided with the route
    const query = { partID: req.params.item };

    const part = await parts.findOne(query);
    console.log(part);
    res.send('Found this: ' + JSON.stringify(part));  //Use stringify to print a json

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
});

*/
