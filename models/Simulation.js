const mongoose = require('mongoose');

const SimulationSchema = new mongoose.Schema({
  boundary: [Number, Number],
  expeditionsCount: Number,
  lostRobotsCount: Number,
  exploredSurface: {
    matrix: Array,
    coordinates: [[Number, Number]],
    count: Number,
    size: Number
  },
  scentSurface: {
    matrix: Array,
    coordinates: [[Number, Number]],
    count: Number,
    size: Number
  },
  expeditions: [{
    spawnPosition: {
      coordinates: [Number, Number],
      orientation: {
        type: String,
        enum: ['N', 'E', 'S', 'W']
      }
    },
    destinationPosition: {
      coordinates: [Number, Number],
      orientation: {
        type: String,
        enum: ['N', 'E', 'S', 'W']
      }
    },
    isLost: {
      type: Boolean,
      default: false
    },
    instructions: Array,
    exploredSurface: {
      matrix: Array,
      coordinates: [[Number, Number]],
      count: Number,
      size: Number
    },
    scentSurface: {
      matrix: Array,
      coordinates: [[Number, Number]],
      count: Number,
      size: Number
    }
  }]
});

module.exports = mongoose.model('Simulation', SimulationSchema);