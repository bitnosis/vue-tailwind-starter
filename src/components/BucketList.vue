<template>
  <div class="overflow-x-auto relative">
    <div>
      <h3 class="text-xl mb-3 font-bold">Bucket List</h3>
    </div>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-900 uppercase bg-gray-300 border ">
        <tr>
          <th scope="col" class="py-3  px-4">
            Bucket Number
          </th>
          <th scope="col" class="py-3  px-4">
            Users In Bucket
          </th>
          <th scope="col" class="py-3  px-4">
            Is In Experiment
          </th>
          <th scope="col" class="py-3  px-4">
            Experiment
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(bucket) in buckets" :key="bucket.bucketNumber" class="bg-white border">
          <td class="py-1 px-4">
            {{ bucket.bucketNumber }}
          </td>
          <td class="py-1 px-4">
            {{ bucket.userCount }}
          </td>
          <td class="py-1 px-4">
            {{ bucket.isInExperiment }}
          </td>
          <td v-if="userExperiments(bucket.bucketNumber).length>0 && bucket.isInExperiment" class="text-xs py-1 px-4">
            <div v-for="exp in userExperiments(bucket.bucketNumber)" :key="exp.name">
              <b>Experiment :</b> {{ exp.name }}
              <br />
              <b>Variant :</b> {{ exp.variant }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getUserExperimentList } from '../helpers/bucketFunctions.js';

export default {
  name: 'BucketList',
  props:['hideButton'],
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
  mounted() {
    this.getUserCounts();
  },
  methods: {
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
    userExperiments(bucketId) {
      return getUserExperimentList(this.experiments, bucketId);
    },
  }
};
</script>
