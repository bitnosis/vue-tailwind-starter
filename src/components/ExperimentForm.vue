<template>
  <form v-if="experiment!=null" class="bg-gray-200 rounded-md mb-12 mt-8 p-10">
    <div class="flex w-full gap-4 mb-6">
      <div class="w-1/4 ">
        <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">Experiment Name</label>
        <input v-model="loadedExperiment.name" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Experiment Name" required @change="generateFlipperName()">
      </div>
      <div class="w-1/4">
        <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">Number of Buckets</label>
        <input v-model="loadedExperiment.buckets" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required>
      </div>
      <div class="w-1/4">
        <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">Population Percentage</label>
        <input v-model="loadedExperiment.populationPercent" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required>
      </div>
      <div class="w-1/4">
        <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">Flipper Name</label>
        <input v-model="loadedExperiment.flipperName" disabled class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required>
      </div>
    </div>

    <h3 class="font-bold">Treatments / Variant Groups</h3>
    <div class="bg-gray-300 rounded-md p-8 text-center mb-6">
      <template v-if="loadedExperiment.variants.length>0">
        <div v-for="variant in loadedExperiments.variantGroups" :key="variant.id" class="text-white bg-grey-500 p-6">
          {{ variant }}
        </div>
      </template>
      <template v-else>
        <div class="font-semibold text-center text-md"><h3>You have not added any Treatment descriptions yet</h3></div>
      </template>
      <button type="submit" class="mt-6 text-white bg-blue-700 rounded-md shadow-md hover:bg-blue-800 focus:ring-3 focus:outline-none focus:ring-blue-300 font-boldrounded-lg text-sm px-5 py-2.5 text-center " @click="addNewTreatment()">ADD TREATMENT GROUP</button>
    </div>


    <div class="flex flex-row-reverse space-x-4 space-x-reverse">
      <button type="submit" class="text-white rounded-md shadow-lg bg-green-800 hover:bg-green-700 focus:ring-3 focus:outline-none focus:ring-green-300 font-boldrounded-lg text-sm px-4 py-2.5 text-center " @click="saveExperiment()"><span v-if="loadedExperiment.id==null">ADD NEW</span><span v-else>SAVE</span> EXPERIMENT</button>
      <button type="submit" class="text-white rounded-md shadow-lg bg-red-900 hover:bg-red-700 focus:ring-3 focus:outline-none focus:ring-red-300 font-boldrounded-lg text-sm px-4 py-2.5 text-center " @click="$emit('cancel')">CANCEL</button>
    </div>
  </form>
</template>
<script>
import { sluggify } from '../helpers/utils.js';

export default {
  name: 'ExperimentForm',
  props: ['experiment'],
  data() {
    return {
      loadedExperiment: this.experiment
    };
  },
  mounted() {
    this.loadedExperiment = this.experiment;
    this.generateFlipperName();
  },
  methods: {
    generateFlipperName() {
      this.loadedExperiment.flipperName =   sluggify(this.loadedExperiment.name);
    },
    saveExperiment() {
      this.loadedExperiment = null;
      this.$dtoast.pop({
        preset: 'success',
        heading: 'Custom Heading',
        content:  'Custom content',
      });
      this.$store.commit('SAVE_EXPERIMENT', this.loadedExperiment);
    }
  }
};
</script>
