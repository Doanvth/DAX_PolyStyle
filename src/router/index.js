import { createRouter, createWebHistory } from "vue-router";

import Register from "@/views/auth/Register.vue";
import LoginView from "@/views/auth/Login.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import LayoutAdmin from "@/layouts/LayoutAdmin.vue";
import FranchiseView from "@/views/User/FranchiseView.vue";
import ContactSectionView from "@/views/User/ContactSectionView.vue";
import ShipingFormView from "@/views/User/ShipingFormView.vue";

import ProfileView from "@/views/User/ProfileView.vue";
import UserDetails from "@/components/User/profile/UserDetails.vue";
import UserAddresses from "@/components/User/profile/UserAddresses.vue";
import UserOrders from "@/components/User/profile/UserOrders.vue";
import UserVouchers from "@/components/User/profile/UserVouchers.vue";
import AlbumView from "@/views/User/AlbumView.vue";
import AlbumDetails from "@/components/AlbumDetails.vue";
import ShoppingCart from "@/views/User/ShoppingCart.vue";
import HomePageView from "@/views/User/HomePageView.vue";
import ProductPageView from "@/views/User/ProductPageView.vue";
import NewsPageView from "@/views/User/NewsPageView.vue";
import ProductDetailPageView from "@/views/User/ProductDetailPageView.vue";
import CheckoutPage from "@/views/User/CheckoutPage.vue";
import OrderSuccessPage from "@/views/User/OrderSuccessPage.vue";
import Dasboard from "@/views/admin/Dasboard.vue";
import ProductManager from "@/views/admin/ProductManager.vue";
import CategoryManager from "@/views/admin/CategoryManager.vue";
import UserManager from "@/views/admin/UserManager.vue";
import OrderManager from "@/views/admin/OrderManager.vue";
import StoreManager from "@/views/admin/StoreManager.vue";
import ArticleManager from "@/views/admin/ArticleManager.vue";
import BannerManager from "@/views/admin/BannerManager.vue";
import RevenueManager from "@/views/admin/RevenueManager.vue";
import CollectionManager from "@/views/admin/CollectionManager.vue";

import AddCollection from "@/views/admin/AddCollection.vue";
import AddStore from "@/views/admin/AddStore.vue";
import AddCategory from "@/views/admin/AddCategory.vue";

import AddArticle from "@/views/admin/AddArticle.vue";
import AddBanner from "@/views/admin/AddBanner.vue";
import AddProduct from "@/views/admin/AddProduct.vue";


import AddDiscount from "@/views/admin/AddDiscount.vue";
import DiscountManage from "@/views/admin/DiscountManager.vue";
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
        { path: 'addproducts', name: "productsAdd", component: AddProduct },

        { path: "category", name: "category", component: CategoryManager },
        {
          path: "category/add",
          name: "category-add",
          component: AddCategory
        },

        { path: "user", name: "user", component: UserManager },

        { path: "order", name: "order", component: OrderManager },

        { path: "store", name: "store", component: StoreManager },
        {
          path: 'store/add',
          name: 'store-add',
          component: AddStore
        },
        {
          path: "collection",
          name: "collection",
          component: CollectionManager,
        },
        {
          path: "collection/add",
          name: "collection-add",
          component: AddCollection,
        },
        { path: "post", name: "post", component: ArticleManager },
        { path: 'addposts', name: 'PostCreate', component: AddArticle },
        {
          path: 'posts/edit/:id',
          name: 'PostEdit',
          component: AddArticle
        },
        { path: "banner", name: "banner", component: BannerManager },
        { path: 'addbanners', component: AddBanner },
        {
          path: 'banner/edit/:id',
          name: 'BannerEdit',
          component: AddBanner
        },
        { path: "revenue", name: "revenue", component: RevenueManager },
        { path: "discountManagers", name: "discountManagers", component: DiscountManage },
        { path: "adddiscounts", name: "addDiscounts", component: AddDiscount }
      ],
    },

    {
      path: "/",
      component: UserLayout,
      children: [
        {
          path: "",
          name: "home",
          component: HomePageView,
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
        {
          path: 'profile',
          component: ProfileView,
          children: [
            {
              path: '',
              name: 'ProfileDetails',
              component: UserDetails,
            },
            {
              path: 'addresses',
              name: 'ProfileAddresses',
              component: UserAddresses,
            },
            {
              path: 'orders',
              name: 'ProfileOrders',
              component: UserOrders,
            },
            {
              path: 'vouchers',
              name: 'ProfileVouchers',
              component: UserVouchers,
            },
          ],
        },
        {
          path: "album",
          name: "albumView",
          component: AlbumView,
        },
        {
          path: "albumDetail",
          name: "albumDetails",
          component: AlbumDetails,
        },
        {
          path: "shoppingCart",
          name: "ShoppingCarts",
          component: ShoppingCart,
        },
        {
          path: "ProductPageView",
          name: "ProductPageViews",
          component: ProductPageView,
        },
        {
          path: "NewsPageView",
          name: "NewsPageViews",
          component: NewsPageView,
        },
        {
          path: "ProductDetailPageView",
          name: "ProductDetailPageViews",
          component: ProductDetailPageView,
        },
        {
          path: "CheckoutPage",
          name: "CheckoutPages",
          component: CheckoutPage,
        },
        {
          path: "OrderSuccessPage",
          name: "OrderSuccessPages",
          component: OrderSuccessPage,
        },
      ],
    },
  ],
});

export default router;