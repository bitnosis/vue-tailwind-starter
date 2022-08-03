import Vue from "vue";
import Vuex from "vuex";

import { generateUsers, generateUUID } from "../helpers/utils.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    page: "experiments",
    users: generateUsers(5000),
    experiments: [
      {
        id: generateUUID(),
        name: "First Example Experiment",
        variantGroup: [],
        buckets: 40,
        populationPercent: 100,
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
    /* GET_EXPERIMENT(state, experiment){
      state.newexperiment = experiment
    },
    ADD_EXPERIMENT(state){
      state.experiments.push({
        body: state.newexperiment,
        completed: false
      })
    },
    EDIT_EXPERIMENT(state, experiment){
       var experiments = state.experiments
       experiments.splice(experiments.indexOf(experiment), 1)
       state.experiments = experiments
       state.newexperiment = experiment.body
    },
    REMOVE_EXPERIMENT(state, experiment){
       var experiments = state.experiments
       experiments.splice(experiments.indexOf(experiment), 1)
    },
    COMPLETE_EXPERIMENT(state, experiment){
      experiment.completed = !experiment.completed
    },
    CLEAR_EXPERIMENT(state){
      state.newexperiment = ''
    }*/
    SAVE_EXPERIMENT(state, experiment) {
      if (!experiment.id) {
        experiment.id = generateUUID();
      }
      state.experiments.push(experiment);
    },
    SET_PAGE(state, page) {
      state.page = page;
    },
    SET_USERS(state, users) {
      state.users = users;
    }
  },
  actions: {
    setPage({ commit }, page) {
      commit("SET_PAGE", page);
    },
    setUsers({ commit }, users) {
      commit("SET_USERS", users);
    }
    /*getExperiment({commit}, experiment){
      commit(‘GET_EXPERIMENT’, experiment)
    },
    addexperiment({commit}){
      commit(‘ADD_EXPERIMENT’)
    },
    editexperiment({commit}, experiment){
      commit(‘EDIT_EXPERIMENT’, experiment)
    },
    removeexperiment({commit}, experiment){
      commit(‘REMOVE_EXPERIMENT’, experiment)
    },
    completeexperiment({commit}, experiment){
     commit(‘COMPLETE_EXPERIMENT’, experiment)
    },
    clearexperiment({commit}){
      commit('CLEAR_EXPERIMENT')
    }*/
  }
});
