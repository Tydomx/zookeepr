// packages express
const express = require('express');
const fs = require('fs');
// provides utilities for working w file and directory paths
const path = require('path');
const { animals } = require('./data/animals.json');

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



// function to handle different types of queries, handling filter functionality and creating its own function
// function that takes in req.query as argument and filters through animals accordingly, returning new filtered array
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // save personalityTraits as a dedicated array
        // if personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // loop through each trait in personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // check the trait against each animal in the filteredResults array.
            // remember, it's initially a copy of animalsArray
            // but here we're updating it for each triat in the .forEach() loop.
            // for each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait, 
            // so at the end we'll have an array of animals that have every one
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1);
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

// function that accepts POST route's req.body value and array we want to add data to.
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    // when we POST new animal, we'll add it to imported 'animals' array from JSON file
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    // return finished code to post route for response
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

// adding the GET route 
app.get('/api/animals', (req, res) => {
    // this accesses the query property on req object
    let results = animals;
    // this calls filterByQuery function
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// new GET param route that uses ':id' 
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// defining a route that listens to POST requests, not GET requests.
// POST requests different from GET requests in that they rep action of client requesting server to accept data rather than vice versa
app.post('/api/animals', (req, res) => {
    // set id based on what next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);

        res.json(animal);
    }
});

// index.html route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// animals.html route
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// zookeeper.html route
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// wildcard route (catch route just in case)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

