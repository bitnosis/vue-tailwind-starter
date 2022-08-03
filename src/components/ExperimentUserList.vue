<template>
  <div v-if="theUsers!=null">
    <div class="w-full flex flex-row-reverse space-x-4 space-x-reverse mb-6">
      <button type="submit" class="mt-6 text-white bg-red-700 rounded-md shadow-md hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center" @click="$emit('closeUsers')">CLOSE</button>
      <button type="submit" class="mt-6 text-white bg-blue-700 rounded-md shadow-md hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center" @click="$emit('resetUsers')">RESET ONLY USERS IN THIS EXPERIMENT</button>
    </div>

    <div class="w-full flex">
      <template v-if="chartData.length>0">
        <div class="w-1/2 text-center text-xl">
          <h3>Bucket Visualization</h3>
          <ScatterChart :data="chartData" />
        </div>
      </template>

      <template v-if="modalityData!=null">
        <div class="w-1/2 text-center text-xl">
          <h3>Modality Distribution</h3>
          <BarChart ref="bar1" :data="modalityData" />
        </div>
      </template>
    </div>

    <div class="w-full flex">
      <template v-if="patientData!=null">
        <div class="w-1/2 text-center text-xl">
          <h3>Patient Count Distribution</h3>
          <BarChart ref="bar2" :data="patientData" />
        </div>
      </template>

      <template v-if="revenueData!=null">
        <div class="w-1/2 text-center text-xl">
          <h3>Revenue Distribution</h3>
          <BarChart ref="bar3" :data="revenueData" />
        </div>
      </template>
    </div>


    <div class="overflow-x-auto relative">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-900 uppercase bg-gray-300 ">
          <tr>
            <th scope="col" class="py-3 px-4">
              User ID
            </th>
            <th scope="col" class="py-3 px-4">
              User Name
            </th>
            <th scope="col" class="text-center py-3 px-4">
              Experiment
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in theUsers" :key="user.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="py-1 px-4 text-xs text-gray-900 whitespace-nowrap dark:text-white">
              {{ user.id }}
            </th>
            <td class="py-1 px-4">
              {{ user.name }}
            </td>
            <td v-if="user.experimentId!=null" class="text-xs py-1 px-4">
              <b>Experiment :</b>  {{ user.experimentName }}
              <br />
              <b>Bucket ID :</b> {{ user.bucketId }}
              <br />
              <b>Treatment Group :</b> : {{ getTreatmentGroup(user.bucketId) }}
            </td>
            <td v-else class="py-1 px-4 text-center text-xs text-gray-600 uppercase"> Not In Experiment</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import ScatterChart from '../components/Scatter.vue';
import BarChart from '../components/BarChart.vue';
import { randomColor } from '../helpers/utils.js';
import { modalities, revenue, patients } from '../helpers/data.js';

export default {
  name: 'ExperimentUserList',
  components:{
    ScatterChart, BarChart
  },
  props:['users', 'experiment'],
  data() {
    return {
      theUsers: this.users,
      viewingExperiment: this.experiment,
      chartData:[],
      modalityData:null,
      patientData:null,
      revenueData:null
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
    this.modalityData = this.getModalityData();
    this.patientData = this.getPatientData();
    this.revenueData = this.getRevenueData();
  },
  methods:{
    getModalityData() {
      const e = this.viewingExperiment;
      const chartData = { labels:[], datasets:[] };
      for (let j =0; j<modalities.length;j++) {
        const r = randomColor();
        chartData.datasets.push({ label:modalities[j],data:[0], backgroundColor: r });
      }
      for (let i =0; i<e.treatmentGroups.length;i++) {
        chartData.labels.push(e.treatmentGroups[i].name);
        for (let j =0; j<modalities.length;j++) {
          chartData.datasets[j].data[i] = 0;
          for (let k = 0; k<e.users.length;k++) {
            if (e.users[k].modality===modalities[j] && this.getTreatmentGroup(e.users[k].bucketId)===e.treatmentGroups[i].name) {
              chartData.datasets[j].data[i] += 1 ;
            }
          }
        }
      }

      return chartData;
    },
    getPatientData() {
      const e = this.viewingExperiment;
      const chartData = { labels:[], datasets:[] };
      for (let j =0; j<patients.length;j++) {
        const r = randomColor();
        chartData.datasets.push({ label:patients[j].label,data:[0], backgroundColor: r });
      }

      for (let i =0; i<e.treatmentGroups.length;i++) {
        chartData.labels.push(e.treatmentGroups[i].name);
        for (let j =0; j<patients.length;j++) {
          chartData.datasets[j].data[i] = 0;
          for (let k = 0; k<e.users.length;k++) {
            let start = 0; let end;
            if (j!==0) {
              start = patients[j].rangeEnd;
            }
            if (j>=patients.length-1) {
              end = patients[j].rangeEnd;
            } else {
              end = patients[j+1].rangeEnd;
            }
            if ((e.users[k].patient_count>=start && e.users[k].patient_count<=end) && this.getTreatmentGroup(e.users[k].bucketId)===e.treatmentGroups[i].name) {
              chartData.datasets[j].data[i] += 1 ;
            }
          }
        }
      }

      return chartData;
    },
    getRevenueData() {
      const e = this.viewingExperiment;
      const chartData = { labels:[], datasets:[] };
      for (let j =0; j<revenue.length;j++) {
        const r = randomColor();
        chartData.datasets.push({ label:revenue[j].label,data:[0], backgroundColor: r });
      }

      for (let i =0; i<e.treatmentGroups.length;i++) {
        chartData.labels.push(e.treatmentGroups[i].name);
        for (let j =0; j<revenue.length;j++) {
          chartData.datasets[j].data[i] = 0;
          for (let k = 0; k<e.users.length;k++) {
            let start = 0; let end;
            if (j!==0) {
              start = revenue[j].rangeEnd;
            }
            if (j>=revenue.length-1) {
              end = revenue[j].rangeEnd;
            } else {
              end = revenue[j+1].rangeEnd;
            }
            if ((e.users[k].revenue>=start && e.users[k].revenue<=end) && this.getTreatmentGroup(e.users[k].bucketId)===e.treatmentGroups[i].name) {
              chartData.datasets[j].data[i] += 1 ;
            }
          }
        }
      }

      return chartData;
    },
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
