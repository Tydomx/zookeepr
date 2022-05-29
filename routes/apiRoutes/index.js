const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');
const zookeeperRoutes = require('../apiRoutes/zookeeperRoutes');
// becomes central hub for all routing functions we may want to add to application
// as more things get added, it becomes efficient mechanism for managing routing code and keeping it modularized

router.use(zookeeperRoutes);
router.use(animalRoutes);

module.exports = router;