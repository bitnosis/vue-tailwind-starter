<template>
  <div>
    <div class="w-full gap-5 flex">
      <div class="w-1/6 ">
        <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">User Count</label>
        <input v-model="bucketSeedInfo.userCount" type="number" max="2500" min="1" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 " placeholder="Experiment Name" required>
      </div>
      <div class="w-1/6 ">
        <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">Static Buckets</label>
        <input v-model="bucketSeedInfo.count" type="number" max="1000" min="1" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 " required @change="reCalculate()">
      </div>
      <div class="w-1/6 ">
        <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">Bucket Seed</label>
        <input v-model="bucketSeedInfo.seed" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 " required @change="reCalculate()">
      </div>
      <button type="submit" class="w-1/6 float-right mt-6 text-white bg-blue-700 rounded-sm shadow-md hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold text-sm px-3 py-1.5 text-center" @click="resetBucketsAndUsers()">
        Generate Fresh Users
      </button>
      <button type="submit" class="mt-6 float-right text-white bg-yellow-600 rounded-sm shadow-md hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-bold  text-sm px-3 py-1.5 text-center" @click="reHashBuckets()">
        Re-Hash Buckets
      </button>
      <button type="submit" class="mt-6 float-right text-white bg-purple-600 rounded-sm shadow-md hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-bold  text-sm px-3 py-1.5 text-center" @click="equallyDivideBuckets()">
        Equally Divide Buckets
      </button>
    </div>
    <div v-if="!generatingNewData" class="w-full mt-8 mb-8 flex">
      <template v-if="bucketData!==null">
        <div class="w-full text-center text-xl">
          <h3>Bucket Visualization</h3>
          <BarChart :height="50" :data="bucketData" />
        </div>
      </template>
    </div>
    <div v-if="!generatingNewData" class="grid gap-1 grid-cols-12 grid-rows-12 text-lg">
      <div v-for="bucket in buckets" :key="bucket.bucketNumber" :class="bucket.isInExperiment ? 'bg-purple-900 font-bold text-white' : 'bg-gray-200'" class="rounded-md shadow-lg mb-2 text-center bg-gray-200 p-2">
        {{ bucket.bucketNumber }}
        <div v-if="userExperiments(bucket.bucketNumber).length>0 && bucket.isInExperiment" style="font-size:10px" class="text-xs text-left">
          <div v-for="exp in userExperiments(bucket.bucketNumber)" :key="exp.name">
            <b>{{ exp.name }}</b>
            <br />
            {{ exp.variant }}
          </div>
        </div>
        <p style="font-size:12px;font-weight:bold;">{{ bucket.userCount }} Users</p>
      </div>
    </div>
    <div v-if="generatingNewData" class="w-full text-center mt-40 font-bold text-xl">
      Generating New Data......
    </div>
  </div>
</template>

<script>
import BarChart from '../components/BarChart.vue';
import { getUserExperimentList, NUMBER_OF_STATIC_BUCKETS, BUCKET_SEED, USER_COUNT } from '../helpers/bucketFunctions.js';
export default {
  name: 'Buckets',
  components:{
    BarChart
  },
  data() {
    return {
      generatingNewData:false,
      bucketSeedInfo:{
        seed:BUCKET_SEED,
        count:NUMBER_OF_STATIC_BUCKETS,
        userCount:USER_COUNT
      },
      bucketData:null,
    };
  },
  computed: {
    bucketInfo() {
      return this.$store.getters.getBucketInfo;
    },
    buckets() {
      return this.$store.getters.getBuckets;
    },
    experiments() {
      return this.$store.getters.getExperiments;
    },
    userCount() {
      return this.$store.getters.getUsers.length;
    },
    users() {
      return this.$store.getters.getUsers;
    }
  },
  mounted() {
    this.bucketSeedInfo = this.bucketInfo;
    this.bucketData = this.getBucketData();
    this.getUserCounts();
  },
  methods:{
    getUserCounts() {
      let count = 0;
      for (let i=0;i<=this.buckets.length-1;i++) {
        count = 0;
        for (let k =0;k<=this.users.length-1;k++) {
          if (this.users[k].bucketId === this.buckets[i].bucketNumber) {
            count++;
          }
        }
        this.buckets[i].userCount = count;
      }
    },
    getBucketData() {
      const b = this.buckets;
      const u = this.users;
      const chartData = { labels:[], datasets:[] };
      chartData.datasets.push(
        {
          barPercentage: 0.5,
          barThickness: 6,
          maxBarThickness: 8,
          minBarLength: 2,
          data: []
        }
      );
      for (let j =0; j<b.length;j++) {
        chartData.labels.push(b[j].bucketNumber);


        //const r = randomColor();
        let userCount = 0;
        for (let k = 0; k<u.length;k++) {
          if (u[k].bucketId===b[j].bucketNumber) {
            userCount++;
          }
        }
        chartData.datasets[0].data.push(userCount);
      }

      return chartData;
    },
    generateChart() {
      const that = this;
      this.getUserCounts();
      setTimeout(function() {
        that.bucketData = that.getBucketData();
        that.generatingNewData = false;
      },1000);
    },
    resetExperiments() {
      this.bucketData = null;
      this.generatingNewData = true;
      this.$store.dispatch('resetExperiments');
    },
    equallyDivideBuckets() {
      this.resetExperiments();
      this.$store.dispatch('equallyDivideBuckets', this.bucketSeedInfo);
      this.generateChart();
    },
    resetBucketsAndUsers() {
      this.resetExperiments();
      this.$store.dispatch('resetUsersAndBuckets', this.bucketSeedInfo);
      this.generateChart();
    },
    reHashBuckets() {
      this.resetExperiments();
      this.$store.dispatch('reHashBuckets', this.bucketSeedInfo);
      this.generateChart();
    },
    userExperiments(bucketId) {
      return getUserExperimentList(this.experiments, bucketId);
    },
  }

};
</script>
