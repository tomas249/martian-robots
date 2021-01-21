const asyncHandler = require('../middleware/async');
const ErrorResponse = require('./errorResponse');
const fs = require('fs');
const path = require('path');

exports.fromText = (text) => {
  const lines = text.split(/\r\n|\r|\n/g);
  const boundary = lines[0].split(' ').map((c) => parseInt(c));
  return {
    boundary,
    expeditions: lines.slice(1),
  };
};

exports.fromFile = asyncHandler(async (filename) => {
  const filenamePath = path.join(__dirname, '..', 'instruction_files', filename);
  return new Promise((resolve, reject) => {
    fs.readFile(filenamePath, 'utf8', (err, file) => {
      if (err) reject(err);
      else resolve(this.fromText(file.trim()));
    });
  }).catch((_) => {
    throw new ErrorResponse(404, `File '${filename}' does not exist`);
  });
});
