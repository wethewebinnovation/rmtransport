<template>
  <v-main class="pa-4">
    <!-- Top bar -->
    <v-card border flat>
      <v-card-text>
        <div class="d-flex justify-end align-center">
          <v-spacer></v-spacer><v-spacer></v-spacer><v-spacer></v-spacer
          ><v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            label="Search products"
            hide-details
            variant="outlined"
            density="compact"
            class="me-4"
            prepend-inner-icon="mdi-magnify"
          />
          <v-btn flat class="rm-bg-add" @click="openAddProduct"
            >Add Product</v-btn
          >
        </div>
      </v-card-text>
    </v-card>

    <v-divider class="my-4"></v-divider>

    <!-- Products Table -->
    <v-card style="min-height: calc(80vh - 64px)" border flat>
      <v-data-table
        :headers="headers"
        :items="filteredProducts"
        item-key="id"
        style="min-height: calc(80vh - 64px)"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            class="rm-text-edit"
            size="small"
            @click="openEditProduct(item)"
            >mdi-pencil</v-icon
          >
          <v-icon
            class="rm-text-view mx-5"
            size="small"
            @click="openViewProduct(item)"
            >mdi-eye</v-icon
          >
          <v-icon
            class="rm-text-delete"
            size="small"
            @click="confirmDeleteProduct(item)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit Product Dialog -->
    <v-dialog v-model="productDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="rm-bg-primary">
          <span class="text-h6">{{
            editedProduct.id ? "Edit Product" : "Add Product"
          }}</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-form ref="form" v-model="formValid" lazy-validation>
            <v-text-field
              v-model="editedProduct.name"
              label="Product Type"
              :rules="[(v) => !!v || 'Product Type is required']"
              variant="outlined"
              density="compact"
              required
            />
            <v-textarea
              v-model="editedProduct.description"
              label="Description"
              variant="outlined"
              rows="3"
              density="compact"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="pb-6 pe-6">
          <v-spacer />
          <v-btn flat class="rm-bg-cancel" @click="closeProductDialog"
            >Cancel</v-btn
          >
          <v-btn
            flat
            class="rm-bg-add"
            @click="saveProduct"
            :disabled="!formValid"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Product Dialog -->
    <v-dialog v-model="viewDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title
          class="rm-bg-primary d-flex justify-space-between align-center"
        >
          Product Details <v-spacer></v-spacer>
          <v-icon @click="viewDialog = false">mdi-close</v-icon></v-card-title
        >
        <v-card-text>
          <p class="mb-2">
            <strong>Product Type:</strong> {{ viewedProduct.name }}
          </p>
          <p><strong>Description:</strong> {{ viewedProduct.description }}</p>
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
          Are you sure you want to delete product
          <strong>{{ deleteTarget.name }}</strong
          >?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn flat class="rm-bg-cancel" @click="deleteDialog = false"
            >Cancel</v-btn
          >
          <v-btn flat class="rm-bg-delete" @click="handleDeleteProduct"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="bottom"
      :timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-main>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted } from "vue";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/api.js"; // Adjust path as needed

const search = ref("");
const productDialog = ref(false);
const viewDialog = ref(false);
const deleteDialog = ref(false);
const formValid = ref(false);
const form = ref(null);

const products = ref([]);

// Snackbar state
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

const headers = [
  { title: "Product Type", value: "name", sortable: true },
  { title: "Description", value: "description", sortable: false },
  { title: "Actions", value: "actions", sortable: false, align: "center" },
];

const editedProduct = reactive({});
const viewedProduct = reactive({});
const deleteTarget = reactive({});

const filteredProducts = computed(() => {
  if (!search.value) return products.value;
  const s = search.value.toLowerCase();
  return products.value.filter(
    (p) =>
      p.name.toLowerCase().includes(s) ||
      (p.description && p.description.toLowerCase().includes(s))
  );
});

async function loadProducts() {
  try {
    const res = await getProducts();
    products.value = res.data;
  } catch {
    showSnackbar("Failed to load products", "error");
  }
}

function openAddProduct() {
  Object.keys(editedProduct).forEach((k) => delete editedProduct[k]);
  productDialog.value = true;
  nextTick(() => form.value?.resetValidation());
}

function openEditProduct(product) {
  Object.assign(editedProduct, product);
  productDialog.value = true;
  nextTick(() => form.value?.resetValidation());
}

function closeProductDialog() {
  productDialog.value = false;
}

async function saveProduct() {
  if (!form.value?.validate()) return;

  const trimmedName = editedProduct.name?.trim().toLowerCase();

  // Duplicate check
  const isDuplicate = products.value.some(
    (p) =>
      p.name.trim().toLowerCase() === trimmedName && p.id !== editedProduct.id
  );

  if (isDuplicate) {
    showSnackbar("❌ Product type already exists!", "error");
    return;
  }

  try {
    if (editedProduct.id) {
      await updateProduct(editedProduct.id, editedProduct);
      showSnackbar("✅ Product updated successfully!", "success");
    } else {
      await createProduct(editedProduct);
      showSnackbar("✅ Product added successfully!", "success");
    }
    await loadProducts();
    productDialog.value = false;
  } catch {
    showSnackbar("Failed to save product", "error");
  }
}

function openViewProduct(product) {
  Object.assign(viewedProduct, product);
  viewDialog.value = true;
}

function confirmDeleteProduct(product) {
  Object.assign(deleteTarget, product);
  deleteDialog.value = true;
}

async function handleDeleteProduct() {
  try {
    await deleteProduct(deleteTarget.id);
    showSnackbar("🗑️ Product deleted successfully!", "success");
    await loadProducts();
    deleteDialog.value = false;
  } catch {
    showSnackbar("Failed to delete product", "error");
  }
}

onMounted(() => {
  loadProducts();
});
</script>
