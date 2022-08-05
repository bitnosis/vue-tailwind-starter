<template>
  <div class="w-full">
    <div class="w-full flex gap-4">
      <div class="w-1/2">
        <label class="block mb-2 text-sm font-bold text-gray-900 ">Choose a user to Impersonate</label>
        <select id="countries" v-model="impersonator" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" @change="loadUser()">
          <option v-for="user in users" :key="user.id" :value="user">
            {{ user.name }} - {{ user.bucketId }}
            <span v-if="userExperiments(user.bucketId).length>0" class="text-xs py-1 px-4">
              <span v-for="exp in userExperiments(user.bucketId)" :key="exp.experiment">
                <b>Experiment :</b> {{ exp.experiment }}
                <br />
                <b>Variant :</b> {{ exp.variant }}
              </span>
            </span>
          </option>
        </select>
        <br />
        <h1 class="mt-4 text-xl font-bold">
          This is a demo page
        </h1>
        <p>
          When you impersonate a user, it will display the correct visuals for whatever AB test the user has running<br />
          Since this is just a demo, it has 4 variations, and will randomly assign them to experiment variants. But the overall gist of it is there. <br />
          This shows how we would use it, and send data to mixpanel
        </p>
      </div>
      <div v-if="impersonator!=null" class="w-1/2 bg-gray-100 p-8 rounded-md shadow-lg">
        <h4 class="font-semibold text-lg mb-4">Impression Data from User</h4>
        <div class=" text-gray-900 p-2 text-xs bg-white">
          <span v-if="impersonator.experiment!=null">
            <p>Mixpanel Project Token : <b>{{ impersonator.experiment.mixPanelData.token }}</b></p>
            <p>Mixpanel Event : <b>{{ impersonator.experiment.mixPanelData.event }}</b></p>
          </span>

          <pre class="bg-gray-50 p-4">
            {{ impersonator }}
          </pre>
        </div>
      </div>
    </div>
    <div class="w-full mt-8">
    </div>

    <!-- Default layout for all users -->
    <template v-if="experiment==null || experiment.variantIndex==0">
      <div class="w-full flex mt-10">
        <section class="bg-gray-100 rounded-md w-full">
          <Page3 />
        </section>
      </div>
      <div class="mt-8 bg-gray-200 rounded-lg p-4 flex gap-4 w-full">
        <section class="w-1/2 bg-white">
          <Page1 :experiment="experiment" />
        </section>
        <section class="w-1/2 bg-gray-50 ">
          <Page2 />
        </section>
      </div>
    </template>

    <div v-else>
      <div v-if="experiment.variantIndex==1" class="mt-8 bg-gray-200 rounded-lg p-4 flex gap-4 w-full">
        <section class="w-1/2 bg-white">
          <Page2 :experiment="experiment" />
        </section>
        <section class="w-1/2 bg-white">
          <Page1 :experiment="experiment" @sendMixpanel="sendData" />
        </section>
      </div>
      <div class="w-full flex">
        <section class="bg-white w-full">
          <Page4 />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getUserExperimentList
} from '../helpers/bucketFunctions.js';
import Page1 from '../components/Page1';
import Page2 from '../components/Page2';
import Page3 from '../components/Page3';
import Page4 from '../components/Page4';

export default {
  name: 'Simulate',
  components: {
    Page1,
    Page2,
    Page3,
    Page4
  },
  data() {
    return {
      impersonator: null,
      experiment: null
    };
  },
  computed: {
    users() {
      return this.$store.getters.getUsers;
    },
    experiments() {
      return this.$store.getters.getExperiments;
    }
  },
  methods: {
    sendData(event) {
      this.$dtoast.pop({
        preset: 'success',
        heading: 'Event: ' + event.mixPanelData.event + ' fired! To Project : ' + event.mixPanelData.token,
      });
    },
    userExperiments(bucketId) {
      return getUserExperimentList(this.experiments, bucketId);
    },
    loadUser() {
      const experiments = this.userExperiments(this.impersonator.bucketId);
      if (experiments != null) {
        this.experiment = experiments[0];
      }
      this.impersonator.device = this.deviceType();
      this.impersonator.experiment = this.experiment;

      if (this.experiment) {
        // Log the impression for experiment user is in it
        this.$store.commit('NEW_LOG', {
          experiment: this.experiment,
          user: this.impersonator,
          device: 'DEVICE HERE'
        });
      }
    },
    deviceType() {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
      } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile';
      }

      return 'desktop';
    }
  },

};
</script>
