<template>
  <div>
    <div class="overflow-x-auto relative">
      <div class="w-full mb-6">
        <button type="submit" class="mt-6 text-white bg-blue-700 rounded-md shadow-md hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" @click="resetUsers()">RESET ALL USERS</button>
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
          <tr v-for="user in users" :key="user.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="py-4 px-6 text-xs text-gray-900 whitespace-nowrap dark:text-white">
              {{ user.id }}
            </th>
            <td class="py-4 px-6">
              {{ user.name }}
            </td>
            <td v-if="user.experiment!=null">
              {{ user.experiment }}
            </td>
            <td v-else class="text-center text-xs text-gray-600 uppercase"> Not In Experiment</td>
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
    users() {
      return this.$store.getters.getUsers;
    }
  },
  methods:{
    getTreatmentGroup(expId, variantId) {
      return expId+'-'+variantId;
    },
    resetUsers() {
      for (let i = 0;i<this.users.length;i++) {
        this.users[i].experiment = null;
      }
      this.$dtoast.pop({
        preset: 'success',
        heading: 'Resetting all users...',
        content:  'Please wait',
      });
      this.$store.commit('SET_USERS', this.users);
      this.$forceUpdate();
    }
  }
};
</script>
