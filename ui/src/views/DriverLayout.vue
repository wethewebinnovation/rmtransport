<template>
  <v-main class="pa-4">
    <v-card border flat>
      <v-card-text>
        <div class="d-flex justify-end align-center">
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            label="Search drivers"
            hide-details
            variant="outlined"
            density="compact"
            class="me-4"
            prepend-inner-icon="mdi-magnify"
          /><v-btn flat class="rm-bg-add" @click="openAddDriver"
            >Add Driver</v-btn
          >
        </div>
      </v-card-text>
    </v-card>

    <v-divider class="my-4"></v-divider>

    <v-card style="min-height: calc(80vh - 64px)" border flat>
      <v-data-table
        :headers="headers"
        :items="filteredDrivers"
        item-key="id"
        style="min-height: calc(80vh - 64px)"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            class="rm-text-edit"
            size="small"
            @click="openEditDriver(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            class="rm-text-view mx-5"
            size="small"
            @click="openViewDriver(item)"
          >
            mdi-eye
          </v-icon>
          <v-icon
            class="rm-text-delete"
            size="small"
            @click="confirmDeleteDriver(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit Driver Dialog -->
    <v-dialog v-model="driverDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="rm-bg-primary">
          <span class="text-h6">{{
            editedDriver.id ? "Edit Driver" : "Add Driver"
          }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-form ref="form" v-model="formValid" lazy-validation>
            <v-text-field
              v-model="editedDriver.name"
              variant="outlined"
              density="compact"
              label="Driver Name"
              :rules="[(v) => !!v || 'Driver Name is required']"
              required
            />
            <v-text-field
              v-model="editedDriver.licenseNumber"
              label="License Number"
              variant="outlined"
              density="compact"
              :rules="[(v) => !!v || 'License Number is required']"
              required
            />
            <v-text-field
              v-model="editedDriver.driverNumber"
              variant="outlined"
              density="compact"
              label="Driver Number"
              maxlength="10"
              counter="10"
              :rules="[
                (v) => !!v || 'Driver Number is required',
                (v) => /^\d{10}$/.test(v) || 'Must be exactly 10 digits',
              ]"
              required
              @input="
                editedDriver.driverNumber = editedDriver.driverNumber.replace(
                  /[^0-9]/g,
                  ''
                )
              "
            />
            <v-textarea
              v-model="editedDriver.remarks"
              label="Remarks"
              rows="2"
              auto-grow
              variant="outlined"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="pb-6 pe-6">
          <v-spacer />
          <v-btn flat class="rm-bg-cancel" @click="closeDriverDialog"
            >Cancel</v-btn
          >
          <v-btn
            flat
            class="rm-bg-add"
            @click="saveDriver"
            :disabled="!formValid"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Driver Dialog -->
    <v-dialog v-model="viewDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title
          class="rm-bg-primary d-flex justify-space-between align-center"
        >
          <span class="text-h6">View Driver</span>
          <span class=""
            ><v-icon @click="viewDialog = false">mdi-close</v-icon></span
          >
        </v-card-title>
        <v-card-text>
          <div class="driver-details">
            <h3 class="mb-3">Driver Details :</h3>
            <div class="mb-2">
              <strong>Driver Name:</strong> {{ viewedDriver.name }}
            </div>
            <div class="mb-2">
              <strong>Driver Number:</strong> {{ viewedDriver.driverNumber }}
            </div>
            <div class="mb-2">
              <strong>License Number:</strong>
              <span v-if="viewedDriver.licenseNumber == true">{{
                viewedDriver.licenseNumber
              }}</span>
              <span v-else><em class="text-grey">No License Number</em></span>
            </div>
            <div><strong>Remarks:</strong> {{ viewedDriver.remarks }}</div>
          </div>
        </v-card-text>
        <!-- <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" @click="viewDialog = false">Close</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text-h6 rm-bg-delete">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete driver
          <strong>{{ deleteTarget.name }}</strong
          >?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn flat class="rm-bg-cancel" @click="deleteDialog = false"
            >Cancel</v-btn
          >
          <v-btn flat class="rm-bg-delete" @click="handleDeleteDriver"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted } from "vue";
import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from "@/api/api.js";

const search = ref("");
const driverDialog = ref(false);
const viewDialog = ref(false);
const deleteDialog = ref(false);
const formValid = ref(false);
const drivers = ref([]);

const headers = [
  { title: "Driver Name", value: "name", sortable: true },
  { title: "Driver Number", value: "driver_number", sortable: true },
  { title: "License Number", value: "license_number", sortable: true },
  { title: "Remarks", value: "remarks", sortable: true },
  { title: "Actions", value: "actions", sortable: false, align: "center" },
];

const editedDriver = reactive({});
const viewedDriver = reactive({});
const deleteTarget = reactive({});

const filteredDrivers = computed(() => {
  if (!search.value) return drivers.value;
  const s = search.value.toLowerCase();
  return drivers.value.filter(
    (d) =>
      d.name.toLowerCase().includes(s) ||
      d.driver_number.toLowerCase().includes(s) ||
      d.license_number.toLowerCase().includes(s) ||
      (d.remarks && d.remarks.toLowerCase().includes(s))
  );
});

const form = ref(null);

async function loadDrivers() {
  try {
    const res = await getDrivers();
    drivers.value = res.data;
  } catch {
    // handle error as needed
  }
}

function openAddDriver() {
  Object.keys(editedDriver).forEach((k) => delete editedDriver[k]);
  driverDialog.value = true;
  nextTick(() => form.value?.resetValidation());
}

function openEditDriver(driver) {
  Object.assign(editedDriver, driver);
  driverDialog.value = true;
  nextTick(() => form.value?.resetValidation());
}

function closeDriverDialog() {
  driverDialog.value = false;
}

async function saveDriver() {
  if (!form.value?.validate()) return;

  // Prepare payload matching backend keys
  const payload = {
    name: editedDriver.name,
    driver_number: editedDriver.driverNumber,
    license_number: editedDriver.licenseNumber,
    remarks: editedDriver.remarks || "",
  };

  try {
    if (editedDriver.id) {
      await updateDriver(editedDriver.id, payload);
      // Optionally notify success
    } else {
      await createDriver(payload);
      // Optionally notify success
    }
    await loadDrivers();
    driverDialog.value = false;
  } catch {
    // Handle save error
  }
}

function openViewDriver(driver) {
  Object.assign(viewedDriver, driver);
  viewDialog.value = true;
}

function confirmDeleteDriver(driver) {
  Object.assign(deleteTarget, driver);
  deleteDialog.value = true;
}

async function handleDeleteDriver() {
  try {
    await deleteDriver(deleteTarget.id);
    await loadDrivers();
    deleteDialog.value = false;
    // Optionally notify success
  } catch {
    // Handle delete error
  }
}

onMounted(() => {
  loadDrivers();
});
</script>
