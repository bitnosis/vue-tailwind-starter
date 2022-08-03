/* eslint-disable no-useless-escape */
const murmur = require("murmurhash-js");

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

function generateBucketIds(experiment, users) {
  for (let i = 0; i < users.length; i++) {
    users[i].experimentId = experiment.id;
    users[i].experimentName = experiment.name;
    users[i].isInExperiment = true;
    // The main hashing algorithm to generate buckets is here!!....
    // Generate hash by concatenating userId with experimentId
    const hashValue = murmur.murmur3(users[i].id, experiment.id);
    // Then get the ratio
    const hashRatio = hashValue / Math.pow(2, 32);
    // Then use the ratio to divide up the buckets
    users[i].bucketId = parseInt(hashRatio * experiment.buckets, 10);
    experiment.users.push(users[i]);
  }

  return { theExperiment: experiment, theUsers: users };
}

function makeFake(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
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
      bucketId: null,
      isInExperiment: false,
      experimentName: null,
      experimentId: null
    };
    users.push(user);
  }

  return users;
}

module.exports = {
  sluggify,
  generateFakeUsers,
  makeFake,
  generateBucketIds,
  generateUUID,
  randomColor
};
