const router = require("express").Router();
const errorHandler = require('../middleware/error');

// Routes
const simulationsRoute = require('./simulations');

router.use('/simulations', simulationsRoute);

router.use(errorHandler);

router.use((req, res) => {
  res.send({
    success: true,
    data: req.data
  });
})


module.exports = router;
