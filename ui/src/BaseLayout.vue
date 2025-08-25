<template>
  <v-app>
    <!-- Sidebar -->
    <v-navigation-drawer
      app
      v-model="drawer"
      color="grey-lighten-4"
      width="260"
      :rail="rail"
    >
      <!-- Brand Section -->
      <v-sheet class="pa-4 rm-bg-primary text-center d-flex align-center" dark>
        <v-icon size="30">mdi-truck-delivery-outline</v-icon>
        <div style="white-space: nowrap" class="text-h6 ms-4 font-weight-bold">
          {{ companyName }}
        </div>
      </v-sheet>

      <v-divider></v-divider>

      <!-- Menu Items -->
      <v-list nav dense>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :exact="item.to === '/'"
          :active="isActive(item)"
          :class="isActive(item) ? 'rm-bg-primary' : 'grey-darken-1'"
        >
          <template #prepend>
            <v-icon>
              {{ item.icon }}
            </v-icon>
          </template>
          <v-list-item-title
            v-if="!rail"
            :class="isActive(item) ? 'rm-bg-primary' : 'grey-darken-1'"
          >
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-app-bar app class="rm-bg-primary" dark>
      <v-app-bar-nav-icon @click="toggleRail" />
      <v-toolbar-title>{{ currentPageTitle }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Profile Menu -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn variant="text" v-bind="props" class="d-flex align-center">
            <v-avatar size="36" class="me-2"> </v-avatar>
            <span>{{ profileName }}</span>
            <v-icon right>mdi-menu-down</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>{{ profileName }}</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="logout">
            <v-icon class="me-2">mdi-logout</v-icon>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Page Content -->
    <v-main class="bg-grey-lighten-3" style="min-height: calc(100vh - 64px)">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api/api.js";

const router = useRouter();
const route = useRoute();

const drawer = ref(true);
const rail = ref(true);

const profileName = ref("User"); // default fallback
const companyName = ref("RM Regular Service");

onMounted(async () => {
  // Load company name from backend settings API
  try {
    const settingsRes = await api.get("settings");
    companyName.value = settingsRes.data.company_name || "RM Regular Service";
  } catch {
    companyName.value = "RM Regular Service";
  }

  // Load the current logged-in user's name from backend users API or from localStorage/session
  // You may have a user ID/token in localStorage or state. Example:
  // const userId = localStorage.getItem("userId");
  // For demo, we'll attempt to load the first user as profile:
  try {
    const usersRes = await api.get("users");
    if (usersRes.data && usersRes.data.length > 0)
      profileName.value = usersRes.data[0].username;
  } catch {
    // fallback: do nothing, profileName stays as is
  }
});

const menuItems = [
  { title: "Dashboard", to: "/", icon: "mdi-view-dashboard" },
  { title: "LR Bill", to: "/lr-bills", icon: "mdi-file-document-outline" },
  { title: "Customer", to: "/customers", icon: "mdi-account-group" },
  { title: "Product", to: "/products", icon: "mdi-package-variant" },
  { title: "Lorry", to: "/lorries", icon: "mdi-truck" },
  { title: "Driver", to: "/driver", icon: "mdi-account" },
  { title: "Trash", to: "/trash", icon: "mdi-trash-can-outline" },
  { title: "Settings", to: "/settings", icon: "mdi-cog-outline" },
];

const currentPageTitle = computed(() => {
  const item = menuItems.find((m) => m.to === route.path);
  return item ? item.title : "";
});

const isActive = (item) => {
  if (item.to === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(item.to);
};

function toggleRail() {
  rail.value = !rail.value;
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  // Optionally, remove user info etc.
  router.push("/login");
}
</script>
