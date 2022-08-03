import Vue from "vue";
import Vuex from "vuex";

import { generateFakeUsers, generateUUID } from "../helpers/utils.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    page: "experiments",
    users: generateFakeUsers(1500),
    experiments: [
      {
        id: generateUUID(),
        name: "First Example Experiment",
        treatmentGroups: [
          {
            id: generateUUID(),
            name: "Control A - Shown the tour",
            rangeEnd: 20,
            rules: []
          },
          {
            id: generateUUID(),
            rangeEnd: 40,
            name: "Control B - Not Shown Tour",
            rules: []
          }
        ],
        buckets: 40,
        populationPercent: 100,
        users: [],
        flipperName: "first-example-experiment"
      }
    ]
  },
  getters: {
    getPage: state => state.page,
    getUsers: state => state.users,
    getExperiments: state => state.experiments
  },
  mutations: {
    SET_PAGE(state, page) {
      state.page = page;
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
