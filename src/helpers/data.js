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

const modalities = [
  "Medical doctor",
  "Naturopathic doctor",
  "Certified nutritionist",
  "Chiropractor",
  "Licensed acupuncturist",
  "Student",
  "Integrative practitioner",
  "Nurse practitioner",
  "Registered dietitian",
  "Registered midwife",
  "Registered nurse",
  "Registered pharmacist",
  "Other",
  "Osteopathic Physician"
];

const usage = ["heavy", "medium", "light", "rarely"];

const revenue = [
  { label: "under 20000", rangeEnd: 20000 },
  { label: "20000 - 40000", rangeEnd: 40000 },
  { label: "40000 - 100000", rangeEnd: 100000 },
  { label: "100000 - 500000", rangeEnd: 500000 },
  { label: "500k+", rangeEnd: 10000000 }
];

const patients = [
  { label: "1-10", rangeEnd: 10 },
  { label: "10-20", rangeEnd: 20 },
  { label: "20-50", rangeEnd: 50 },
  { label: "50-100", rangeEnd: 100 },
  { label: "100+", rangeEnd: 10000 }
];

module.exports = {
  newExperiment,
  modalities,
  usage,
  revenue,
  patients
};
