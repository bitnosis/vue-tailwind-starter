<template>
  <div class="w-full">
    <div class="overflow-x-auto relative">
      <div class="flex">
        <div class="w-1/2">
          <h3 class="mt-8 text-xl font-bold">Impression Logs</h3>
        </div>
        <div class="w-1/2 mb-3">
          <button type="submit" class="mt-6 right float-right text-white bg-red-900 rounded-md shadow-md hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center" @click="clearLogs()">Clear Logs</button>
        </div>
      </div>


      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-900 uppercase bg-gray-300 border ">
          <tr>
            <th scope="col" class="py-3  px-4">
              User ID
            </th>
            <th scope="col" class="py-3  px-4">
              Experiment Name
            </th>
            <th scope="col" class="py-3  px-4">
              Variant Group
            </th>
            <th scope="col" class="py-3  px-4">
              Impressions
            </th>
            <th scope="col" class="py-3  px-4">
              Mixpanel Events
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log" class="bg-white border">
            <th scope="row" class="py-1 px-4 text-xs text-gray-900 whitespace-nowrap dark:text-white">
              {{ log.user.id }}
            </th>
            <td class="py-1 px-4">
              {{ log.experiment.name }}
            </td>
            <td class="py-1 px-4">
              {{ log.experiment.variant }}
            </td>
            <td class="py-1 px-4">
              {{ log.impressions }}
            </td>
            <td class="py-1 px-4">
              <span class="inline-flex text-xs">
                <!--<span v-if="isInExperiment(user.bucketId)" class="inline-flex items-center justify-center px-1 py-1 mr-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">EX</span>
                <span v-if="isInExclusive(user.bucketId)" class="inline-flex items-center justify-center px-1 py-1 mr-2 text-xs font-bold leading-none text-red-100 bg-yellow-500 rounded-full">Y</span>-->
                Project Token : <b>{{ log.experiment.mixPanelData.token }}</b>
                Mixpanel Event : <b>{{ log.experiment.mixPanelData.event }}</b>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Page1',
  computed: {
    logs() {
      return this.$store.getters.getLogs;
    }
  },
  mounted() {
    console.log(this.logs);
  },
  methods:{
    clearLogs() {
      this.$store.commit('SET_LOGS', []);
    }
  }

};
</script>
