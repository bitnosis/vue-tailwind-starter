import Vue from "vue";
import VueRouter from "vue-router";
import Experiments from "../components/Experiments.vue";
import Buckets from "../components/Buckets.vue";
import UserList from "../components/UserList.vue";
import Home from "../components/Home.vue";
import Simulate from "../components/Simulate.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/simulate",
    name: "Simulate",
    component: Simulate
  },
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
