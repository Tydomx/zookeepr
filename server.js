// packages express
const express = require('express');
// setting environment variable 'process.env.PORT' use this port or default to 3001
const PORT = process.env.PORT || 3001;
// instantiate the server
const app = express();
const { animals } = require('./data/animals.json');


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


// adding the route 
app.get('/api/animals', (req, res) => {
    // this accesses the query property on req object
    let results = animals;
    // this calls filterByQuery function
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});