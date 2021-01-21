const simulationList = document.getElementsByClassName('simulation-item');
for (let simulation of simulationList) {
  const simulationId = simulation.getElementsByClassName('simulation-id')[0]
    .innerHTML;
  simulation.addEventListener(
    'click',
    () => (location.href = '/simulation?id=' + simulationId)
  );
}
