import { createRouter, createWebHistory } from "vue-router";
import BaseLayout from "@/BaseLayout.vue";

import Login from "@/views/LoginLayout.vue";
import Dashboard from "@/views/DashboardLayout.vue";
import LRBills from "@/views/LRBillsLayout.vue";
import Customers from "@/views/CustomersLayout.vue";
import Products from "@/views/ProductsLayout.vue";
import Lorry from "@/views/LorryLayout.vue";
import Driver from "@/views/DriverLayout.vue";
import Trash from "@/views/TrashLayout.vue";
import Settings from "@/views/SettingsLayout.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { layout: "none" },
  },
  {
    path: "/",
    component: BaseLayout,
    children: [
      { path: "", name: "Dashboard", component: Dashboard },
      { path: "lr-bills", name: "LR Bill", component: LRBills },
      { path: "customers", name: "Customer", component: Customers },
      { path: "products", name: "Product", component: Products },
      { path: "lorries", name: "Lorry", component: Lorry },
      { path: "driver", name: "Driver", component: Driver },
      { path: "trash", name: "Trash", component: Trash },
      { path: "settings", name: "Settings", component: Settings },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard (placed after router creation)
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem("isLoggedIn");

  if (!loggedIn && to.path !== "/login") {
    next("/login");
  } else {
    next();
  }
});

export default router;
