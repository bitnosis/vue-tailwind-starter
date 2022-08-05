<template>
  <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
    <div class="mx-auto max-w-screen-sm text-center">
      <h2 class="mb-4 text-4xl tracking-tight font-extrabold leading-tight text-gray-900 dark:text-white">Start your free trial today</h2>
      <p class="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg">Try us for 30 days. No credit card required.</p>
      <button class="bg-blue-700 text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Free trial for 30 days</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Page2',
  props:['user', 'experiment']
};
</script>
