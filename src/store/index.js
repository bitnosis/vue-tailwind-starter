import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import {
  generateBuckets,
  generateFakeUsers,
  generateUUID
} from "../helpers/utils.js";
import { newExperiment } from "../helpers/data.js";
import {
  BUCKET_SEED,
  NUMBER_OF_STATIC_BUCKETS,
  USER_COUNT,
  getUserBucket
} from "../helpers/bucketFunctions.js";

newExperiment.id = generateUUID();
newExperiment.variantGroups[0].id = generateUUID();
newExperiment.variantGroups[1].id = generateUUID();

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [vuexLocal.plugin],
  state: {
    page: "experiments",
    users: generateFakeUsers(USER_COUNT, BUCKET_SEED, NUMBER_OF_STATIC_BUCKETS),
    buckets: generateBuckets(NUMBER_OF_STATIC_BUCKETS),
    experiments: [newExperiment],
    bucketInfo: {
      seed: BUCKET_SEED,
      count: NUMBER_OF_STATIC_BUCKETS,
      userCount: USER_COUNT
    },
    logs: []
  },
  getters: {
    getBucketInfo: state => state.bucketInfo,
    getLogs: state => state.logs,
    getBuckets: state => state.buckets,
    getPage: state => state.page,
    getUsers: state => state.users,
    getExperiments: state => state.experiments
  },
  mutations: {
    SET_BUCKET_INFO(state, info) {
      state.bucketInfo = info;
    },
    SET_PAGE(state, page) {
      state.page = page;
    },
    SET_LOGS(state, logs) {
      state.logs = logs;
    },
    NEW_LOG(state, log) {
      state.logs.push(log);
    },
    DELETE_EXPERIMENT(state, experiment) {
      const index = state.experiments.indexOf(experiment);
      state.experiments.splice(index, 1);
    },
    SAVE_EXPERIMENT(state, experiment) {
      if (experiment.id === null) {
        experiment.id = generateUUID();
        state.experiments.push(experiment);
      } else {
        const index = state.experiments.indexOf(experiment);
        state.experiments[index] = experiment;
      }
    },
    SET_BUCKETS(state, buckets) {
      state.buckets = buckets;
    },
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_EXPERIMENTS(state, experiments) {
      state.experiments = experiments;
    },
    SET_EXPERIMENT(state, experiment) {
      const index = state.experiments.indexOf(experiment);
      state.experiments[index] = experiment;
    }
  },
  actions: {
    reHashBuckets({ commit, state }, data) {
      state.buckets = generateBuckets(data.count);
      state.bucketInfo = data;
      for (let i = 0; i < state.users.length; i++) {
        state.users[i].bucketId = getUserBucket(
          state.users[i].id,
          data.seed,
          data.count
        );
      }
      commit("SET_USERS", state.users);
      commit("SET_BUCKETS", state.buckets);
      commit("SET_BUCKET_INFO", data);
    },
    resetExperiments({ commit, state }) {
      for (const exp of state.experiments) {
        exp.status = "inactive";
        for (const vg of exp.variantGroups) {
          vg.buckets = [];
        }
      }
      commit("SET_EXPERIMENTS", state.experiments);
    },
    resetUsersAndBuckets({ commit, state }, data) {
      state.users = generateFakeUsers(data.userCount, data.seed, data.count);
      state.buckets = generateBuckets(data.count);
      commit("SET_USERS", state.users);
      commit("SET_BUCKETS", state.buckets);
      commit("SET_BUCKET_INFO", data);
    },
    equallyDivideBuckets({ commit, state }, data) {
      state.buckets = generateBuckets(data.count);
      state.users = generateFakeUsers(data.userCount, data.seed, data.count);

      setTimeout(function() {
        const userCount = data.userCount;
        const usersPerBucket = parseInt(userCount / state.buckets.length);
        state.bucketInfo = data;
        let count = 0;
        let bucketIndex = 1;
        for (let i = 0; i <= state.users.length - 1; i++) {
          if (count < usersPerBucket) {
            state.users[i].bucketId = bucketIndex;
            count++;
          } else {
            bucketIndex++;
            state.users[i].bucketId = bucketIndex;
            count = 1;
          }
        }

        commit("SET_USERS", state.users);
        commit("SET_BUCKETS", state.buckets);
        commit("SET_BUCKET_INFO", data);
      }, 1000);
    },
    setPage({ commit }, page) {
      commit("SET_PAGE", page);
    },
    setUsers({ commit }, users) {
      commit("SET_USERS", users);
    }
  }
});
