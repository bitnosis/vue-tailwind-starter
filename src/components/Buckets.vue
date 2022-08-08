<template>
  <div class="grid gap-1 grid-cols-12 grid-rows-12 text-lg">
    <div v-for="bucket in buckets" :key="bucket.bucketNumber" :class="bucket.isInExperiment ? 'bg-purple-900 font-bold text-white' : 'bg-gray-200'" class="rounded-md shadow-lg mb-2 text-center bg-gray-200 p-2">
      {{ bucket.bucketNumber }}
      <div v-if="userExperiments(bucket.bucketNumber).length>0 && bucket.isInExperiment" style="font-size:10px" class="text-xs text-left">
        <div v-for="exp in userExperiments(bucket.bucketNumber)" :key="exp.name">
          <b>{{ exp.name }}</b>
          <br />
          {{ exp.variant }}
        </div>
      </div>
      <p style="font-size:9px;">{{ averageUsers() }} Users / Bucket</p>
    </div>
  </div>
</template>

<script>
import { getUserExperimentList, averageUsersPerBucket } from '../helpers/bucketFunctions.js';
export default {
  name: 'Buckets',
  computed: {
    buckets() {
      return this.$store.getters.getBuckets;
    },
    experiments() {
      return this.$store.getters.getExperiments;
    },
    userCount() {
      return this.$store.getters.getUsers.length;
    }
  },
  methods:{
    averageUsers() {
      const n = averageUsersPerBucket(this.userCount);

      return n.toFixed(0);
    },
    userExperiments(bucketId) {
      return getUserExperimentList(this.experiments, bucketId);
    },
  }

};
</script>
