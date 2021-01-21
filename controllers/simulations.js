const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const simulation = require('../utils/simulation');
const Simulation = require('../models/Simulation');
const formatExpeditionData = require('../utils/formatExpeditionData');

exports.start = asyncHandler(async (req, res, next) => {
  let simulationData = req.body.expeditionData.trim();
  if (!simulationData)
    throw new ErrorResponse(400, 'Select a file with instructions or introduce some');

  // Check if it is a file or are instructions
  const filenameMatch = simulationData.match('[-a-zA-z0-9_]+.txt');
  simulationData = filenameMatch
    ? await formatExpeditionData.fromFile(filenameMatch[0])
    : formatExpeditionData.fromText(simulationData);

  simulationData = simulation.initiate(simulationData);

  const simulationDB = await Simulation.create(simulationData);

  res.redirect(`/simulation?id=${simulationDB._id}`);
});

exports.getSimulations = asyncHandler(async (req, res, next) => {
  const simulations = await Simulation.find({}).select(
    'boundary expeditionsCount lostRobotsCount'
  );
  req.data.simulationsList = simulations;
  next();
});

exports.getSimulationById = asyncHandler(async (req, res, next) => {
  const simulationId = req.query.id;
  if (!simulationId) throw new ErrorResponse(400, 'Introduce a simulation Id');

  const simulation = await Simulation.findById(simulationId);
  if (!simulation)
    throw new ErrorResponse(404, `Simulation with Id '${simulationId}' was not found`);

  req.data.simulation = simulation;
  next();
});
