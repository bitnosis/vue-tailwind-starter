const newExperiment = {
  id: null,
  name: "New Experiment",
  buckets: 40,
  populationPercent: 100,
  users: [],
  treatmentGroups: [
    { id: null, name: "Control A", rangeEnd: 20, rules: [] },
    { id: null, name: "Control B", rangeEnd: 40, rules: [] }
  ],
  flipperName: "new-experiment"
};

module.exports = {
  newExperiment
};
