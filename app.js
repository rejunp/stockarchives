//setup
const express = require('express');
//const bodyParser = require('body-parser');
const morgan = require('morgan');
const bodyParser = require('body-parser');    // pull information from HTML POST (express4)
const methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
const mongoose = require('mongoose');
const KEY = require("./key.config");
const stock = require('./routes/stock.route'); // Imports routes for the products
const app = express();
let port = 80;


//Config
app.use(express.static(__dirname + '/public'));            // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                    // log every request to the console
//app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use('/stocks', stock);
app.use(methodOverride());
app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});


console.log("Path --> "+__dirname);
// Set up mongoose connection
let dev_db_url = KEY.MONGODB_ATLAS_URI;
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', () => {
  console.log('connected to mongodb');
});
db.on('disconnected', () => {
  console.log('connection disconnected');
});
