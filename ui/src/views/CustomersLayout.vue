<template>
  <v-main class="pa-4">
    <!-- Top bar with search and add button -->
    <v-card border flat>
      <v-card-text>
        <div class="d-flex justify-end align-center">
          <v-spacer></v-spacer><v-spacer></v-spacer><v-spacer></v-spacer
          ><v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            label="Search"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            density="compact"
            class="me-4"
            hide-details
          />
          <v-btn flat class="rm-bg-add" @click="openAddCustomer"
            >Add Customer</v-btn
          >
        </div>
      </v-card-text>
    </v-card>

    <v-divider class="my-4"></v-divider>

    <!-- Customers Data Table -->
    <v-card style="min-height: calc(80vh - 64px)" border flat>
      <v-data-table
        :headers="headers"
        :items="filteredCustomers"
        :search="search"
        item-key="id"
        style="min-height: calc(80vh - 64px)"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            class="rm-text-edit"
            size="small"
            @click.stop="openEditCustomer(item)"
            >mdi-pencil</v-icon
          >
          <v-icon
            class="rm-text-view mx-5"
            size="small"
            @click.stop="openViewCustomer(item)"
            >mdi-eye</v-icon
          >
          <v-icon
            class="me-5 rm-text-delete"
            @click.stop="confirmDeleteCustomer(item)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit Customer Dialog -->
    <v-dialog v-model="customerDialog" max-width="600px" persistent>
      <v-card>
        <v-toolbar class="rm-bg-primary" flat>
          <v-toolbar-title>{{
            editedCustomer.id ? "Edit Customer" : "New Customer"
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeCustomerDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pb-0">
          <v-form ref="form" v-model="formValid" lazy-validation>
            <v-row dense>
              <v-col cols="12">
                <h3 class="mb-3">Customer Info</h3>
                <v-text-field
                  v-model="editedCustomer.customer_name"
                  label="Customer Name / Company Name"
                  variant="outlined"
                  :rules="[(v) => !!v || 'Customer Name is required']"
                  required
                  density="compact"
                  class="mb-3"
                />
                <v-text-field
                  v-model="editedCustomer.mobile"
                  label="Mobile Number"
                  variant="outlined"
                  :rules="[
                    (v) => !!v || 'Mobile Number is required',
                    (v) => /^\d{10}$/.test(v) || 'Must be a 10-digit number',
                  ]"
                  @input="
                    editedCustomer.mobile = editedCustomer.mobile.replace(
                      /[^0-9]/g,
                      ''
                    )
                  "
                  maxlength="10"
                  required
                  density="compact"
                  class="mb-3"
                />
                <v-text-field
                  v-model="editedCustomer.gst_number"
                  label="GST Number"
                  type="tel"
                  variant="outlined"
                  :rules="[
                    (v) =>
                      !v ||
                      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(
                        v
                      ) ||
                      'Invalid GSTIN format',
                  ]"
                  density="compact"
                  class="mb-3"
                />
                <v-text-field
                  v-model="editedCustomer.place"
                  label="Place"
                  variant="outlined"
                  density="compact"
                  class="mb-3"
                />
                <v-textarea
                  v-model="editedCustomer.address"
                  label="Address"
                  variant="outlined"
                  density="compact"
                  rows="6"
                  class="mb-3"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pb-6 pe-6">
          <v-spacer></v-spacer>
          <v-btn
            flat
            class="rm-bg-cancel me-3"
            text
            @click="closeCustomerDialog"
            >Cancel</v-btn
          >
          <v-btn
            flat
            class="rm-bg-add"
            :disabled="!formValid"
            @click="saveCustomer"
          >
            {{ editedCustomer.id ? "Update" : "Create" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Customer Dialog -->
    <v-dialog v-model="viewDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title
          class="rm-bg-primary d-flex justify-space-between align-center"
        >
          View Customer <v-spacer></v-spacer>
          <v-icon @click="viewDialog = false">mdi-close</v-icon></v-card-title
        >
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="12">
              <h3 class="mb-3">Customer Details :</h3>
              <div class="mb-2">
                <strong>Name:</strong> {{ viewedCustomer.customer_name }}
              </div>
              <div class="mb-2">
                <strong>Mobile:</strong> {{ viewedCustomer.mobile }}
              </div>
              <div class="mb-2">
                <strong>Place:</strong> {{ viewedCustomer.place }}
              </div>
              <div class="mb-2">
                <strong>GST Number:</strong> {{ viewedCustomer.gst_number }}
              </div>
              <div><strong>Address:</strong> {{ viewedCustomer.address }}</div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Confirm Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text-h6 rm-bg-delete">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete customer
          <strong>{{ deleteTarget.customer_name }}</strong
          >?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat class="rm-bg-cancel" text @click="deleteDialog = false"
            >Cancel</v-btn
          >
          <v-btn flat class="rm-bg-delete" text @click="handleDeleteCustomer"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-main>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted } from "vue";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/api/api.js";

const search = ref("");
const customerDialog = ref(false);
const viewDialog = ref(false);
const deleteDialog = ref(false);
const formValid = ref(false);
const customers = ref([]);

const headers = [
  { title: "Customer Name", value: "customer_name", sortable: true },
  { title: "Mobile", value: "mobile", sortable: true },
  { title: "Place", value: "place", sortable: true },
  { title: "GST Number", value: "gst_number", sortable: true },
  { title: "Actions", value: "actions", sortable: false, align: "center" },
];

const editedCustomer = reactive({});
const viewedCustomer = reactive({});
const deleteTarget = reactive({});

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

const filteredCustomers = computed(() => {
  if (!search.value) return customers.value;
  const s = search.value.toLowerCase();
  return customers.value.filter(
    (c) =>
      c.customer_name.toLowerCase().includes(s) ||
      c.mobile.includes(search.value) ||
      (c.place && c.place.toLowerCase().includes(s)) ||
      (c.gst_number && c.gst_number.includes(search.value))
  );
});

const form = ref(null);

async function loadCustomers() {
  try {
    const res = await getCustomers();
    customers.value = res.data;
  } catch {
    showSnackbar("Failed to load customers", "error");
  }
}

function openAddCustomer() {
  Object.keys(editedCustomer).forEach((key) => delete editedCustomer[key]);
  customerDialog.value = true;
  nextTick(() => form.value?.resetValidation());
}

function openEditCustomer(customer) {
  Object.assign(editedCustomer, customer);
  customerDialog.value = true;
  nextTick(() => form.value?.resetValidation());
}

function closeCustomerDialog() {
  customerDialog.value = false;
}

async function saveCustomer() {
  if (!form.value?.validate()) return;

  // Validate uniqueness
  const mobileTrimmed = editedCustomer.mobile?.trim();
  const gstTrimmed = editedCustomer.gst_number?.trim();

  if (
    customers.value.some(
      (c) => c.mobile.trim() === mobileTrimmed && c.id !== editedCustomer.id
    )
  ) {
    showSnackbar("❌ This mobile number already exists!", "error");
    return;
  }

  if (
    gstTrimmed &&
    customers.value.some(
      (c) => c.gst_number?.trim() === gstTrimmed && c.id !== editedCustomer.id
    )
  ) {
    showSnackbar("❌ This GST number already exists!", "error");
    return;
  }

  try {
    if (editedCustomer.id) {
      await updateCustomer(editedCustomer.id, editedCustomer);
      showSnackbar("✅ Customer updated successfully!", "success");
    } else {
      await createCustomer(editedCustomer);
      showSnackbar("✅ Customer created successfully!", "success");
    }
    await loadCustomers();
    customerDialog.value = false;
  } catch {
    showSnackbar("Failed to save customer", "error");
  }
}

function openViewCustomer(customer) {
  Object.assign(viewedCustomer, customer);
  viewDialog.value = true;
}

function confirmDeleteCustomer(customer) {
  Object.assign(deleteTarget, customer);
  deleteDialog.value = true;
}

async function handleDeleteCustomer() {
  try {
    await deleteCustomer(deleteTarget.id);
    showSnackbar("🗑️ Customer deleted successfully!", "success");
    await loadCustomers();
    deleteDialog.value = false;
  } catch {
    showSnackbar("Failed to delete customer", "error");
  }
}

onMounted(() => {
  loadCustomers();
});
</script>
