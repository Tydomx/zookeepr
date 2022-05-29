// packages express
const express = require('express');
const fs = require('fs');
// provides utilities for working w file and directory paths
const path = require('path');
const { animals } = require('./data/animals.json');
// mechanism works same way as directory navigatino does in a website
// if navigate to director that doesn't have index.html file, then contents are displayed in a directory listing
// otherwise it is read and its HTML is displayed instead
// default file is index.js if no other file is provided
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// setting environment variable 'process.env.PORT' use this port or default to 3001
const PORT = process.env.PORT || 3001;
// instantiate the server
const app = express();

// parse incoming string or array data (built-in express method - taking incoming POST data and converts it to key/value pairings that can be accessed in req.body)
// extended:true - informs our server that there may be sub-array data nested in it as well, so it needs to look as deep into POST data as possible to parse all data correctly
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data - (takes incoming POST data in form of JSON and prases it into the req.body)
app.use(express.json());
// both middleware functions need to be set up every time you create a server that's looking for POST data
app.use(express.static('public'));
// tells server that any time a client navigates to <ourhost>/api, app will use router we set up in apiRoutes
// if / is endpoint, then router will serve back our HTML routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);







app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

