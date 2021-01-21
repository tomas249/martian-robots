const express = require('express');
const router = express.Router();

// Controllers
const simulationsController = require('../controllers/simulations');

router.post('/start', simulationsController.start);

module.exports = router;