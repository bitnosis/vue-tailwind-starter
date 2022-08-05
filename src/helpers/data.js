const newVariant = {
  id: null,
  name: "Control A",
  description: "We show the user the default display, when in this group",
  populationAllocation: 50,
  bucketRange: { start: 0, end: 20 },
  buckets: [],
  mixPanelEvent: "some-event-to-fire-on-mixpanel",
  rules: []
};

const newExperiment = {
  id: null,
  name: "New Experiment",
  hypothesis:
    "This is where you put the hypothesis for this particular experiment",
  populationAllocation: 10,
  status: "inactive",
  isExclusive: false,
  mixPanelExperimentToken: "some-mixpanel-project-token",
  variantGroups: [
    {
      id: null,
      name: "Control A",
      description: "We show the user the default display, when in this group",
      populationAllocation: 50,
      bucketRange: { start: 0, end: 20 },
      buckets: [],
      mixPanelEvent: "some-event-to-fire-on-mixpanel",
      rules: []
    },
    {
      id: null,
      name: "Control B",
      description:
        "We show the user X display, when in this group, we tracking such and such",
      populationAllocation: 50,
      bucketRange: { start: 21, end: 40 },
      buckets: [],
      mixPanelEvent: "some-event-to-fire-on-mixpanel",
      rules: []
    }
  ]
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
  newVariant,
  modalities,
  usage,
  revenue,
  patients
};
