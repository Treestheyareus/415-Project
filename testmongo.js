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
  var outstring = outstring + "Get Tickets with GET '/rest/list'";
  var outstring = outstring + "<br> Get One Ticket with GET '/rest/ticket/:id'";
  var outstring = outstring + "<br> Add a Ticket by sending JSON to POST '/rest/ticket'";
  var outstring = outstring + "<br> Delete a Ticket by DELETE '/rest/ticket/:id'";
  var outstring = outstring + "<br> Update a Ticket by PUT '/rest/ticket/:id' with JSON";
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
    const q = { id:parseInt(search_id) };
    const sq = JSON.stringify(q);
    console.log("query is..." + sq);
    response = await tickets.findOne(q);
    await client.close();
    console.log("Response is...");
    console.log(response);
    if(response == null){
      res.send("No results.");
    }
    res.send(response);
  }

  f1();
  
});

//Create a new ticket by sending a JSON file
app.post('/rest/ticket/', function(req, res) {  

  async function f1(){
    //Setup
    var input = req.body;
    const client = new MongoClient(uri);
    const database = client.db('415Tickets');
    const tickets = database.collection('Tickets');

    //Can we add it?
    const newID = input.id;
    console.log("Attempting to add ticket with id:" + newID);
    const q = { id:parseInt(newID) };
    dupe = await tickets.findOne(q);
    if (dupe == null){
      console.log("id:" + newID + " is ok to add.");
    }

    else{
      res.send("There is already a ticket with that id.")
    }
    
    //Insert it
    const result = await tickets.insertOne(input);

    //finally...
    await client.close();
    res.json(input);
  }

  f1();

});

app.delete('/rest/ticket/:id', function(req, res){
  //Delete a ticket.

  async function f1(){
    //Store ID to find targets.
    const search_id = req.params.id;

    //Setup
    const client = new MongoClient(uri);
    const database = client.db('415Tickets');
    const tickets = database.collection('Tickets');

    //Delete it
    const q = { id:parseInt(search_id) };
    const result = await tickets.deleteMany(q);
    console.log("Deleted " + result.deletedCount + " tickets.");

    //Finally
    await client.close();
    res.send("Deleted " + result.deletedCount + " tickets.");
  }

  f1();
  
});

app.put('/rest/ticket/:id', function(req, res){
  //Update a ticket.

  async function f1(){
    //Store ID to find targets.
    const search_id = req.params.id;
    const b = req.body;
    const document = { $set: { b } };

    //Setup
    const client = new MongoClient(uri);
    const database = client.db('415Tickets');
    const tickets = database.collection('Tickets');

    //Update it
    const filter = { id:parseInt(search_id) };
    const result = await tickets.updateOne(filter, document);
    console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);

    //Finally
    await client.close();
    res.send(result.matchedCount + " documents matched. <br>" + result.modifiedCount + " documents were modified.");
  }

  f1();

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
