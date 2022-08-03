/* eslint-disable no-useless-escape */

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

function generateHashBuckets(experiment, users) {
  console.log(experiment);
  console.log(users);

  for (let i = 0; i < users.length; i++) {
    users[i].experiment = experiment;
  }

  return users;
  //murmur.murmur3(key, seed);
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

function generateUsers(userAmount) {
  const users = [];

  for (let i = 0; i < userAmount; i++) {
    const user = {
      id: generateUUID(),
      name: makeFake(6),
      bucketId: null,
      isInExperiment: false,
      experimentId: null
    };
    users.push(user);
  }

  return users;
}

module.exports = {
  sluggify,
  generateUsers,
  makeFake,
  generateHashBuckets,
  generateUUID
};
