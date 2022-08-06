import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import {
  generateBuckets,
  generateFakeUsers,
  generateUUID
} from "../helpers/utils.js";
import { newExperiment } from "../helpers/data.js";
import { NUMBER_OF_STATIC_BUCKETS } from "../helpers/bucketFunctions.js";

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
    users: generateFakeUsers(1000),
    buckets: generateBuckets(NUMBER_OF_STATIC_BUCKETS),
    experiments: [newExperiment],
    logs: []
  },
  getters: {
    getLogs: state => state.logs,
    getBuckets: state => state.buckets,
    getPage: state => state.page,
    getUsers: state => state.users,
    getExperiments: state => state.experiments
  },
  mutations: {
    SET_PAGE(state, page) {
      state.page = page;
    },
    SET_LOGS(state, logs) {
      state.logs = logs;
    },
    NEW_LOG(state, log) {
      state.logs.push(log);
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
    setPage({ commit }, page) {
      commit("SET_PAGE", page);
    },
    setUsers({ commit }, users) {
      commit("SET_USERS", users);
    }
  }
});
