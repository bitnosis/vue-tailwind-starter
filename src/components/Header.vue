<template>
  <nav class="bg-gray-100 shadow-lg px-2 mb-6 sm:px-4 py-2.5 rounded">
    <div class="w-full flex flex-wrap justify-between items-center">
      <a href="#/" class="flex items-center">
        <img src="@/assets/favicon-1.png" class="mr-3 h-3 sm:h-8" />
        <span class=" text-xl font-bold whitespace-nowrap ">CURA A/B Testing ("Bucket List") Demo</span>
      </a>
      <div id="navbar-default" class="w-full md:block md:w-auto">
        <ul class="flex flex-col p-4 mt-4 rounded-lg border border-gray-100 md:flex-row md:space-x-12 md:mt-0 md:text-sm md:font-medium md:border-0">
          <li>
            <a href="#/simulate" :class="navButtonClass('simulate')" class="font-semibold" @click="setPage('simulate')">SIMULATE A/B</a>
          </li>
          <li>
            <a href="#/logging" :class="navButtonClass('logging')" @click="setPage('logging')">Logging
              <span v-if="logs.length>0" class="text-xs inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-yellow-500 text-white rounded-full">{{ logs.length }}</span>
            </a>
          </li>
          <li>
            <a href="#/" :class="navButtonClass('')" @click="setPage('')">Experiments
              <span v-if="experiments.length>0" class="text-xs inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-blue-500 text-white rounded-full">{{ experiments.length }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  name: 'Header',
  computed: {
    logs() {
      return this.$store.getters.getLogs;
    },
    experiments() {
      return this.$store.getters.getExperiments;
    },
    page() {
      return this.$store.getters.getPage;
    }
  },
  methods:{
    setPage(page) {
      this.$store.commit('SET_PAGE', page);
    },
    navButtonClass(page) {
      return (this.page===page) ? 'block py-2 pr-4 pl-3 text-white  rounded md:bg-transparent  md:p-0 dark:text-white md:text-blue-700' : 'block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent';
    }
  }
};
</script>
