<template>
  <div>
    <div class="overflow-x-auto relative">
      <div v-if="!hideButton" class="w-full mb-6">
        <button type="submit" class="mt-6 text-white bg-blue-700 rounded-md shadow-md hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" @click="viewDetails=!viewDetails">View User Details</button>
      </div>
      <div v-else>
        <h3 class="text-xl mb-3 font-bold">User List</h3>
      </div>
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-900 uppercase bg-gray-300 ">
          <tr>
            <th :class="{hidden: !viewDetails}" scope="col" class="py-3  px-4">
              User ID
            </th>
            <th scope="col" class="py-3  px-4">
              User Name
            </th>
            <th scope="col" class="py-3  px-4">
              STATIC BUCKET #
            </th>

            <th :class="{hidden: !viewDetails}" scope="col" class="py-3  px-4">
              Modality
            </th>
            <th :class="{hidden: !viewDetails}" scope="col" class="py-3  px-4">
              Usage
            </th>
            <th :class="{hidden: !viewDetails}" scope="col" class="py-3  px-4">
              Revenue
            </th>
            <th :class="{hidden: !viewDetails}" scope="col" class="py-3  px-4">
              Patients
            </th>
            <th scope="col" class="text-center py-3  px-4">
              Experiments <span v-if="!viewDetails && !hideButton ">User Is A Part Of</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th :class="{hidden: !viewDetails}" scope="row" class="py-1 px-4 text-xs text-gray-900 whitespace-nowrap dark:text-white">
              {{ user.id }}
            </th>
            <td class="py-1 px-4">
              {{ user.name }}
            </td>
            <td class="py-1 px-4">
              <span class="inline-flex">
                <!--<span v-if="isInExperiment(user.bucketId)" class="inline-flex items-center justify-center px-1 py-1 mr-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">EX</span>
                <span v-if="isInExclusive(user.bucketId)" class="inline-flex items-center justify-center px-1 py-1 mr-2 text-xs font-bold leading-none text-red-100 bg-yellow-500 rounded-full">Y</span>-->
                {{ user.bucketId }}
              </span>
            </td>
            <td :class="{hidden: !viewDetails}" class="py-1 px-4">
              {{ user.modality.toUpperCase() }}
            </td>
            <td :class="{hidden: !viewDetails}" class="py-1 px-4">
              {{ user.usage.toUpperCase() }}
            </td>
            <td :class="{hidden: !viewDetails}" class="py-1 px-4">
              ${{ user.revenue.toFixed(2) }}
            </td>
            <td :class="{hidden: !viewDetails}" class="py-1 px-4">
              {{ user.patient_count }}
            </td>
            <td v-if="userExperiments(user.bucketId).length>0" class="text-xs py-1 px-4">
              <div v-for="exp in userExperiments(user.bucketId)" :key="exp.experiment">
                <b>Experiment :</b> {{ exp.experiment }}
                <br />
                <b>Variant :</b> {{ exp.variant }}
              </div>
            </td>
            <td v-else class="py-1 px-4 text-center text-xs text-gray-600 uppercase"> Not In Experiment</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getUserExperimentList, getBucketStatus } from '../helpers/bucketFunctions.js';

export default {
  name: 'UserList',
  props:['hideButton'],
  data() {
    return {
      viewDetails:false
    };
  },
  computed: {
    buckets() {
      return this.$store.getters.getBuckets;
    },
    experiments() {
      return this.$store.getters.getExperiments;
    },
    users() {
      return this.$store.getters.getUsers;
    },
  },
  methods: {
    userExperiments(bucketId) {
      return getUserExperimentList(this.experiments, bucketId);
    },
  }
};
</script>
