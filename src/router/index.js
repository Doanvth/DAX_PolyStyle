import { createRouter, createWebHistory } from "vue-router";
// 1. ĐÃ XÓA import HomeView.vue không tồn tại

import Register from "@/views/auth/Register.vue";
import LoginView from "@/views/auth/Login.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import LayoutAdmin from "@/layouts/LayoutAdmin.vue";
import FranchiseView from "@/views/User/FranchiseView.vue";
import HomeView from "@/views/HomeView.vue";
import ContactSectionView from "@/views/User/ContactSectionView.vue";
import ShipingForm from "@/components/ShipingForm.vue";
import ShipingFormView from "@/views/User/ShipingFormView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
     {
      path: "/shiping-form", 
      component: ShipingFormView,
    },
    {
      path: "/admin",
      name: "admin",
      component: LayoutAdmin,
      children: [
      ],
    },
    {
      path: "/",
      component: UserLayout,
      children: [
        {
          path: "",
          name: "home",
          component: HomeView,
        },
        {
          path: "/register",
          name: "register",
          component: Register,
        },
        {
          path: "/login",
          name: "login",
          component: LoginView,
        },
        {
          path: "contact",
          name: "contact",
          component: ContactSectionView,
        },
        {
          path: "franchise",
          name: "franchise",
          component: FranchiseView,
        },

      ],
    },
  ],
});

export default router;