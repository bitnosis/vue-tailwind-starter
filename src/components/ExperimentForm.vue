<template>
  <form v-if="experiment!=null" class="bg-gray-200 rounded-md mb-12 p-4">
    <div class="flex w-full gap-4 mb-6">
      <div class="w-1/4 ">
        <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">Experiment Name</label>
        <input v-model="loadedExperiment.name" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Experiment Name" required>
      </div>
      <div class="w-1/4 ">
        <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">Population Allocation ( % )</label>
        <input v-model="loadedExperiment.populationAllocation" type="number" max="100" min="1" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required @change="reCalculate()">
        <span class="text-gray-500 text-sm">{{ getPopulationData(loadedExperiment).userCount }} Users - {{ getPopulationData(loadedExperiment).bucketCount }} Buckets (est)</span>
      </div>
      <div class="w-1/2">
        <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">Mix Panel Project Token</label>
        <input v-model="loadedExperiment.mixPanelExperimentToken" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " @change="mixPanelSlug()">
      </div>
    </div>
    <div class="w-full flex gap-4">
      <div class="w-1/2 ">
        <label class="block mb-2 text-sm font-bold text-gray-900 ">Hypothesis</label>
        <input
          v-model="loadedExperiment.hypothesis"
          class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          placeholder="Experiment Hypothesis"
          required
        />
      </div>
      <div class="w-1/6 ">
        <label class="block mb-2 text-sm font-bold text-gray-900 ">Start Date</label>
        <input
          v-model="loadedExperiment.startDate"
          class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          placeholder="Experiment Starting Date"
          required
        />
      </div>
      <div class="w-1/6 ">
        <label class="block mb-2 text-sm font-bold text-gray-900 ">End Date</label>
        <input
          v-model="loadedExperiment.endDate"
          class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          placeholder="Experiment Ending Date"
          required
        />
      </div>
      <div class="w-1/6">
        <label class="block mb-2 text-sm font-bold text-gray-900 ">Experiment Status</label>
        <select id="countries" v-model="loadedExperiment.status" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
          <option value="inactive">INACTIVE</option>
          <option value="running">RUNNING</option>
          <option value="paused">PAUSED</option>
          <option value="ended">ENDED</option>
          <option value="archived">ARCHIVED</option>
        </select>
      </div>
    </div>
    <div class="flex w-full gap-4 mb-6 mt-8">
      <div class="w-full">
        <h3 class="mb-2 text-sm font-bold">Variant Groups</h3>
        <div v-if="loadedExperiment.variantGroups" class="bg-gray-100 rounded-md p-4  mb-6">
          <template v-if="loadedExperiment.variantGroups.length>0">
            <div v-for="vg in loadedExperiment.variantGroups" :key="vg.id" class="flex justify-end bg-gray-300 mb-2 rounded-md p-4 ">
              <div class="w-full flex gap-4 mb-2">
                <div class="w-1/6">
                  <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">Name</label>
                  <input v-model="vg.name" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required>
                </div>
                <div class="w-1/6">
                  <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">Allocation %</label>
                  <input v-model="vg.populationAllocation" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required @change="reCalculate()">
                  <span class="text-xs">Buckets [ {{ vg.bucketRange.start }} - {{ vg.bucketRange.end }} ]
                  </span>
                </div>
                <div class="w-1/3">
                  <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">Hypothesis</label>
                  <input v-model="vg.description" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required>
                </div>
                <div class="w-1/3">
                  <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">Mixpanel Event</label>
                  <input v-model="vg.mixPanelEvent" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required>
                </div>
              </div>
              <div class="">
                <button type="submit" class="text-white mt-8 ml-4 shadow-lg bg-red-900 hover:bg-red-700 focus:ring-3 focus:outline-none focus:ring-red-300 font-bold rounded-sm text-sm px-4 py-1.5 text-center " @click="removeVariant(vg)">x</button>
              </div>
              <!--<div class="w-full flex gap-4 ">
                <div class="w-1/2">
                  <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-gray-300">Extra rules</label>
                  <input v-model="vg.rules" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                </div>
              </div>-->

              <!--{{ vg.bucketRange.start }} {{ vg.bucketRange.end }}-->
            </div>
            <button type="submit" class="mt-2 text-white bg-blue-700 rounded-sm shadow-md hover:bg-blue-800 focus:ring-3 focus:outline-none focus:ring-blue-300 font-bold text-sm px-4 py-1.5 text-center " @click="addNewVariant()">ADD VARIANT GROUP</button>
          </template>
          <template v-else>
            <div class="font-semibold text-center mt-10 text-md">
              <h3>You have not added any Variant Groups yet</h3>
              <button type="submit" class="mt-6 text-white bg-blue-700 rounded-md shadow-md hover:bg-blue-800 focus:ring-3 focus:outline-none focus:ring-blue-300 font-boldrounded-lg text-sm px-5 py-2.5 text-center " @click="addNewVariant()">ADD VARIANT GROUP</button>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="flex flex-row-reverse space-x-4 space-x-reverse">
      <button type="submit" class="text-white shadow-lg bg-green-800 hover:bg-green-700 focus:ring-3 focus:outline-none focus:ring-green-300 font-bold rounded-sm text-sm px-4 py-1.5 text-center " @click="saveExperiment()"><span v-if="loadedExperiment.id==null">ADD NEW</span><span v-else>SAVE</span> EXPERIMENT</button>
      <button type="submit" class="text-white shadow-lg bg-red-900 hover:bg-red-700 focus:ring-3 focus:outline-none focus:ring-red-300 font-bold rounded-sm text-sm px-4 py-1.5 text-center " @click="$emit('cancel')">CANCEL</button>
    </div>
  </form>
</template>

<script>
import { newVariant } from '../helpers/data.js';

import {
  sluggify,
  generateUUID
} from '../helpers/utils.js';
import {
  getExperimentPopulationData,
  recalculateVariantAllocation
} from '../helpers/bucketFunctions.js';

export default {
  name: 'ExperimentForm',
  props: ['experiment'],
  data() {
    return {
      loadedExperiment: this.experiment
    };
  },
  computed: {
    users() {
      return this.$store.getters.getUsers;
    },
    experiments() {
      return this.$store.getters.getExperiments;
    },
    buckets() {
      return this.$store.getters.getBuckets;
    }
  },
  mounted() {
    this.loadedExperiment = this.experiment;
  },
  methods: {
    getPopulationData(experiment) {
      const data = getExperimentPopulationData(experiment, this.users.length);
      this.loadedExperiment.bucketCount = data.bucketCount;
      this.loadedExperiment.userCount = data.userCount;

      return data;
    },
    mixPanelSlug() {
      this.loadedExperiment.mixPanelExperimentToken = sluggify(this.loadedExperiment.mixPanelExperimentToken);
    },
    reCalculate() {
      recalculateVariantAllocation(this.loadedExperiment, this.users.length);
    },
    emptyBuckets(experiment) {
      for (const vg of experiment.variantGroups) {
        for (const bucketId of vg.buckets) {
          for (const b of this.buckets) {
            if (b.bucketNumber === bucketId && b.isInExperiment) {
              b.isInExperiment = false;
            }
          }
          vg.buckets = [];
        }
      }

      return experiment;
    },
    saveExperiment() {
      const that = this;
      // If the experiment doesnt have at least 2 variants, it wont let you save
      if (this.loadedExperiment.variantGroups.length <= 1) {
        this.$dtoast.pop({
          preset: 'error',
          heading: 'You need at least 2 Variant Groups to create/save an experiment!',
        });

        return;
      }

      if (this.loadedExperiment.id!=null) {
        this.loadedExperiment = this.emptyBuckets(this.loadedExperiment);

        // Get only available buckets
        const buckets = this.buckets.filter(function(bucket) {
          return bucket.isInExperiment === false;
        });

        if (this.loadedExperiment.status==='running' || this.loadedExperiment.status==='paused') {
          for (const vg of this.loadedExperiment.variantGroups) {
            let count = 0;
            for (const bucket of buckets) {
              if (count>=vg.bucketRange.start && count<=vg.bucketRange.end) {
                vg.buckets.push(bucket.bucketNumber);
                bucket.isInExperiment = true;
              }
              count++;
            }
          }
        }
      }

      this.$store.commit('SAVE_EXPERIMENT', this.loadedExperiment);
      this.$dtoast.pop({
        preset: 'success',
        heading: 'Experiment Saved!',
      });
      this.$emit('cancel');
      setTimeout(function() {
        that.loadedExperiment = null;
      },400);
    },

    removeVariant(treatment) {
      this.loadedExperiment.variantGroups.splice(this.loadedExperiment.variantGroups.indexOf(treatment), 1);
      this.reCalculate();
    },
    addNewVariant() {
      const data = newVariant;
      newVariant.id = generateUUID();
      this.loadedExperiment.variantGroups.push(data);
      this.reCalculate();
    }
  }
};
</script>
