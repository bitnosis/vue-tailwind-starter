<template>
  <div class="flex gap-4 w-full">
    <div class="w-3/4">
      <Experiments />
    </div>
    <div class="w-1/3">
      <div class="w-full flex justify-end">
        <button type="submit" class="text-white bg-yellow-700 shadow-md hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-bold rounded-sm text-xs px-4 py-2 text-center" @click="userView=!userView">
          <span v-if="userView">View Bucket List</span>
          <span v-else>View User List</span>
        </button>
      </div>
      <BucketList v-if="!userView" />
      <UserList v-else :hide-button="true" />
    </div>
  </div>
</template>
<script>
import Experiments from '../components/Experiments.vue';
import UserList from '../components/UserList.vue';
import BucketList from '../components/BucketList.vue';
export default {
  name: 'Home',
  components:{ BucketList, UserList, Experiments },
  data() {
    return {
      userView:false
    };
  }
};
</script>
