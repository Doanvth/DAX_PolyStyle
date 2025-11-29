import { createRouter, createWebHistory } from "vue-router";
// 1. ĐÃ XÓA import HomeView.vue không tồn tại

import Register from "@/views/auth/Register.vue";
import LoginView from "@/views/auth/Login.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import LayoutAdmin from "@/layouts/LayoutAdmin.vue";

import ProductManager from "@/views/admin/ProductManager.vue";
import CategoryManager from "@/views/admin/CategoryManager.vue";
import UserManager from "@/views/admin/UserManager.vue";
import OrderManager from "@/views/admin/OrderManager.vue";
import StoreManager from "@/views/admin/StoreManager.vue";
import CollectionManager from "@/views/admin/CollectionManager.vue";
import ArticleManager from "@/views/admin/ArticleManager.vue";
import BannerManager from "@/views/admin/BannerManager.vue";
import RevenueManager from "@/views/admin/RevenueManager.vue";
import Dasboard from "@/views/admin/Dasboard.vue";

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

        { path: "", name: "dasboard", component: Dasboard },
        { path: "products", name: "products", component: ProductManager },
        { path: "category", name: "category", component: CategoryManager },
        { path: "user", name: "user", component: UserManager },
        { path: "order", name: "order", component: OrderManager },
        { path: "store", name: "store", component: StoreManager },
        {
          path: "collection",
          name: "collection",
          component: CollectionManager,
        },
        { path: "post", name: "post", component: ArticleManager },
        { path: "banner", name: "banner", component: BannerManager },
        { path: "revenue", name: "revenue", component: RevenueManager },

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