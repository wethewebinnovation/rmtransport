<template>
  <v-main class="pa-4">
    <v-card border flat>
      <v-card-text>
        <div class="d-flex justify-space-between align-center">
          <h2 class="mb-0">Trash - Deleted LR Bills</h2>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            label="Search"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            density="compact"
            class="me-4"
            hide-details
          ></v-text-field>
        </div>
      </v-card-text>
    </v-card>

    <v-divider class="my-4"></v-divider>

    <v-card style="min-height: calc(80vh - 64px)" border flat>
      <v-data-table
        :headers="headers"
        :items="filteredTrashBills"
        :search="search"
        style="min-height: calc(80vh - 64px)"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            icon="mdi-eye"
            size="small"
            class="mx-3 rm-text-view"
            @click="viewBill(item)"
          ></v-icon>
          <v-icon
            icon="mdi-backup-restore"
            size="small"
            class="mx-3 rm-text-add"
            @click="restoreBill(item)"
          ></v-icon>
          <v-icon
            icon="mdi-delete-forever"
            size="small"
            class="mx-3 rm-text-delete"
            @click="confirmPermanentDelete(item)"
          ></v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="900px" persistent>
      <v-card>
        <v-toolbar class="rm-bg-primary" flat>
          <v-toolbar-title>View Deleted LR Bill</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="viewDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-row dense>
            <!-- Column 1 -->
            <v-col cols="12" md="4">
              <h3 class="text-subtitle-1 mb-3">Basic Info</h3>
              <div><strong>LR Number:</strong> {{ viewedBill.lr_number }}</div>
              <div><strong>Date:</strong> {{ viewedBill.date }}</div>

              <h3 class="text-subtitle-1 mt-5 mb-3">From Party</h3>
              <div><strong>Name:</strong> {{ viewedBill.from_party }}</div>
              <div><strong>Place:</strong> {{ viewedBill.from_location }}</div>
              <div><strong>Mobile:</strong> {{ viewedBill.from_mobile }}</div>
              <div><strong>GSTIN:</strong> {{ viewedBill.from_gstin }}</div>
            </v-col>

            <!-- Column 2 -->
            <v-col cols="12" md="4">
              <h3 class="text-subtitle-1 mb-3">To Party</h3>
              <div><strong>Name:</strong> {{ viewedBill.to_party }}</div>
              <div><strong>Place:</strong> {{ viewedBill.to_location }}</div>
              <div><strong>Mobile:</strong> {{ viewedBill.to_mobile }}</div>
              <div><strong>GSTIN:</strong> {{ viewedBill.to_gstin }}</div>

              <h3 class="text-subtitle-1 mt-5 mb-3">Vehicle & Driver</h3>
              <div>
                <strong>Lorry:</strong> {{ viewedBill.lorry_type }} -
                {{ viewedBill.lorry_number }}
              </div>
              <div>
                <strong>Driver Name:</strong> {{ viewedBill.driver_name }}
              </div>
              <div>
                <strong>Driver Number:</strong> {{ viewedBill.driver_number }}
              </div>
            </v-col>

            <!-- Column 3 -->
            <v-col cols="12" md="4">
              <h3 class="text-subtitle-1 mb-3">Product Details</h3>
              <div
                v-for="(product, i) in viewedBill.products"
                :key="i"
                class="mb-3 pa-2"
                style="border: 1px solid #ddd; border-radius: 6px"
              >
                <div>
                  <strong>Product Type:</strong> {{ product.product_type }}
                </div>
                <div>
                  <strong>Description:</strong> {{ product.description }}
                </div>
                <div><strong>Quantity:</strong> {{ product.quantity }}</div>
                <div><strong>Amount:</strong> {{ product.amount }}</div>
                <div><strong>Discount:</strong> {{ product.discount }}</div>
              </div>

              <h3 class="text-subtitle-1 mt-5 mb-3">Summary</h3>
              <div>
                <strong>Total Amount:</strong> {{ viewedBill.total_amount }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Confirm Permanent Delete -->
    <v-dialog v-model="deleteDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text-h6 rm-bg-delete">
          Confirm Permanent Delete
        </v-card-title>
        <v-card-text>
          This will delete LR Bill
          <strong>{{ deleteTarget?.lr_number }}</strong> permanently. Are you
          sure?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="rm-bg-cancel" @click="deleteDialog = false"
            >Cancel</v-btn
          >
          <v-btn class="rm-bg-delete" @click="permanentDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import { getTrashedBills, restoreLrBill, deleteLrBill } from "@/api/api.js";

const search = ref("");
const trashBills = ref([]);
const viewDialog = ref(false);
const deleteDialog = ref(false);
const viewedBill = reactive({});
const deleteTarget = ref(null);

const headers = [
  { title: "LR Number", value: "lr_number" },
  { title: "Date", value: "date" },
  { title: "From", value: "from_customer_name" },
  { title: "To", value: "to_customer_name" },
  { title: "Total Amount", value: "total_amount" },
  { title: "Actions", value: "actions", sortable: false },
];

async function refreshTrash() {
  const res = await getTrashedBills();
  trashBills.value = res.data;
}

onMounted(refreshTrash);

// Computed: Search filtering, if desired
const filteredTrashBills = computed(() => {
  if (!search.value) return trashBills.value;
  const s = search.value.toLowerCase();
  return trashBills.value.filter(
    (b) =>
      (b.lr_number || "").toLowerCase().includes(s) ||
      (b.from_customer_name || "").toLowerCase().includes(s) ||
      (b.to_customer_name || "").toLowerCase().includes(s)
  );
});

// Actions
function viewBill(bill) {
  Object.assign(viewedBill, bill);
  viewDialog.value = true;
}

async function restoreBill(bill) {
  await restoreLrBill(bill.id); // REST API: restore
  await refreshTrash();
}

function confirmPermanentDelete(bill) {
  deleteTarget.value = bill;
  deleteDialog.value = true;
}

async function permanentDelete() {
  if (deleteTarget.value) {
    await deleteLrBill(deleteTarget.value.id);
    await refreshTrash();
  }
  deleteDialog.value = false;
}
</script>
