const router = require('express').Router();
const errorHandler = require('../middleware/error');

const {
  getSimulations,
  getSimulationById,
} = require('../controllers/simulations');

router.use((req, res, next) => {
  req.data = {};
  next();
});
router.get('/', getSimulations, async (req, res) => {
  res.render('index', {
    data: req.data,
    query: req.query,
  });
});

router.get('/simulation', getSimulationById, (req, res) => {
  res.render('simulation', { data: req.data });
});

router.use(errorHandler);

module.exports = router;
