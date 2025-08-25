<template>
  <v-main class="pa-4">
    <v-card border flat>
      <v-card-text>
        <div class="d-flex justify-end align-center">
          <v-spacer></v-spacer><v-spacer></v-spacer><v-spacer></v-spacer
          ><v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            label="Search lorries"
            hide-details
            variant="outlined"
            density="compact"
            class="me-4"
            prepend-inner-icon="mdi-magnify"
          />
          <v-btn flat class="rm-bg-add" @click="openAddLorry">Add Lorry</v-btn>
        </div>
      </v-card-text>
    </v-card>

    <v-divider class="my-4"></v-divider>

    <v-card style="min-height: calc(80vh - 64px)" border flat>
      <v-data-table
        :headers="headers"
        :items="filteredLorries"
        :search="search"
        item-key="id"
        style="min-height: calc(80vh - 64px)"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            class="rm-text-edit"
            size="small"
            @click.stop="openEditLorry(item)"
            >mdi-pencil</v-icon
          >
          <v-icon
            class="rm-text-view mx-5"
            size="small"
            @click.stop="openViewLorry(item)"
            >mdi-eye</v-icon
          >
          <v-icon
            class="rm-text-delete"
            size="small"
            @click.stop="confirmDeleteLorry(item)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit Lorry Dialog -->
    <v-dialog v-model="lorryDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="rm-bg-primary">{{
          editedLorry.id ? "Edit Lorry" : "Add Lorry"
        }}</v-card-title>
        <v-card-text class="pb-0">
          <v-form ref="form" v-model="formValid" lazy-validation>
            <v-text-field
              v-model="editedLorry.lorry_name"
              label="Lorry Name"
              :rules="[(v) => !!v || 'Lorry Name is required']"
              required
              variant="outlined"
              density="compact"
            />
            <v-text-field
              v-model="editedLorry.lorry_number"
              label="Lorry Number"
              :rules="[(v) => !!v || 'Lorry Number is required']"
              required
              variant="outlined"
              density="compact"
            />
            <v-text-field
              v-model="editedLorry.capacity"
              label="Capacity"
              :rules="[(v) => !!v || 'Capacity is required']"
              required
              variant="outlined"
              density="compact"
            />
            <v-textarea
              v-model="editedLorry.remarks"
              label="Remarks"
              rows="2"
              auto-grow
              variant="outlined"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="pb-6 pe-6">
          <v-spacer />
          <v-btn flat class="rm-bg-cancel" @click="closeLorryDialog"
            >Cancel</v-btn
          >
          <v-btn
            flat
            class="rm-bg-add"
            :disabled="!formValid"
            @click="saveLorry"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Lorry Dialog -->
    <v-dialog v-model="viewDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title
          class="rm-bg-primary d-flex justify-space-between align-center"
        >
          <span class="text-h6">View Lorry Details</span>
          <v-icon @click="viewDialog = false">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
          <div class="lorry-details">
            <h3 class="mb-3">Lorry Details :</h3>
            <div class="mb-2">
              <strong>Lorry Name:</strong> {{ viewedLorry.lorry_name }}
            </div>
            <div class="mb-2">
              <strong>Lorry Number:</strong> {{ viewedLorry.lorry_number }}
            </div>
            <div class="mb-2">
              <strong>Capacity:</strong> {{ viewedLorry.capacity }}
            </div>
            <div><strong>Remarks:</strong> {{ viewedLorry.remarks }}</div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text-h6 rm-bg-delete">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete lorry
          <strong>{{ deleteTarget.lorry_name }}</strong
          >?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn flat class="rm-bg-cancel" @click="deleteDialog = false"
            >Cancel</v-btn
          >
          <v-btn flat class="rm-bg-delete" @click="handleDeleteLorry"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-main>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted } from "vue";
import {
  getLorries,
  createLorry,
  updateLorry,
  deleteLorry,
} from "@/api/api.js";

const search = ref("");
const lorryDialog = ref(false);
const viewDialog = ref(false);
const deleteDialog = ref(false);
const formValid = ref(false);
const lorries = ref([]);

const headers = [
  { title: "Lorry Name", value: "lorry_name", sortable: true },
  { title: "Lorry Number", value: "lorry_number", sortable: true },
  { title: "Capacity", value: "capacity", sortable: true },
  { title: "Remarks", value: "remarks", sortable: true },
  { title: "Actions", value: "actions", sortable: false, align: "center" },
];

const editedLorry = reactive({});
const viewedLorry = reactive({});
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

const filteredLorries = computed(() => {
  if (!search.value) return lorries.value;
  const s = search.value.toLowerCase();
  return lorries.value.filter(
    (l) =>
      l.lorry_name.toLowerCase().includes(s) ||
      l.lorry_number.toLowerCase().includes(s) ||
      (l.capacity && l.capacity.toLowerCase().includes(s)) ||
      (l.remarks && l.remarks.toLowerCase().includes(s))
  );
});

const form = ref(null);

async function loadLorries() {
  try {
    const res = await getLorries();
    lorries.value = res.data;
  } catch {
    showSnackbar("Failed to load lorries", "error");
  }
}

function openAddLorry() {
  Object.keys(editedLorry).forEach((k) => delete editedLorry[k]);
  lorryDialog.value = true;
  nextTick(() => form.value?.resetValidation());
}

function openEditLorry(lorry) {
  Object.assign(editedLorry, lorry);
  lorryDialog.value = true;
  nextTick(() => form.value?.resetValidation());
}

function closeLorryDialog() {
  lorryDialog.value = false;
}

async function saveLorry() {
  if (!form.value?.validate()) return;

  const payload = {
    lorry_name: editedLorry.lorry_name,
    lorry_number: editedLorry.lorry_number,
    capacity: editedLorry.capacity,
    remarks: editedLorry.remarks || "",
  };
  console.log("Payload sent for lorry:", payload);
  try {
    if (editedLorry.id) {
      await updateLorry(editedLorry.id, payload);
      showSnackbar("Lorry updated successfully", "success");
    } else {
      await createLorry(payload);
      showSnackbar("Lorry created successfully", "success");
    }
    await loadLorries();
    lorryDialog.value = false;
  } catch (err) {
    showSnackbar(
      "Failed to save lorry: " + (err.response?.data?.error || err.message),
      "error"
    );
  }
}

function openViewLorry(lorry) {
  Object.assign(viewedLorry, lorry);
  viewDialog.value = true;
}

function confirmDeleteLorry(lorry) {
  Object.assign(deleteTarget, lorry);
  deleteDialog.value = true;
}

async function handleDeleteLorry() {
  try {
    await deleteLorry(deleteTarget.id);
    showSnackbar("Lorry deleted successfully", "success");
    await loadLorries();
    deleteDialog.value = false;
  } catch {
    showSnackbar("Failed to delete lorry", "error");
  }
}

onMounted(() => {
  loadLorries();
});
</script>
