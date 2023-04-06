const { MongoClient } = require("mongodb");
var fs = require('fs');

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
  var outstring = "<h1>Welcome</h1>";
  var outstring = outstring + "Get Tickets with '/rest/list'";
  var outstring = outstring + "<br> Get One Ticket with '/rest/ticket/:id'";
  var outstring = outstring + "<br> Add a Ticket by sending JSON to '/rest/ticket'";
  res.send(outstring);
});

//Return all JSON objects in memory.
app.get('/rest/list/', function(req, res) {
  j = getTickets();
  console.log(j);
  res.send("Check the logs.");
});

//Return object with matching ID
/* app.get('/rest/ticket/:id', function(req, res) {
  const search_id = req.params.id;
  var response = []
  for (let i = 0; i < tickets.length; i++) {
    if (tickets[i].id == search_id) {
        response[response.length] = tickets[i];
    }
  }
  
  res.send(response);
  
}); */


/*

  //Create a new ticket by sending a JSON file
  app.post('/rest/ticket/', function(req, res) {});

*/

// Here we store our example JSON into the file.
addTicket({
"id": 1,
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
});
addTicket({
"id": 2,
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
});
addTicket({
"id": 3,
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
});


function addTicket(ticket){
  text = JSON.stringify(ticket);
  console.log('Stringified JSON:')
  console.log(text)
  fs.appendFile('Tickets.json', text, function (err){
    if (err) throw err;
    console.log('Tickets.json appended.')
  });
}

function getTickets(){
  var filecontent;
  //Populate from the file.
  fs.readFile('Tickets.json', function(err, data){
    filecontent = data;
    console.log("File contents read:")
    console.log(data)
  });
  //Process with JSON.parse
  j = JSON.parse(filecontent);
  return j;
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
