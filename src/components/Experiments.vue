<template>
  <div>
    <div class="overflow-x-auto relative">
      <div class="w-full mb-6">
        <button type="submit" class="mt-6 text-white bg-blue-700 rounded-md shadow-md hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" @click="addNewExperiment()">Create New Experiment</button>
      </div>
      <div v-if="loadedExperiment!==null" class="w-full">
        <ExperimentForm :experiment="loadedExperiment" @cancel="handleCancel()" />
      </div>
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-900 uppercase bg-gray-300">
          <tr>
            <th scope="col" class="py-3 px-6">
              Experiment Name
            </th>
            <th scope="col" class="py-3 px-6">
              Variants
            </th>
            <th scope="col" class="py-3 px-6">
              Buckets
            </th>
            <th scope="col" class="py-3 px-6">
              Total Population Percentage
            </th>
            <th scope="col" class="text-right py-3 px-6">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exp in experiments" :key="exp.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ exp.name }}
            </th>
            <td class="py-4 px-6">
            </td>
            <td class="py-4 px-6">
              {{ exp.buckets }}
            </td>
            <td class="py-4 px-6">
              {{ exp.populationPercent }}%
            </td>
            <td>
              <div class="flex flex-row-reverse space-x-4 space-x-reverse">
                <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" @click="editExperiment(exp)">EDIT</button>
                <button type="submit" class="text-white bg-yellow-400 hover:bg-yellow-800 focus:ring-2 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" @click="generateBuckets(exp)">GENERATE BUCKETS</button>
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
import { newExperiment } from '../helpers/data.js';
import { generateHashBuckets } from '../helpers/utils.js';



export default {
  name: 'Experiments',
  components: { ExperimentForm },
  data() {
    return {
      loadedExperiment:null
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

  methods:{
    handleCancel() {
      this.loadedExperiment = null;
    },
    addNewExperiment() {
      this.loadedExperiment = newExperiment;
    },
    editExperiment(experiment) {
      this.loadedExperiment = experiment;
    },
    generateBuckets(experiment) {
      this.$store.commit('SET_USERS', generateHashBuckets(experiment, this.users));
      this.$dtoast.pop({
        preset: 'success',
        heading: 'Generating Buckets For Experiment...',
        content:  'Please wait...',
      });
    }
  },
};
</script>
