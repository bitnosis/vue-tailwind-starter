<template>
  <nav class="bg-gray-100 shadow-lg px-2 mb-6 sm:px-4 py-2.5 rounded">
    <div class="container flex flex-wrap justify-between items-center mx-auto">
      <a href="#/experiments" class="flex items-center">
        <img src="@/assets/favicon-1.png" class="mr-3 h-6 sm:h-16" />
        <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">CURA A/B Testing ("Bucket List") Demo</span>
      </a>
      <div id="navbar-default" class="hidden w-full md:block md:w-auto">
        <ul class="flex flex-col p-4 mt-4 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
          <li>
            <a href="#/users" :class="navButtonClass('users')" @click="setPage('users')">User List</a>
          </li>
          <li>
            <a href="#/experiments" :class="navButtonClass('experiments')" @click="setPage('experiments')">Experiments</a>
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
