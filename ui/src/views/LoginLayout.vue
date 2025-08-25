<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="4">
        <v-card border flat>
          <h2 class="text-center pt-6 rm-text-primary">{{ companyName }}</h2>
          <v-card-title class="text-h6 text-center mb-3">Login</v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="isValid"
              lazy-validation
              @submit.prevent="login"
            >
              <v-text-field
                v-model="username"
                label="Username"
                :rules="usernameTouched ? usernameRules : []"
                required
                variant="outlined"
                clearable
                :error-messages="usernameError"
                @blur="usernameTouched = true"
                @keyup.enter="login"
              />

              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                :rules="passwordTouched ? passwordRules : []"
                required
                variant="outlined"
                clearable
                :error-messages="passwordError"
                @blur="passwordTouched = true"
                @keyup.enter="login"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="rm-bg-primary mb-3 py-5"
              :disabled="!canLogin"
              @click="login"
              block
              flat
            >
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/api/api.js"; // Adjust the path if needed

const router = useRouter();

const username = ref("");
const password = ref("");
const isValid = ref(false);
const form = ref(null);

const usernameTouched = ref(false);
const passwordTouched = ref(false);

const usernameError = ref("");
const passwordError = ref("");

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

// Validation rules: basic checks
const usernameRules = [
  (v) => !!v || "Username is required",
  (v) => (v && v.length >= 3) || "Username must be at least 3 characters",
];

const passwordRules = [
  (v) => !!v || "Password is required",
  (v) => (v && v.length >= 4) || "Password must be at least 4 characters",
];

// Enable login button only if fields are non-empty
const canLogin = computed(() => {
  return username.value.trim() !== "" && password.value.trim() !== "";
});

// Login function
async function login() {
  usernameTouched.value = true;
  passwordTouched.value = true;

  // Clear previous errors
  usernameError.value = "";
  passwordError.value = "";

  // Validate the form
  const valid = await form.value.validate();
  if (!valid) return;

  try {
    // Call backend API login endpoint
    const response = await api.post("auth/login", {
      username: username.value,
      password: password.value,
    });

    // On success, save login state and navigate
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", response.data.user.username);
    router.push("/");
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      const msg = error.response.data.error;
      if (msg.includes("User")) usernameError.value = msg;
      if (msg.includes("password")) passwordError.value = msg;
      if (!msg.includes("User") && !msg.includes("password")) {
        usernameError.value = msg;
      }
    } else {
      usernameError.value = "Server connection error";
    }
  }
}
</script>

<style>
.fill-height .v-row {
  height: 100vh !important;
}
</style>
