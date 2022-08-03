import Vue from "vue";
import VueRouter from "vue-router";
import Experiments from "../components/Experiments.vue";
import Buckets from "../components/Buckets.vue";
import UserList from "../components/UserList.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/users",
    name: "Users",
    component: UserList
  },
  {
    path: "/buckets",
    name: "Buckets",
    component: Buckets
  },
  {
    path: "/experiments",
    name: "Experiments",
    component: Experiments
  }
];

const router = new VueRouter({
  routes
});

export default router;
