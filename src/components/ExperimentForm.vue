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
        <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">Population Percentage ( % )</label>
        <input v-model="loadedExperiment.populationPercent" type="number" max="100" min="1" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required>
      </div>
      <div class="w-1/4">
        <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">Flipper Name</label>
        <input v-model="loadedExperiment.flipperName" disabled class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required>
      </div>
    </div>

    <h3 class="font-bold">Treatment / Control Groups</h3>
    <div v-if="loadedExperiment.treatmentGroups" class="bg-gray-300 rounded-md p-8  mb-6">
      <template v-if="loadedExperiment.treatmentGroups.length>0">
        <div v-for="tg in loadedExperiment.treatmentGroups" :key="tg.id" class="flex gap-4 text-white bg-grey-500 p-2 w-full">
          <div class="w-1/2">
            <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">Control Group Description</label>
            <input v-model="tg.name" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required>
          </div>
          <div class="w-1/2">
            <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">Extra rules</label>
            <input v-model="tg.rules" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
          </div>
          <div class="w-1/4">
            <button type="submit" class="mt-8 text-white bg-red-700 rounded-md shadow-md hover:bg-red-800 focus:ring-3 focus:outline-none focus:ring-red-300 font-bold rounded-xl text-sm px-5 py-2.5 text-center " @click="removeTreatment(tg)">X</button>
          </div>
        </div>
        <button type="submit" class="mt-6 text-white bg-blue-700 rounded-md shadow-md hover:bg-blue-800 focus:ring-3 focus:outline-none focus:ring-blue-300 font-boldrounded-lg text-sm px-5 py-2.5 text-center " @click="addNewTreatment()">ADD TREATMENT GROUP</button>
      </template>
      <template v-else>
        <div class="font-semibold text-center mt-10 text-md">
          <h3>You have not added any Treatment / Control groups yet</h3>
          <button type="submit" class="mt-6 text-white bg-blue-700 rounded-md shadow-md hover:bg-blue-800 focus:ring-3 focus:outline-none focus:ring-blue-300 font-boldrounded-lg text-sm px-5 py-2.5 text-center " @click="addNewTreatment()">ADD TREATMENT GROUP</button>
        </div>
      </template>
    </div>


    <div class="flex flex-row-reverse space-x-4 space-x-reverse">
      <button type="submit" class="text-white rounded-md shadow-lg bg-green-800 hover:bg-green-700 focus:ring-3 focus:outline-none focus:ring-green-300 font-boldrounded-lg text-sm px-4 py-2.5 text-center " @click="saveExperiment()"><span v-if="loadedExperiment.id==null">ADD NEW</span><span v-else>SAVE</span> EXPERIMENT</button>
      <button type="submit" class="text-white rounded-md shadow-lg bg-red-900 hover:bg-red-700 focus:ring-3 focus:outline-none focus:ring-red-300 font-boldrounded-lg text-sm px-4 py-2.5 text-center " @click="$emit('cancel')">CANCEL</button>
    </div>
  </form>
</template>
<script>
import { sluggify, generateUUID } from '../helpers/utils.js';


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
      const that = this;
      if (this.loadedExperiment.treatmentGroups.length<=1) {
        this.$dtoast.pop({
          preset: 'error',
          heading: 'You need at least 2 Treatment Groups!!',
        });

        return;
      }
      // Redo rangeEnd's for bucketing here (if we've deleted or added treatment groups
      const count = this.loadedExperiment.treatmentGroups.length;
      const division = this.loadedExperiment.buckets/count;
      for (let i = 0; i<this.loadedExperiment.treatmentGroups.length;i++) {
        this.loadedExperiment.treatmentGroups[i].rangeEnd = parseInt(division * (i+1));
      }
      this.$store.commit('SAVE_EXPERIMENT', this.loadedExperiment);
      this.$emit('resetUsers');
      this.$dtoast.pop({
        preset: 'success',
        heading: 'Experiment Saved!',
      });
      this.$emit('cancel');
      setTimeout(function() {
        that.loadedExperiment = null;
      },400);

    },
    removeTreatment(treatment) {
      this.loadedExperiment.treatmentGroups.splice(this.loadedExperiment.treatmentGroups.indexOf(treatment), 1);
    },
    addNewTreatment() {
      const data = { id: generateUUID(), name:'New Control', rangeEnd:0, rules:[] };
      this.loadedExperiment.treatmentGroups.push(data);
    }
  }
};
</script>
