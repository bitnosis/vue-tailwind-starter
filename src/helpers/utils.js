/* eslint-disable no-useless-escape */
const murmur = require("murmurhash-js");

const modalities = [
  { name: "Medical doctor", prob: 0.1 },
  { name: "Naturopathic doctor", prob: 0.3 },
  { name: "Certified nutritionist", prob: 0.1 },
  { name: "Chiropractor", prob: 0.1 },
  { name: "Licensed acupuncturist", prob: 0.2 },
  { name: "Student", prob: 0.2 },
  { name: "Integrative practitioner", prob: 0.4 },
  { name: "Nurse practitioner", prob: 0.2 },
  { name: "Registered dietitian", prob: 0.1 },
  { name: "Registered midwife", prob: 0.1 },
  { name: "Registered nurse", prob: 0.2 },
  { name: "Registered pharmacist", prob: 0.1 },
  { name: "Other", prob: 0.2 },
  { name: "Osteopathic Physician", prob: 0.1 }
];

const usage = ["heavy", "medium", "light", "rarely"];

function makeFake(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function weighted_random(options) {
  let i;
  const weights = [];
  for (i = 0; i < options.length; i++) {
    weights[i] = options[i].prob + (weights[i - 1] || 0);
  }

  const random = Math.random() * weights[weights.length - 1];

  for (i = 0; i < weights.length; i++) {
    if (weights[i] > random) {
      break;
    }
  }

  return options[i].name;
}

function randomFromArray(array) {
  const r = Math.floor(Math.random() * array.length);

  return array[r];
}

function generateUUID() {
  let result, i, j;
  result = "";
  for (j = 0; j < 32; j++) {
    if (j === 8 || j === 12 || j === 16 || j === 20) {
      result = result + "-";
    }
    i = Math.floor(Math.random() * 16)
      .toString(16)
      .toUpperCase();
    result = result + i;
  }

  return result;
}

function generateFakeUsers(userAmount) {
  const users = [];

  for (let i = 0; i < userAmount; i++) {
    const user = {
      id: generateUUID(),
      name: makeFake(6),
      modality: weighted_random(modalities),
      usage: randomFromArray(usage),
      revenue: Math.floor(Math.random() * 600000),
      patient_count: Math.floor(Math.random() * 100),
      bucketId: null,
      isInExperiment: false,
      experimentName: null,
      experimentId: null
    };
    users.push(user);
  }

  return users;
}

function sluggify(string) {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

// MAIN HASHING FUNCTION - This is the money right here lol  :)  //
function generateBucketIds(experiment, users) {
  const userPopulation = parseInt(
    users.length * (experiment.populationPercent / 100)
  );
  for (let i = 0; i < userPopulation; i++) {
    users[i].experimentId = experiment.id;
    users[i].experimentName = experiment.name;
    users[i].isInExperiment = true;
    /////////////////////////////////////////////////////////////
    // The main hashing algorithm to generate buckets is here!!!!
    //////////////////////////////////////////////////////////////
    // Generate hash by concatenating userId with experimentId - using murmurV3 algorithm. (best choice)
    const hashValue = murmur.murmur3(users[i].id, experiment.id);
    // Then get the ratio by dividing by the largest number
    const hashRatio = hashValue / Math.pow(2, 32);
    // Then use the ratio to divide up the buckets randomly
    users[i].bucketId = parseInt(hashRatio * experiment.buckets, 10);
    experiment.users.push(users[i]);
  }

  return { theExperiment: experiment, theUsers: users };
}

module.exports = {
  sluggify,
  generateFakeUsers,
  makeFake,
  generateBucketIds,
  generateUUID,
  randomColor
};
