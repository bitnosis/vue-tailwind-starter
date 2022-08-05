<template>
  <div>
    <!-- Main modal -->
    <div v-if="loadedExperiment!==null" id="defaultModal" tabindex="-1" class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal h-full">
      <div class="relative p-4 w-full ">
        <!-- Modal content -->
        <div class="relative bg-gray-800 rounded-sm shadow">
          <!-- Modal header -->
          <div class="flex justify-between items-start p-4 rounded-t border-b">
            <h3 class="text-xl font-semibold text-white">
              <span v-if="loadedExperiment.id==null">ADD NEW</span><span v-else>EDIT</span> EXPERIMENT - {{ loadedExperiment.name }}
            </h3>
            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-sm text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal" @click="handleCancel()">
              <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-6">
            <div v-if="loadedExperiment!==null" class="w-full">
              <ExperimentForm :experiment="loadedExperiment" @resetUsers="resetUsers()" @cancel="handleCancel()" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="viewingList" class="overflow-x-auto relative">
      <div v-if="viewingUserList">
        <ExperimentUserList :users="viewingUserList" :experiment="viewExperiment" @closeUsers="closeUsers()" @resetUsers="resetUsers()" />
      </div>
    </div>

    <div v-if="!viewingList" class="overflow-x-auto relative">
      <div class="w-full flex  mb-6">
        <button type="submit" class="mt-6 mr-4 text-white bg-red-700 rounded-sm shadow-md hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-bold text-sm px-4 py-1.5 text-center " @click="resetAll()">RESET ALL</button>
        <button type="submit" class="mt-6 text-white bg-blue-700 rounded-sm shadow-md hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold text-sm px-4 py-1.5 text-center " @click="addNewExperiment()">Create New Experiment</button>
      </div>

      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-900 uppercase bg-gray-300 border">
          <tr>
            <th scope="col" class="py-3 px-4">
              Experiment Name
            </th>
            <th scope="col" class="py-3 px-4">
              Treatment Groups
            </th>
            <th scope="col" class="py-3 px-4">
              Population Allocation
            </th>
            <th scope="col" class="py-3 px-4">
              Status
            </th>
            <th scope="col" class="text-right py-3 px-4">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exp in experiments" :key="exp.id" class="bg-white border-b border">
            <th scope="row" class="py-1 px-3 font-medium text-gray-900 whitespace-nowrap ">
              {{ exp.name }}
            </th>
            <td class="py-1 px-3">
              <template v-if="exp.variantGroups.length>0">
                <div v-for="(vg, i) in exp.variantGroups" :key="vg.id" class="mb-1 text-xs text-gray-900">
                  "{{ vg.name }}"  -  {{ vg.populationAllocation }}%
                </div>
              </template>
            </td>
            <td class="py-1 px-3">
              {{ exp.populationAllocation }}%
              <span v-if="exp.status!=='inactive'">
                <b>{{ getPopulationData(exp).userCount }}</b> Users in <b>{{ getPopulationData(exp).bucketCount }}</b> Buckets<br />
              </span>
            </td>
            <td class="py-1 px-3">
              {{ exp.status.toUpperCase() }}
            </td>
            <td class="py-2 px-3">
              <div class="flex flex-row-reverse space-x-4 space-x-reverse">
                <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-xs px-4 py-1.5 text-center d" @click="editExperiment(exp)">EDIT</button>
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

import { newExperiment } from '../helpers/data.js';
import { getExperimentPopulationData } from '../helpers/bucketFunctions.js';


export default {
  name: 'Experiments',
  components: { ExperimentForm, ExperimentUserList },
  data() {
    return {
      showModal:false,
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
    },
    buckets() {
      return this.$store.getters.getBuckets;
    }
  },
  onUnmounted() {
    this.viewingList = false;
  },
  methods:{
    getPopulationData(experiment) {
      const data = getExperimentPopulationData(experiment, this.users.length);

      return data;
    },
    handleCancel() {
      this.loadedExperiment = null;
    },
    addNewExperiment() {
      newExperiment.id = null;
      this.loadedExperiment = newExperiment;
    },
    editExperiment(experiment) {
      this.showModal = true;
      this.loadedExperiment = experiment;
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
    resetAll() {
      for (const exp of this.experiments) {
        exp.status = 'inactive';
        for (const vg of exp.variantGroups) {
          vg.buckets = [];
        }
      }
      for (const bucket of this.buckets) {
        bucket.isInExperiment = false;
      }
    },
    closeUsers() {
      this.viewingUserList = null;
      this.viewExperiment = null;
      this.viewingList = false;
    }
  },
};
</script>
