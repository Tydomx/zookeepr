const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');
const router = require('express').Router();

// adding the GET route 
router.get('/animals', (req, res) => {
    // this accesses the query property on req object
    let results = animals;
    // this calls filterByQuery function
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// new GET param route that uses ':id' 
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// defining a route that listens to POST requests, not GET requests.
// POST requests different from GET requests in that they rep action of client requesting server to accept data rather than vice versa
router.post('/animals', (req, res) => {
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


module.exports = router;
