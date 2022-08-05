/* eslint-disable no-useless-escape */
const murmur = require("murmurhash-js");

// This generates a Bucket # for a user.
// This is for a static bucketing system
////////////////////////////////////////
// In this example there are...
// 500 Static buckets
// 5000 Demo users
// = 10 users in a bucket
// -------
// We can run this once, and record the bucketNumber onto the user table, just once.
function getUserBucket(userId) {
  const bucketSeed = "The Bucketing Seed";
  const numberOfBucketsInSystem = 500;
  // Generate hash for user with the bucketSeed
  const hashValue = murmur.murmur3(userId, bucketSeed);
  // Then get the ratio by dividing by the largest number
  const hashRatio = hashValue / Math.pow(2, 32);

  // Then use the ratio to divide up the buckets randomly
  // RETURN THE BUCKET NUMBER FOR THIS USER
  return parseInt(hashRatio * numberOfBucketsInSystem, 10);
}

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
    const userId = generateUUID();
    const bucketId = getUserBucket(userId);
    const user = {
      id: userId,
      name: makeFake(6),
      modality: weighted_random(modalities),
      usage: randomFromArray(usage),
      revenue: Math.floor(Math.random() * 600000),
      patient_count: Math.floor(Math.random() * 100),
      bucketId
    };
    users.push(user);
  }

  return users;
}

function generateBuckets(bucketCount) {
  const buckets = [];
  for (let i = 0; i < bucketCount; i++) {
    const bucketIndex = i + 1;
    const data = {
      bucketNumber: bucketIndex,
      isInExperiment: false,
      isInExclusiveExperiment: false
    };

    buckets.push(data);
  }

  return buckets;
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
  const user_list = users;
  const g = experiment.treatmentGroups;
  /*
  for (let i = 0; i < g.length; i++) {
    if (g[i].rules !== "" && g[i].rules != null) {
      const rules = JSON.parse(g[i].rules);
      if (rules.length > 0) {
        for (let j = 0; j < rules.length; j++) {
          switch (rules[j].type) {
            case "modality":
              for (let k = 0; k < users.length; k++) {
                if (
                  users[k].modality.toLowerCase() ===
                  rules[j].value.toLowerCase()
                ) {
                  const index = user_list.indexOf(users[k]);
                  if (index < 1) {
                    user_list.push(users[k]);
                  }
                }
              }
              break;
            case "revenue":
              break;
            case "patient_count":
              break;
          }
        }
      }
    } else {
      user_list = users;
    }
  }*/

  const userPopulation = parseInt(
    user_list.length * (experiment.populationPercent / 100)
  );
  for (let i = 0; i < userPopulation; i++) {
    user_list[i].experimentId = experiment.id;
    user_list[i].experimentName = experiment.name;
    user_list[i].isInExperiment = true;
    /////////////////////////////////////////////////////////////
    // The main hashing algorithm to generate buckets is here!!!!
    //////////////////////////////////////////////////////////////
    // Generate hash by concatenating userId with experimentId - using murmurV3 algorithm. (best choice)
    const hashValue = murmur.murmur3(user_list[i].id, experiment.id);
    // Then get the ratio by dividing by the largest number
    const hashRatio = hashValue / Math.pow(2, 32);
    // Then use the ratio to divide up the buckets randomly
    user_list[i].bucketId = parseInt(hashRatio * experiment.buckets, 10);
    experiment.users.push(user_list[i]);
  }

  return { theExperiment: experiment, theUsers: users };
}

module.exports = {
  sluggify,
  generateFakeUsers,
  makeFake,
  generateBucketIds,
  generateUUID,
  randomColor,
  getUserBucket,
  generateBuckets
};
