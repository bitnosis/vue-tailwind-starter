<template>
  <div v-if="theUsers!=null">
    <ScatterChart v-if="chartData.length>0" :data="chartData" />
    <div class="overflow-x-auto relative">
      <div class="w-full flex flex-row-reverse space-x-4 space-x-reverse mb-6">
        <button type="submit" class="mt-6 text-white bg-red-700 rounded-md shadow-md hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center" @click="$emit('closeUsers')">CLOSE</button>
        <button type="submit" class="mt-6 text-white bg-blue-700 rounded-md shadow-md hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center" @click="$emit('resetUsers')">RESET ONLY USERS IN THIS EXPERIMENT</button>
      </div>
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-900 uppercase bg-gray-300 ">
          <tr>
            <th scope="col" class="py-3 px-6">
              User ID
            </th>
            <th scope="col" class="py-3 px-6">
              User Name
            </th>
            <th scope="col" class="text-center py-3 px-6">
              Experiment
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in theUsers" :key="user.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="py-4 px-6 text-xs text-gray-900 whitespace-nowrap dark:text-white">
              {{ user.id }}
            </th>
            <td class="py-4 px-6">
              {{ user.name }}
            </td>
            <td v-if="user.experimentId!=null">
              <b>Experiment :</b>  {{ user.experimentName }}
              <br />
              <b>Bucket ID :</b> {{ user.bucketId }}
              <br />
              <b>Treatment Group :</b> : {{ getTreatmentGroup(user.bucketId) }}
            </td>
            <td v-else class="text-center text-xs text-gray-600 uppercase"> Not In Experiment</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import ScatterChart from '../components/Scatter.vue';
import { randomColor } from '../helpers/utils.js';

export default {
  name: 'ExperimentUserList',
  components:{
    ScatterChart
  },
  props:['users', 'experiment'],
  data() {
    return {
      theUsers: this.users,
      viewingExperiment: this.experiment,
      chartData:[]
    };
  },
  computed: {
    experiments() {
      return this.$store.getters.getExperiments;
    },
  },
  mounted() {
    this.theUsers = this.users;
    this.viewingExperiment = this.experiment;
    this.chartData = this.getChartData();
  },
  methods:{
    getChartData() {
      const chartData = [];
      const e = this.viewingExperiment;
      for (let i = 0; i<e.treatmentGroups.length;i++) {
        const r = randomColor();
        const data = {
          label: e.treatmentGroups[i].name,
          fill: false,
          borderColor: r,
          backgroundColor: r,
          data:[]
        };

        for (let j = 0; j<e.users.length;j++) {
          if (this.getTreatmentGroup(e.users[j].bucketId) === e.treatmentGroups[i].name) {
            const d = { x: j, y: e.users[j].bucketId };
            data.data.push(d);
          }
        }

        chartData.push(data);
      }

      console.log(chartData);

      return chartData;
    },
    getTreatmentGroup(bucketId) {
      const e = this.viewingExperiment;
      const groups = e.treatmentGroups;
      for (const group of groups) {
        if (bucketId < group.rangeEnd) {
          return group.name;
        }
      }

      return null;
    }
  }
};
</script>
