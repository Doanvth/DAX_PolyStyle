import { createWebHistory, createRouter } from "vue-router";
import Home from "../pages/client/Home.vue";
import DefaultLayout from "../pages/client/DefaultLayout.vue";
import AdminLayout from "../pages/admin/AdminLayout.vue";
import Dashboard from "../pages/admin/Dasboard.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [{ path: "", component: Home }],
  },
  {
    path: "/admin",
    component: AdminLayout,
    children: [{ path: "/admin/dashboard", component: Dashboard }],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
