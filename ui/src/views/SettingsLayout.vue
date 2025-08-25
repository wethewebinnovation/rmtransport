<template>
  <v-main class="pa-4">
    <v-container>
      <h1 class="mb-6">Settings</h1>

      <!-- Company Details -->
      <v-card class="mb-6">
        <v-card-title>Company Details</v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <div class="mb-4 d-flex align-center justify-space-between">
            <div><strong>Company Name:</strong> {{ companyName }}</div>
            <v-btn flat class="rm-bg-view" @click="openDialog('company')">
              <v-icon left>mdi-pencil</v-icon>Edit
            </v-btn>
          </div>

          <div class="mb-4">
            <strong>Address:</strong>
            <div>{{ companyAddress }}</div>
          </div>

          <div class="mb-4">
            <strong>Phone Numbers:</strong>
            <div v-for="(phone, index) in companyPhones" :key="index">
              {{ phone }}
            </div>
          </div>

          <v-divider class="my-4"></v-divider>

          <div class="mb-2 d-flex align-center justify-space-between">
            <div><strong>Company GST Number:</strong> {{ companyGst }}</div>
            <v-btn flat class="rm-bg-view" @click="openDialog('companyGst')">
              <v-icon left>mdi-pencil</v-icon>Edit
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- User Account & Security -->
      <v-card class="mb-6">
        <v-card-title>User Account & Security</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div class="mb-4 d-flex align-center justify-space-between">
            <div><strong>Account Information:</strong> {{ profileName }}</div>
            <v-btn flat class="rm-bg-view" @click="openDialog('account')">
              <v-icon left>mdi-pencil</v-icon>Edit
            </v-btn>
          </div>

          <!-- <div class="mb-4 d-flex align-center justify-space-between">
            <div><strong>Change Password:</strong> ********</div>
            <v-btn flat class="rm-bg-view" @click="openDialog('password')">
              <v-icon left>mdi-lock</v-icon>Change
            </v-btn>
          </div> -->

          <div class="mb-4 d-flex align-center justify-space-between">
            <div>
              <strong>Manage Accounts:</strong> Manage multiple account
              credentials.
            </div>
            <div>
              <v-btn
                flat
                class="rm-bg-add mr-3"
                @click="openDialog('newAccount')"
              >
                <v-icon left>mdi-account-plus</v-icon>Create New
              </v-btn>
              <v-btn flat class="rm-bg-view" @click="openAccountsList">
                <v-icon left>mdi-eye</v-icon>View All
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Tax & Legal -->
      <v-card class="mb-6">
        <v-card-title>Tax & Legal</v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <div class="mb-4 d-flex align-center justify-space-between">
            <div>
              <div>
                GST Percentage (each for SGST & CGST): {{ gstPercentage }}%
              </div>
              <div>Include GST in Bills: {{ gstIncluded ? "Yes" : "No" }}</div>
            </div>
            <v-btn flat class="rm-bg-view" @click="openDialog('gst')">
              <v-icon left>mdi-pencil</v-icon>Edit
            </v-btn>
          </div>

          <v-divider class="my-4"></v-divider>

          <div>
            <div class="d-flex align-center justify-space-between mb-2">
              <div><strong>Terms & Conditions</strong></div>
              <v-btn flat class="rm-bg-view" @click="openDialog('terms')">
                <v-icon left>mdi-pencil</v-icon>Edit
              </v-btn>
            </div>
            <div class="text-body-2" style="white-space: pre-line">
              {{ termsConditions }}
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- EDIT DIALOG -->
      <v-dialog v-model="dialog.show" max-width="600px" persistent>
        <v-card>
          <v-toolbar class="rm-bg-primary" dark flat>
            <v-toolbar-title>{{ dialog.title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog.show = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <!-- COMPANY -->
            <template v-if="dialog.type === 'company'">
              <v-text-field
                v-model="editCompanyName"
                label="Company Name"
                variant="outlined"
              />
              <v-textarea
                v-model="editCompanyAddress"
                label="Company Address"
                variant="outlined"
                rows="3"
              />
              <div class="mt-3">
                <label class="v-label">Phone Numbers</label>
                <div
                  v-for="(phone, index) in editCompanyPhones"
                  :key="index"
                  class="d-flex align-center mb-2"
                >
                  <v-text-field
                    v-model="editCompanyPhones[index]"
                    label="Phone Number"
                    variant="outlined"
                    density="compact"
                    class="flex-grow-1"
                    type="tel"
                    maxlength="10"
                    :rules="[
                      (v) => !!v || 'Phone number is required',
                      (v) =>
                        /^\d{1,10}$/.test(v) ||
                        'Only digits allowed, max 10 numbers',
                    ]"
                  />
                  <v-btn
                    icon
                    color="red"
                    @click="removePhone(index)"
                    class="ml-2"
                    :disabled="editCompanyPhones.length === 1"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>
                <v-btn small color="primary" @click="addPhone"
                  >Add Phone Number</v-btn
                >
              </div>
            </template>
            <!-- COMPANY GST -->
            <template v-if="dialog.type === 'companyGst'">
              <v-text-field
                v-model="editCompanyGst"
                label="Company GST Number"
                variant="outlined"
              />
            </template>
            <!-- ACCOUNT -->
            <template v-if="dialog.type === 'account'">
              <v-text-field
                v-model="editUserName"
                label="User Name"
                variant="outlined"
              />
            </template>
            <!-- PASSWORD -->
            <template v-if="dialog.type === 'password'">
              <v-text-field
                v-model="oldPassword"
                label="Current Password"
                type="password"
                variant="outlined"
              />
              <v-text-field
                v-model="newPassword"
                label="New Password"
                type="password"
                variant="outlined"
              />
              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                type="password"
                variant="outlined"
              />
            </template>
            <!-- NEW ACCOUNT -->
            <template v-if="dialog.type === 'newAccount'">
              <v-text-field
                v-model="newUserName"
                label="New Username"
                variant="outlined"
                required
              />
              <v-text-field
                v-model="newUserPassword"
                label="Password"
                type="password"
                variant="outlined"
                required
              />
              <v-text-field
                v-model="newUserConfirmPassword"
                label="Confirm Password"
                type="password"
                variant="outlined"
                required
              />
            </template>
            <!-- GST SETTINGS -->
            <template v-if="dialog.type === 'gst'">
              <v-text-field
                v-model.number="editGstPercentage"
                label="GST Percentage (each for SGST & CGST)"
                type="number"
                min="0"
                max="30"
                required
                variant="outlined"
              />
              <v-switch
                v-model="editGstIncluded"
                color="primary"
                label="Include GST in Bills"
                hide-details
              ></v-switch>
            </template>
            <!-- TERMS -->
            <template v-if="dialog.type === 'terms'">
              <v-textarea
                v-model="editTermsConditions"
                rows="6"
                label="Edit Terms & Conditions"
                variant="outlined"
              />
            </template>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat text @click="dialog.show = false">Cancel</v-btn>
            <v-btn flat class="rm-bg-add" @click="saveDialog">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- ACCOUNTS LIST DIALOG -->
      <v-dialog v-model="accountsDialog" max-width="500px">
        <v-card>
          <v-toolbar class="rm-bg-primary" flat dark>
            <v-toolbar-title>Accounts List</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="accountsDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-list>
              <v-list-item v-for="(acc, i) in accountsList" :key="i">
                <v-list-item-title
                  ><strong>{{ acc.username }}</strong></v-list-item-title
                >
                <v-list-item-subtitle>
                  <v-text-field
                    :type="acc.showPassword ? 'text' : 'password'"
                    v-model="acc.password"
                    readonly
                    append-inner-icon="mdi-eye"
                    @click:append-inner="acc.showPassword = !acc.showPassword"
                    density="compact"
                    variant="outlined"
                  />
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Snackbar -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="3000"
      >
        {{ snackbar.text }}
      </v-snackbar>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import api from "@/api/api.js";

const companyName = ref("");
const companyAddress = ref("");
const companyGst = ref("");
const userName = ref("");
const termsConditions = ref("");
const companyPhones = ref([]);
const editCompanyPhones = ref([]);

const gstPercentage = ref();
const gstIncluded = ref(false);

const editCompanyName = ref("");
const editCompanyAddress = ref("");
const editCompanyGst = ref("");
const editUserName = ref("");
const editTermsConditions = ref("");
const editGstPercentage = ref();
const editGstIncluded = ref(false);

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const accountsDialog = ref(false);
const accountsList = ref([]);

const newUserName = ref("");
const newUserPassword = ref("");
const newUserConfirmPassword = ref("");

const profileName = ref(""); // default fallback

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

const dialog = reactive({ show: false, type: "", title: "" });

const snackbar = reactive({
  show: false,
  text: "",
  color: "success",
});

function showSnackbar(message, color = "success") {
  snackbar.text = message;
  snackbar.color = color;
  snackbar.show = true;
}

// Add phone input
function addPhone() {
  editCompanyPhones.value.push("");
}

// Remove phone input
function removePhone(index) {
  if (editCompanyPhones.value.length > 1) {
    editCompanyPhones.value.splice(index, 1);
  }
}

async function loadSettings() {
  try {
    const res = await api.get("settings");
    const data = res.data;
    companyName.value = data.company_name;
    companyAddress.value = data.company_address || "";
    companyGst.value = data.company_gst || ""; // Adjust property name as per your backend
    gstPercentage.value = Number(data.gst_percentage);
    gstIncluded.value = !!data.gst_included;
    termsConditions.value = data.terms_conditions || "";

    // Assuming phone numbers are stored as JSON array string in DB
    companyPhones.value = data.company_phones
      ? JSON.parse(data.company_phones)
      : [];
  } catch {
    showSnackbar("Failed to load settings", "error");
  }
}

onMounted(() => {
  loadSettings();
});

function openDialog(type) {
  dialog.type = type;
  dialog.show = true;
  switch (type) {
    case "company":
      dialog.title = "Edit Company Info";
      editCompanyName.value = companyName.value;
      editCompanyAddress.value = companyAddress.value;
      editCompanyPhones.value = [...companyPhones.value];
      if (editCompanyPhones.value.length === 0)
        editCompanyPhones.value.push("");
      break;
    case "companyGst":
      dialog.title = "Edit Company GST Number";
      editCompanyGst.value = companyGst.value;
      break;
    case "account":
      dialog.title = "Edit Account Information";
      editUserName.value = userName.value;
      break;
    case "password":
      dialog.title = "Change Password";
      oldPassword.value = "";
      newPassword.value = "";
      confirmPassword.value = "";
      break;
    case "newAccount":
      dialog.title = "Create New Account";
      newUserName.value = "";
      newUserPassword.value = "";
      newUserConfirmPassword.value = "";
      break;
    case "gst":
      dialog.title = "Edit GST Settings";
      editGstPercentage.value = gstPercentage.value;
      editGstIncluded.value = gstIncluded.value;
      break;
    case "terms":
      dialog.title = "Edit Terms & Conditions";
      editTermsConditions.value = termsConditions.value;
      break;
  }
}

async function saveDialog() {
  switch (dialog.type) {
    case "company":
      await saveCompanyInfo();
      break;
    case "companyGst":
      await saveCompanyGst();
      break;
    case "gst":
      await saveGstSettings();
      break;
    case "terms":
      await saveTermsConditions();
      break;
    case "newAccount":
      await saveNewAccount();
      break;
  }
  dialog.show = false;
}

async function saveCompanyInfo() {
  try {
    await api.put("settings", {
      company_name: editCompanyName.value,
      company_address: editCompanyAddress.value,
      company_phones: JSON.stringify(
        editCompanyPhones.value.filter((p) => p.trim() !== "")
      ),
      company_gst: companyGst.value,
      gst_percentage: gstPercentage.value,
      gst_included: gstIncluded.value,
      terms_conditions: termsConditions.value,
    });
    companyName.value = editCompanyName.value;
    companyAddress.value = editCompanyAddress.value;
    companyPhones.value = [
      ...editCompanyPhones.value.filter((p) => p.trim() !== ""),
    ];
    showSnackbar("Company info updated", "success");
  } catch {
    showSnackbar("Failed to update company info", "error");
  }
}

async function saveCompanyGst() {
  try {
    await api.put("settings", {
      company_name: companyName.value,
      company_address: companyAddress.value,
      company_gst: editCompanyGst.value,
      gst_percentage: gstPercentage.value,
      gst_included: gstIncluded.value,
      terms_conditions: termsConditions.value,
    });
    companyGst.value = editCompanyGst.value;
    showSnackbar("Company GST number updated", "success");
  } catch {
    showSnackbar("Failed to update company GST number", "error");
  }
}

async function saveGstSettings() {
  try {
    await api.put("settings", {
      company_name: companyName.value,
      company_address: companyAddress.value,
      company_gst: companyGst.value,
      gst_percentage: editGstPercentage.value,
      gst_included: editGstIncluded.value,
      terms_conditions: termsConditions.value,
    });
    gstPercentage.value = editGstPercentage.value;
    gstIncluded.value = editGstIncluded.value;
    showSnackbar("GST settings updated", "success");
  } catch {
    showSnackbar("Failed to update GST settings", "error");
  }
}

async function saveTermsConditions() {
  try {
    await api.put("settings", {
      company_name: companyName.value,
      company_address: companyAddress.value,
      company_gst: companyGst.value,
      gst_percentage: gstPercentage.value,
      gst_included: gstIncluded.value,
      terms_conditions: editTermsConditions.value,
    });
    termsConditions.value = editTermsConditions.value;
    showSnackbar("Terms & Conditions updated", "success");
  } catch {
    showSnackbar("Failed to update Terms & Conditions", "error");
  }
}

async function loadAccounts() {
  try {
    const res = await api.get("users");
    accountsList.value = res.data.map((u) => ({
      ...u,
      showPassword: false,
      password: "",
    }));
  } catch {
    showSnackbar("Failed to load accounts", "error");
  }
}

function openAccountsList() {
  loadAccounts();
  accountsDialog.value = true;
}

async function saveNewAccount() {
  if (
    !newUserName.value ||
    !newUserPassword.value ||
    !newUserConfirmPassword.value
  ) {
    showSnackbar("All fields are required!", "error");
    return;
  }
  if (newUserPassword.value !== newUserConfirmPassword.value) {
    showSnackbar("Passwords do not match!", "error");
    return;
  }
  try {
    await api.post("users/register", {
      username: newUserName.value,
      password: newUserPassword.value,
    });
    showSnackbar("New account created!", "success");
    dialog.show = false;
    loadAccounts();
  } catch (err) {
    if (err.response?.data?.error === "Username already exists") {
      showSnackbar("Username already exists!", "error");
    } else {
      showSnackbar("Failed to create account", "error");
    }
  }
}
</script>
