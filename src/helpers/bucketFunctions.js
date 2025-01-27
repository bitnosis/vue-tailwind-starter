/* eslint-disable no-useless-escape */
const murmur = require("murmurhash-js");
const NUMBER_OF_STATIC_BUCKETS = 350;
const BUCKET_SEED = "One Time Bucket Seed";
const USER_COUNT = 1000;

// getUserBucket(userId) generates a Bucket # for a user.
// This is for the static bucketing system
////////////////////////////////////////
// In this example there are...
// 500 Static buckets
// 5000 Demo users
// = 10 users in a bucket
// -------
// We can run this once, and record the bucketNumber onto the user table, just once.
// Or the algorithm can run per request,
function getUserBucket(userId, bucketSeed = null, staticBuckets = null) {
  if (bucketSeed == null) {
    bucketSeed = BUCKET_SEED;
  }
  if (staticBuckets == null) {
    staticBuckets = NUMBER_OF_STATIC_BUCKETS;
  }
  // Generate hash for user with the bucketSeed
  const hashValue = murmur.murmur3(userId, bucketSeed);
  // Then get the ratio by dividing by the largest number
  const hashRatio = hashValue / Math.pow(2, 32);
  // Then use the ratio to divide up the buckets randomly
  const bucketNumberForUser = parseInt(hashRatio * staticBuckets, 10);

  // RETURN THE BUCKET NUMBER FOR THIS USER
  return bucketNumberForUser;
}

function recalculateVariantAllocation(experiment, totalUsers) {
  const popData = getExperimentPopulationData(experiment, totalUsers);
  const count = experiment.variantGroups.length;
  let startingBucketRange = -1;
  // Recaulate the allocation % to equal 100
  experiment.variantGroups.forEach((vg, index) => {
    vg.populationAllocation = (100 / count).toFixed(0);
    const bucketCount = parseInt(
      popData.bucketCount * (vg.populationAllocation / 100)
    );
    vg.bucketRange.start = startingBucketRange += 1;
    vg.bucketRange.end = startingBucketRange += bucketCount;
  });

  return experiment;
}

function averageUsersPerBucket(userCount, bucketCount) {
  if (bucketCount == null) {
    bucketCount = NUMBER_OF_STATIC_BUCKETS;
  }

  return userCount / bucketCount;
}

// This just return the count of the users that will be affected by this experiment
// userCount = count of users in experiment
// bucketCount = count of buckets returned by experiment
function getExperimentPopulationData(experiment, totalUserCount) {
  let bucketBlock = null;
  const usersInExperiment =
    totalUserCount * (experiment.populationAllocation / 100);
  const buckets = usersInExperiment / averageUsersPerBucket(totalUserCount);
  if (experiment.variantGroups.length > 0) {
    bucketBlock = {
      start: experiment.variantGroups[0].bucketRange.start,
      end:
        experiment.variantGroups[experiment.variantGroups.length - 1]
          .bucketRange.end
    };
  }

  return {
    userCount: usersInExperiment,
    bucketCount: parseInt(buckets),
    bucketBlock
  };
}

// Finds the next available block of buckets to use.
function findNextAvailableBucket(experiment, experiments) {
  let nextBucketNumber = 0;
  for (const exp of experiments) {
    if (exp.id !== experiment.id) {
      for (const group of exp.variantGroups) {
        if (group.bucketRange.end >= nextBucketNumber) {
          nextBucketNumber = group.bucketRange.end;
        }
      }
    }
  }

  return nextBucketNumber;
}

// This function returns one experiment object, if a bucketID/user is in the experiment
// this is used in the getUserExperimentList() function as well, to build the array
function isUserInExperiment(experiment, bucketId, user) {
  if (experiment.status === "running") {
    // Do further user filtering here based on the variant rules, or the experiment rules - TODO
    const u = user;
    const groups = experiment.variantGroups;
    const g = getUserVariantGroup(groups, bucketId);
    if (g != null) {
      const data = {
        name: experiment.name,
        variant: g.name,
        variantIndex: g.index,
        mixPanelData: {
          token: experiment.mixPanelExperimentToken,
          event: g.mixPanelEvent
        }
      };

      return data;
    }
  }

  // If it returns null, the user is excluded from experiment
  return null;
}

// This function just returns which variant group a particular bucketNumber is in
function getUserVariantGroup(groups, bucketId) {
  if (groups !== null) {
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].buckets.includes(bucketId)) {
        return {
          name: groups[i].name,
          index: i,
          mixPanelEvent: groups[i].mixPanelEvent
        };
      }
    }
  }

  return null;
}

// This just returns an array of all the experiments that this particular user/bucketNumber is participating in
// We can then use this array to display what we need.
// No need for FLIPPER at all
function getUserExperimentList(experiments, bucketId, user) {
  const exps = [];
  experiments.forEach(exp => {
    const data = isUserInExperiment(exp, bucketId, user);
    if (data != null) {
      exps.push(data);
    }
  });

  return exps;
}

function getBucketStatus(buckets, bucketId) {
  for (const bucket of buckets) {
    if (bucket.bucketNumber === bucketId) {
      return bucket;
    }
  }
}

// EXAMPLE USAGE FROM WITHIN FULLSCRIPT THEN COULD BE..
//
/*  We could build a hook, that pulls the experiments for that user from the server
/*  which will then return an array of all the experiments this user is in (based on their bucketNumber)
  const experiments = [
    {name: 'my-experiment', variant: 'VariantGroupA', mixPanelData:{...}},
    {name: 'someOtherExperiment', variant: 'controlGroupA', mixPanelData:{...}},
    {name:'yet-another-experiment', variant: 'VariantGroupB', mixPanelData:{...}},
  ]

  then based on the key provided to the hook, the hook will find the experiment you're looking for and return that.
  We can either do that on the server or in javascript.  Either way works.

  const { experiment } = useABExperiment('my-experiment');

  // Then we just do this.  No FLIPPER needed at all.
  if(experiment){
    switch(experiment.variant){
      case 'controlGroupA':
          //show the user the blue button
          // do mixpanel logging via whatever hook we have to send data to mixpanel
          // we have the project token and the event inside the experiment object
          mixpanelData: {token: 'this-experiment-token', event: 'event-to-track-or-fire'}
      break;
      case 'VariantGroupB':
          // show the user the other thing
          // do mixpanel logging
      break;
    }
  }
*/

module.exports = {
  NUMBER_OF_STATIC_BUCKETS,
  BUCKET_SEED,
  USER_COUNT,
  getUserBucket,
  getUserVariantGroup,
  getUserExperimentList,
  isUserInExperiment,
  averageUsersPerBucket,
  getExperimentPopulationData,
  findNextAvailableBucket,
  getBucketStatus,
  recalculateVariantAllocation
};
