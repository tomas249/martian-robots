const ErrorResponse = require('./errorResponse');

const createMatrix = ([x, y], fill) =>
  Array(y + 1)
    .fill(null)
    .map(() => Array(x + 1).fill(fill));

const getCoordFromMatrix = (matrix, exclude) =>
  matrix.reduce(
    (coord, row, y) =>
      coord.concat(row.map((v, x) => v && [x, y]).filter((v) => v !== exclude)),
    []
  );

const mergeMatrix = (...matrices) => {
  const size = [matrices[0][0].length - 1, matrices[0].length - 1];
  const baseM = createMatrix(size, 0);
  const restM = matrices;

  for (let y = 0; y < baseM.length; y++) {
    for (let x = 0; x < baseM[0].length; x++) {
      baseM[y][x] += restM.reduce((acc, v) => acc + v[y][x], 0);
    }
  }
  return baseM;
};

const generateMatrixInfo = (matrix, exclude) => {
  const coordinates = getCoordFromMatrix(matrix, exclude);
  return {
    matrix,
    coordinates,
    count: coordinates.length,
    size: matrix[0].length,
  };
};

exports.getDestination = (boundary, spawnPosition, instructions, scentMatrix) => {
  const getCoord = ([x, y], orientation) =>
    ({
      N: (_) => [x, y + 1],
      S: (_) => [x, y - 1],
      E: (_) => [x + 1, y],
      W: (_) => [x - 1, y],
    }[orientation]());

  const getDirection = (currOrientation, instruction) => {
    const orientations = ['W', 'N', 'E', 'S', 'W', 'N'];
    const currIdx = orientations.slice(1, -1).indexOf(currOrientation);
    if (currIdx === -1)
      throw new ErrorResponse(
        400,
        `Orientation '${instruction}' is invalid. Use N-E-S-W.`
      );
    const nextIdx = currIdx + { L: -1, R: 1 }[instruction] + 1; // +1 bcs of 'W' & 'N' in orientations
    return orientations[nextIdx];
  };

  const checkIsLost = (coordinates, boundary) => {
    const [x, y] = coordinates;
    const [xLim, yLim] = boundary;
    const isLost = x < 0 || x > xLim || y < 0 || y > yLim;
    return isLost;
  };

  const checkHasScent = ([x, y]) => {
    let hasScent = false;
    if (scentMatrix[y][x]) {
      hasScent = true;
    } else {
      scentMatrix[y][x] = true;
    }
    return hasScent;
  };

  position = spawnPosition.split(' ');
  const coordinates = position.slice(0, 2).map((c) => parseInt(c));
  const orientation = position[2];

  let exploredSurface = createMatrix(boundary, 0);
  exploredSurface[coordinates[1]][coordinates[0]] += 1;

  let currPos = { coordinates, orientation, isLost: false };
  instructions = instructions.split('');

  if (instructions.length > process.env.MAX_INSTRUCTIONS)
    throw new ErrorResponse(400, 'Max instructions length was exceeded');

  instructions.forEach((instruction, i) => {
    if (currPos.isLost) return;
    if (['L', 'R'].includes(instruction)) {
      // Only rotate
      currPos.orientation = getDirection(currPos.orientation, instruction);
    } else if ('F' === instruction) {
      // Only move
      // Check if the movement is out of the map
      const nextCoord = getCoord(currPos.coordinates, currPos.orientation);
      const isLost = checkIsLost(nextCoord, boundary);
      const hasScent = isLost && checkHasScent(currPos.coordinates);

      if (isLost && !hasScent) currPos.isLost = true;
      if (!isLost) {
        exploredSurface[nextCoord[1]][nextCoord[0]] += 1;
        currPos.coordinates = nextCoord;
      }
    } else {
      throw new ErrorResponse(400, `Instruction '${instruction}' is invalid. Use L-R-F.`);
    }
  });

  // Console OUTPUT
  console.log(
    currPos.coordinates
      .concat(currPos.orientation)
      .concat(currPos.isLost && 'LOST')
      .filter((v) => v)
      .join(' ')
  );

  return {
    spawnPosition: { coordinates, orientation },
    destinationPosition: {
      coordinates: currPos.coordinates,
      orientation: currPos.orientation,
    },
    exploredSurface: generateMatrixInfo(exploredSurface, 0),
    // Generate copy bcs scentMatrix is passed by reference
    scentSurface: generateMatrixInfo([...scentMatrix.map((r) => [...r])], false),
    instructions,
    isLost: currPos.isLost,
  };
};

exports.initiate = ({ boundary, expeditions }) => {
  if (boundary.some((c) => c > process.env.MAX_COORDINATE))
    throw new ErrorResponse(400, 'Max coordinate was exceeded');

  let scentMatrix = createMatrix(boundary, false);
  let expeditionsData = [];

  for (let i = 0; i < expeditions.length; i += 2) {
    const position = expeditions[i];
    const instructions = expeditions[i + 1];
    const expeditionData = this.getDestination(
      boundary,
      position,
      instructions,
      scentMatrix
    );
    expeditionsData.push(expeditionData);
  }

  const exploredSurfaceMatrix = mergeMatrix(
    ...expeditionsData.map((e) => e.exploredSurface.matrix)
  );
  return {
    boundary,
    expeditionsCount: expeditionsData.length,
    lostRobotsCount: expeditionsData.filter((e) => e.isLost).length,
    exploredSurface: generateMatrixInfo(exploredSurfaceMatrix, 0),
    scentSurface: expeditionsData.slice(-1)[0].scentSurface,
    expeditions: expeditionsData,
  };
};
