const { MongoClient } = require("mongodb");
var fs = require('fs');
const bodyParser = require("body-parser")

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

//Return all documents in the database
app.get('/rest/list/', function(req, res) {
  var j = [];

  async function f1(){
    j = await getTickets();
    console.log("Contents of 'j' are...");
    console.log(j);
    res.send(j);
  }

  f1();
  
});

//Return object with matching ID
app.get('/rest/ticket/:id', function(req, res) {
  const search_id = req.params.id;
  var response;

  //Here we will find the requested document.
  const client = new MongoClient(uri);
  const database = client.db('415Tickets');
  const tickets = database.collection('Tickets');

  async function f1(){
    //Code is identical to finding all.
    //Except for the search term between brackets in the line below.
    console.log("Search term is: " + search_id);
    const q = { id:[search_id] };
    const sq = json.stringify(q);
    console.log("query is..." + sq);
    response = await tickets.findOne(q);
    await client.close();
    console.log("Response is...");
    console.log(response);
    res.send(response);
  }

  f1();
  
  /*
  console.log("Response is...");
  console.log(response);
  res.send(response);
  */
  
});

//Create a new ticket by sending a JSON file
app.post('/rest/ticket/', function(req, res) {
  var input = req.body;
  addTicket(input);
  res.json(input);
  
});



function addTicket(ticket){
  text = JSON.stringify(ticket);
  fs.appendFile('Tickets.json', text + "\n", function (err){
    if (err) throw err;
    console.log('Tickets.json appended to.');
  });
}

function getTickets(){
  //Array to hold tickets after retrival.
  var all_tickets = [];

  //Now using mongodb as data source.
  const client = new MongoClient(uri);

  //This will place all tickets in the collection into the array.
  const database = client.db('415Tickets');
  const tickets = database.collection('Tickets');


  async function f1(){
    //Find returns a 'cursor' object, from which data is accessed.
    //With no params, it should return everything.
    var cursor = tickets.find({});

    //forEach should run the listed function on each element returned.
    //console.log("Database Contents:");
    while(await cursor.hasNext()){
      var x = await cursor.tryNext();
      all_tickets[all_tickets.length] = x;
    }
    await client.close();
    return all_tickets;
  }

  return f1();

}



/* 

Old Mongo code retained as a reference.

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
