const express = require('express')
const cowsay = require('cowsay')
const cors = require('cors')
// Create the server
const app = express()
var MongoClient = require('mongodb').MongoClient;
// Serve our api route /cow that returns a custom talking text cow

const dburl = "mongodb+srv://aabb15768:lf2csgod10@cluster0-aasc5.gcp.mongodb.net/test?retryWrites=true&w=majority";
const dbname = 'mydatabase';
const collname = 'customers';
app.use(cors());

const path = require('path')
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')))
// Anything that doesn't match the above, send back index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/client/build/index.html'))
// })

app.get('/api/getData/', cors(), async (req, res, next) => {
  try {
    MongoClient.connect(dburl, function(err, client) {
      if (!err) {
          const db = client.db(dbname);

          // get collection
          const collection = db.collection(collname);
          // find all documents in the collection and send to front end
          collection.find({}).toArray(function(err, x) {
              if (!err) {
                  var output = x;
                  res.send(output);
              }
          });
          client.close();
      }
  });
  } catch (err) {
    next(err)
  }
})

// app.get('/api/getData', function(req, res) {
//   // connect to DB
//   MongoClient.connect(dburl, function(err, client) {
//       if (!err) {
//           const db = client.db(dbname);

//           // get collection
//           const collection = db.collection(collname);
//           // find all documents in the collection and send to front end
//           collection.find({}).toArray(function(err, x) {
//               if (!err) {
//                   var output = x;
//                   res.send(output);
//               }
//           });
//           client.close();
//       }
//   });
// });


// Choose the port and start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})