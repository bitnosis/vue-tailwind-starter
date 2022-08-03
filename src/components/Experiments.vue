<template>
  <div>
    <div v-if="viewingList" class="overflow-x-auto relative">
      <div v-if="viewingUserList">
        <ExperimentUserList :users="viewingUserList" :experiment="viewExperiment" @closeUsers="closeUsers()" @resetUsers="resetUsers()" />
      </div>
    </div>
    <div v-if="!viewingList" class="overflow-x-auto relative">
      <div class="w-full mb-6">
        <button type="submit" class="mt-6 text-white bg-blue-700 rounded-md shadow-md hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" @click="addNewExperiment()">Create New Experiment</button>
      </div>
      <div v-if="loadedExperiment!==null" class="w-full">
        <ExperimentForm :experiment="loadedExperiment" @resetUsers="resetUsers()" @cancel="handleCancel()" />
      </div>
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-900 uppercase bg-gray-300">
          <tr>
            <th scope="col" class="py-2 px-4">
              Experiment Name
            </th>
            <th scope="col" class="py-2 px-4">
              Treatment Groups
            </th>
            <th scope="col" class="py-2 px-4">
              Buckets
            </th>
            <th scope="col" class="py-2 px-4">
              Total Population Percentage
            </th>
            <th scope="col" class="text-right py-2 px-4">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exp in experiments" :key="exp.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="py-1 px-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ exp.name }}
            </th>
            <td class="py-1 px-3">
              <template v-if="exp.treatmentGroups.length>0">
                <div v-for="tg in exp.treatmentGroups" :key="tg.id" class="mb-1 text-xs text-gray-900">
                  <p><b>Name :</b> {{ tg.name }}</p>
                  <p v-if="exp.users.length>0" v-html="getTreatmentGroupCount(exp, tg)"></p>
                </div>
              </template>
            </td>
            <td class="py-1 px-3">
              {{ exp.buckets }}
            </td>
            <td class="py-1 px-3">
              {{ exp.populationPercent }}% <span v-if="exp.users.length>0">  - <b>{{ exp.users.length }}<b /> Users in experiment</b></span>
            </td>
            <td>
              <div class="flex flex-row-reverse space-x-4 space-x-reverse">
                <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-5 py-2.5 text-center d" @click="editExperiment(exp)">EDIT</button>
                <button type="submit" class="text-white bg-yellow-400 hover:bg-yellow-800 focus:ring-2 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs px-5 py-2.5 text-center " @click="generateBuckets(exp)">
                  <span v-if="!generatingBucket"> GENERATE BUCKETS</span>
                  <span v-else>
                    <Loader />
                  </span>
                </button>
                <button v-if="exp.users.length>0" type="submit" class="text-white bg-green-400 hover:bg-green-800 focus:ring-2 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-5 py-2.5 text-center" @click="viewUserList(exp)">VIEW USERS</button>
                <button v-if="exp.users.length>0" type="submit" class="text-white bg-red-400 hover:bg-red-800 focus:ring-2 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-5 py-2.5 text-center" @click="resetUsers(exp)">RESET</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import ExperimentForm from '../components/ExperimentForm';
import ExperimentUserList from '../components/ExperimentUserList';
import Loader from '../components/Loader';
import { newExperiment } from '../helpers/data.js';
import { generateBucketIds, generateUUID } from '../helpers/utils.js';

export default {
  name: 'Experiments',
  components: { ExperimentForm, ExperimentUserList, Loader },
  data() {
    return {
      loadedExperiment:null,
      viewExperiment:null,
      viewingUserList: [],
      viewingList: false,
      generatingBucket: false,
    };
  },
  computed: {
    experiments() {
      return this.$store.getters.getExperiments;
    },
    users() {
      return this.$store.getters.getUsers;
    }
  },
  onUnmounted() {
    this.viewingList = false;
  },
  methods:{
    getTreatmentGroupCount(experiment, group) {
      let count = 0;
      const groupIndex = experiment.treatmentGroups.indexOf(group);
      const buckets = experiment.buckets;
      const division = buckets/experiment.treatmentGroups.length;
      const start = division*groupIndex;
      const end = (start)+division;

      for (let i = 0;i<experiment.users.length;i++) {
        if (experiment.users[i].bucketId>=start && experiment.users[i].bucketId<=end) {
          count++;
        }
      }

      return 'Users In Bucket - <b>'+count+ '</b> (' +parseInt(division)+ ' Buckets)';
    },
    handleCancel() {
      this.loadedExperiment = null;
    },
    addNewExperiment() {
      this.loadedExperiment = newExperiment;
    },
    editExperiment(experiment) {
      this.loadedExperiment = experiment;
      this.loadedExperiment.treatmentGroups[0].id = generateUUID();
      this.loadedExperiment.treatmentGroups[1].id = generateUUID();

    },
    generateBuckets(experiment) {
      const that = this;
      this.$dtoast.pop({
        preset: 'success',
        heading: 'GENERATING BUCKETS',
        content:  'Please wait, this could take a while...',
      });
      this.generatingBucket = true;

      setTimeout(function() {
        const data = generateBucketIds(experiment, that.users);
        that.$store.commit('SET_USERS', data.theUsers);
        that.$store.commit('SET_EXPERIMENT', data.theExperiment);
        that.$forceUpdate();
        that.generatingBucket = false;
      },500);

    },
    viewUserList(experiment) {
      this.$dtoast.pop({
        preset: 'success',
        heading: 'Getting user list...',
        content:  'Please wait...',
      });
      this.viewingUserList = experiment.users;
      this.viewExperiment = experiment;
      this.viewingList = true;
    },
    resetUsers(experiment=null) {
      this.$dtoast.pop({
        preset: 'success',
        heading: 'Resetting these users...',
        content:  'Please wait',
      });
      let e = experiment;
      if (experiment===null) {
        if (this.viewExperiment===null) {
          e = this.loadedExperiment;
        } else {
          e = this.viewExperiment;
        }
      }

      for (let i = 0;i<this.users.length;i++) {
        if (this.users[i].experimentId === e.id) {
          this.users[i].experimentId = null;
          this.users[i].bucketId = null;
          this.users[i].isInExperiment = false;
        }
      }
      e.users = [];
      this.$store.commit('SET_USERS', this.users);
      this.$store.commit('SET_EXPERIMENT', e);
      // Hide list of users if visible
      this.closeUsers();
      this.$forceUpdate();
    },
    closeUsers() {
      this.viewingUserList = null;
      this.viewExperiment = null;
      this.viewingList = false;
    }
  },
};
</script>
