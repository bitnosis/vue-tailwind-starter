<template>
  <div>
    <div class="overflow-x-auto relative">
      <div class="w-full mb-6">
        <button type="submit" class="mt-6 text-white bg-blue-700 rounded-md shadow-md hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" @click="resetUsers()">RESET ALL USERS</button>
      </div>
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-900 uppercase bg-gray-300 ">
          <tr>
            <th scope="col" class="py-3  px-4">
              User ID
            </th>
            <th scope="col" class="py-3  px-4">
              User Name
            </th>
            <th scope="col" class="text-center py-3  px-4">
              Experiment
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
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
              <b>Treatment :</b> : {{ getTreatmentGroup(user.experimentId, user.bucketId) }}
            </td>
            <td v-else class="py-1 px-4 text-center text-xs text-gray-600 uppercase"> Not In Experiment</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'UserList',
  computed: {
    experiments() {
      return this.$store.getters.getExperiments;
    },
    users() {
      return this.$store.getters.getUsers;
    }
  },
  methods:{
    getTreatmentGroup(experimentId, bucketId) {
      let groups = null;
      for (let i = 0; i<this.experiments.length;i++) {
        if (this.experiments[i].id===experimentId) {
          groups = this.experiments[i].treatmentGroups;
        }
      }

      if (groups!==null) {
        for (const group of groups) {
          if (bucketId < group.rangeEnd) {
            return group.name;
          }
        }
      }

      return null;
    },
    resetUsers() {
      for (let i = 0;i<this.users.length;i++) {
        this.users[i].experimentId = null;
        this.users[i].bucketId = null;
        this.users[i].isInExperiment = false;
      }
      for (let i = 0; i<this.experiments.length;i++) {
        this.experiments[i].users = [];
      }
      this.$dtoast.pop({
        preset: 'success',
        heading: 'Resetting all users...',
        content:  'Please wait',
      });
      this.$store.commit('SET_USERS', this.users);
      this.$store.commit('SET_EXPERIMENTS', this.experiments);
      this.$forceUpdate();
    }
  }
};
</script>
