<template>
  <v-main class="pa-4">
    <v-card border flat>
      <v-card-text>
        <div class="d-flex justify-space-between align-center">
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-select
            v-model="paymentStatusFilter"
            :items="['Paid', 'To Pay', 'Return Paid']"
            label="Paid/To Pay/Return Paid"
            placeholder="Paid/To Pay/Return Paid"
            variant="outlined"
            density="compact"
            class="me-4"
            hide-details
            clearable
          ></v-select>
          <v-text-field
            v-model="search"
            label="Search"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            density="compact"
            class="me-4"
            hide-details
          ></v-text-field>
          <!-- <v-btn class="me-4 rm-bg-delete" @click="exportPDF">
            Export PDF <v-icon>mdi-file-pdf</v-icon>
          </v-btn>
          <v-btn class="me-4 rm-bg-add" @click="exportExcel">
            Export Excel <v-icon>mdi-file-excel</v-icon>
          </v-btn> -->
          <v-btn flat class="rm-bg-add" @click="openNewBillDialog"
            >New Bill</v-btn
          >
        </div>
      </v-card-text>
    </v-card>

    <v-divider class="my-4"></v-divider>

    <v-card style="min-height: calc(80vh - 64px)" border flat>
      <v-data-table
        :headers="headers"
        :items="filteredLrBills"
        :search="search"
        style="min-height: calc(80vh - 64px)"
      >
        <template v-slot:[`item.payment_status`]="{ item }">
          <v-chip
            :class="
              item.payment_status === 'Paid'
                ? 'rm-bg-yes'
                : item.payment_status === 'To Pay'
                ? 'rm-bg-no'
                : item.payment_status === 'Return Paid'
                ? 'rm-bg-warning'
                : ''
            "
            size="small"
            variant="tonal"
          >
            {{ item.payment_status }}
          </v-chip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            icon="mdi-pencil"
            size="small"
            class="rm-text-edit"
            @click="editLrBill(item.id)"
            title="Edit"
          ></v-icon>
          <v-icon
            icon="mdi-eye"
            size="small"
            class="mx-5 rm-text-view"
            @click="viewLrBill(item.id)"
            title="View"
          ></v-icon>
          <v-icon
            icon="mdi-delete"
            size="small"
            class="me-5 rm-text-delete"
            @click="confirmDelete(item.id)"
            title="Delete"
          ></v-icon>
          <v-icon
            icon="mdi-printer"
            size="small"
            class="me-5 rm-text-primary"
            @click="triggerPrint(item.id)"
            title="Print"
          ></v-icon>
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-icon
                size="small"
                v-bind="props"
                class="rm-text-secondary"
                icon="mdi-export-variant"
              ></v-icon>
            </template>
            <v-list>
              <v-list-item @click="exportPdfRow(item.id)">
                <v-list-item-title>
                  <v-icon icon="mdi-file-pdf-box" class="me-1"></v-icon>
                  Export PDF
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="exportExcelRow(item.id)">
                <v-list-item-title>
                  <v-icon icon="mdi-file-excel-box" class="me-1"></v-icon>
                  Export Excel
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" width="850px" persistent>
      <v-card>
        <v-toolbar class="rm-bg-primary" flat>
          <v-toolbar-title>
            {{ editedBill.id ? "Edit LR Bill" : "New LR Bill" }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text class="pb-0">
          <v-form ref="form" v-model="formValid" lazy-validation>
            <!-- LR Number (auto generated, readonly) -->
            <v-card flat border class="rm-bg-card"
              ><v-card-text>
                <v-row class="rm-bg-card">
                  <v-col class="pb-0">
                    <v-text-field
                      v-model="editedBill.lr_number"
                      label="LR Number"
                      readonly
                      hide-details
                      variant="outlined"
                      density="compact"
                      class="mb-3"
                    />
                  </v-col>
                  <v-col class="pb-0">
                    <v-text-field
                      label="Company GST Number"
                      v-model="companyGst"
                      :value="companyGst"
                      readonly
                      hide-details
                      variant="outlined"
                      density="compact"
                      class="mb-3"
                    />
                  </v-col>
                  <v-col class="pb-0">
                    <!-- Date Field -->
                    <v-text-field
                      v-model="editedBill.date"
                      label="Date"
                      type="date"
                      hide-details
                      variant="outlined"
                      density="compact"
                      class="mb-3"
                    />
                  </v-col>
                  <v-col cols="12" class="pt-0"
                    ><div>
                      <strong class="mb-3">Company Phone Number: </strong>
                      <template v-if="companyNumber && companyNumber.length">
                        <v-card flat border class="mt-2"
                          ><v-card-text>
                            <span v-if="typeof companyNumber === 'string'">{{
                              companyNumber
                            }}</span>
                            <span v-else>
                              <!-- If companyNumber is an array (multiple), join with commas -->
                              {{
                                Array.isArray(companyNumber)
                                  ? companyNumber.join(", ")
                                  : companyNumber
                              }}
                            </span>
                          </v-card-text></v-card
                        >
                      </template>
                      <span v-else>-</span>
                    </div></v-col
                  >
                </v-row>
              </v-card-text></v-card
            >

            <v-divider class="my-5"></v-divider>

            <!-- Two-column layout container -->
            <v-card flat border class="rm-bg-card"
              ><v-card-text>
                <v-row dense>
                  <!-- From Section -->
                  <v-col cols="12" md="6">
                    <h3 class="mb-4">From Customer</h3>
                    <v-combobox
                      v-model="editedBill.from_customer"
                      :items="customers.map((c) => c.customer_name)"
                      label="From Customer Name"
                      placeholder="Select or type From Customer"
                      :rules="[(v) => !!v || 'From Customer is required']"
                      required
                      density="compact"
                      class="mb-3"
                      clearable
                      variant="outlined"
                      allow-overflow
                      return-object="false"
                      persistent-hint="false"
                      hide-selected
                    />
                    <v-combobox
                      v-model="editedBill.from_location"
                      label="From Place"
                      placeholder="Type or select place"
                      :items="customerPlaces"
                      density="compact"
                      class="mb-3"
                      clearable
                      variant="outlined"
                      :rules="[(v) => !!v || 'From Place is required']"
                      required
                    />
                    <v-combobox
                      v-model="editedBill.from_mobile"
                      label="From Mobile Number"
                      type="tel"
                      placeholder="Type or select mobile number"
                      density="compact"
                      class="mb-3"
                      :items="customerMobiles"
                      maxlength="10"
                      clearable
                      variant="outlined"
                      :rules="[
                        (v) => !!v || 'From Mobile Number is required',
                        (v) =>
                          /^\d{10}$/.test(v) || 'Must be a 10-digit number',
                      ]"
                      required
                    />
                    <v-combobox
                      v-model="editedBill.from_customer_gst"
                      label="From GSTIN Number"
                      density="compact"
                      class="mb-3"
                      variant="outlined"
                      hint="Optional"
                      clearable
                    />
                  </v-col>
                  <!-- To Section -->
                  <v-col cols="12" md="6">
                    <h3 class="mb-4">To Customer</h3>
                    <v-combobox
                      v-model="editedBill.to_customer"
                      :items="customers.map((c) => c.customer_name)"
                      label="To Customer Name"
                      placeholder="Select or type To Customer"
                      :rules="[(v) => !!v || 'To Customer is required']"
                      required
                      density="compact"
                      class="mb-3"
                      clearable
                      variant="outlined"
                      allow-overflow
                    />
                    <v-combobox
                      v-model="editedBill.to_location"
                      label="To Place"
                      placeholder="Type or select place"
                      density="compact"
                      :items="customerPlaces"
                      class="mb-3"
                      clearable
                      variant="outlined"
                      :rules="[(v) => !!v || 'To Place is required']"
                      required
                    />
                    <v-combobox
                      v-model="editedBill.to_mobile"
                      label="To Mobile Number"
                      type="tel"
                      placeholder="Type or select mobile number"
                      density="compact"
                      :items="customerMobiles"
                      class="mb-3"
                      maxlength="10"
                      clearable
                      variant="outlined"
                      :rules="[
                        (v) => !!v || 'To Mobile Number is required',
                        (v) =>
                          /^\d{10}$/.test(v) || 'Must be a 10-digit number',
                      ]"
                      required
                    />
                    <v-combobox
                      v-model="editedBill.to_customer_gst"
                      label="To GSTIN Number"
                      density="compact"
                      class="mb-3"
                      hint="Optional"
                      variant="outlined"
                      clearable
                    />
                  </v-col>
                </v-row> </v-card-text
            ></v-card>

            <v-divider class="my-5"></v-divider>

            <!-- Lorry & Driver Details -->
            <v-card flat border class="rm-bg-card">
              <v-card-text>
                <h3 class="mb-4">Lorry & Driver Details</h3>
                <v-row dense>
                  <v-col
                    ><v-combobox
                      v-model="editedBill.lorry_name"
                      :items="lorries.map((l) => l.lorry_name)"
                      label="Select or type Lorry"
                      density="compact"
                      class="mb-3"
                      clearable
                      variant="outlined" />

                    <input type="hidden" v-model="editedBill.lorry_id"
                  /></v-col>
                  <v-col
                    ><v-combobox
                      v-model="editedBill.lorry_number"
                      label="Lorry Number"
                      placeholder="Type or select Lorry Number"
                      density="compact"
                      :items="lorryNumbers"
                      class="mb-3"
                      clearable
                      variant="outlined"
                  /></v-col>
                  <v-col
                    ><v-combobox
                      v-model="editedBill.driver_name"
                      :items="drivers.map((d) => d.name)"
                      label="Select or type Driver Name"
                      density="compact"
                      class="mb-3"
                      clearable
                      variant="outlined" /><input
                      type="hidden"
                      v-model="editedBill.driver_id"
                  /></v-col>
                  <v-col
                    ><v-combobox
                      v-model="editedBill.driver_number"
                      :items="drivers.map((d) => d.driver_number)"
                      label="Select or type Driver Number"
                      density="compact"
                      class="mb-3"
                      clearable
                      variant="outlined"
                  /></v-col>
                </v-row> </v-card-text
            ></v-card>

            <v-divider class="my-5"></v-divider>
            <!-- Products Details -->
            <v-card flat border class="rm-bg-card">
              <v-card-text>
                <h3 class="mb-4">Products Details :</h3>
                <!-- Product Cards -->
                <div
                  v-for="(product, index) in editedBill.products"
                  :key="index"
                  class="mb-4"
                >
                  <v-card border flat>
                    <v-row dense align="center" class="px-4 pt-4">
                      <v-col cols="12" md="4">
                        <v-combobox
                          variant="outlined"
                          v-model="product.product_name"
                          :items="products.map((p) => p.name)"
                          label="Select Product Type"
                          :rules="[(v) => !!v || 'Product Type is required']"
                          required
                          density="compact"
                          @change="(val) => onProductChange(index, val)"
                        />
                        <input type="hidden" v-model="product.product_id" />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          variant="outlined"
                          v-model="product.description"
                          label="Description"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          variant="outlined"
                          v-model.number="product.quantity"
                          label="Quantity"
                          type="number"
                          min="1"
                          :rules="[(v) => v > 0 || 'Quantity must be positive']"
                          required
                          density="compact"
                        />
                      </v-col>
                    </v-row>
                    <v-row dense align="center" class="px-4">
                      <v-col cols="12" md="4">
                        <v-text-field
                          variant="outlined"
                          v-model.number="product.amount"
                          label="Amount"
                          type="number"
                          min="0"
                          :rules="[
                            (v) => !!v || 'Enter the Amount',
                            (v) => v >= 0 || 'Amount cannot be negative',
                          ]"
                          required
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          variant="outlined"
                          v-model.number="product.discount"
                          label="Discount"
                          type="number"
                          min="0"
                          :rules="[
                            (v) => v >= 0 || 'Discount cannot be negative',
                          ]"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="1" class="mt-n6">
                        <v-btn
                          color="red"
                          size="x-small"
                          flat
                          icon
                          @click="removeProduct(index)"
                          v-if="editedBill.products.length > 1"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card>
                </div>
                <v-btn
                  class="rm-bg-add"
                  @click="addProduct"
                  elevation="2"
                  rounded
                >
                  Add Product
                </v-btn>
              </v-card-text>
            </v-card>

            <v-divider class="my-5"></v-divider>

            <!-- Amount Section -->
            <v-card flat border class="rm-bg-card">
              <v-card-text>
                <h3 class="mb-4">Amount :</h3>
                <div class="d-flex align-center">
                  <v-select
                    variant="outlined"
                    v-model="editedBill.payment_status"
                    label="Payment Status"
                    :items="paymentStatusOptions"
                    :rules="[(v) => !!v || 'Payment Status is required']"
                    required
                    hide-details
                    density="compact"
                    class="mr-3"
                  />
                  <v-text-field
                    v-model="editedBill.eway_bill_number"
                    label="E-way Bill Number"
                    variant="outlined"
                    hide-details
                    density="compact"
                    class="mr-3"
                  />
                  <v-chip
                    color="blue lighten-2"
                    text-color="white"
                    class="font-weight-bold mr-3"
                  >
                    Subtotal: {{ calculatedSubtotal }}
                  </v-chip>
                  <template v-if="gstIncluded && gstPercentage > 0">
                    <v-chip
                      color="orange lighten-2"
                      text-color="white"
                      class="font-weight-bold mr-3"
                    >
                      SGST ({{ gstPercentage }}%): {{ calculatedSGST }}
                    </v-chip>
                    <v-chip
                      color="orange lighten-2"
                      text-color="white"
                      class="font-weight-bold mr-3"
                    >
                      CGST ({{ gstPercentage }}%): {{ calculatedCGST }}
                    </v-chip>
                  </template>
                  <v-chip
                    color="green lighten-2"
                    text-color="white"
                    class="font-weight-bold mr-3"
                  >
                    Total Amount: {{ calculatedTotal }}
                  </v-chip>
                </div></v-card-text
              >
            </v-card>
            <v-divider class="my-5"></v-divider>
            <h3 class="mb-4">Address</h3>
            <v-card border elevation="0" class="mb-4">
              <v-card-text class="text-body-2">
                {{ companyAddress }}
              </v-card-text>
            </v-card>
          </v-form>
        </v-card-text>
        <v-card-actions class="pb-6 pe-6">
          <v-spacer></v-spacer>
          <v-btn class="rm-bg-cancel me-3" text @click="dialog = false"
            >Cancel</v-btn
          >
          <v-btn class="rm-bg-add" :disabled="!formValid" @click="submitBill">
            {{ editedBill.id ? "Update" : "Create" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Dialog -->
    <!-- <v-dialog v-model="viewDialog" max-width="900px" persistent>
      <v-card>
        <v-toolbar class="rm-bg-primary" flat>
          <v-toolbar-title>View LR Bill</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="viewDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="4">
              <h3 class="text-subtitle-1 mb-3">Basic Info</h3>
              <div><strong>LR Number:</strong> {{ viewedBill.lr_number }}</div>
              <div><strong>Date:</strong> {{ viewedBill.date }}</div>
              <div>
                <strong>E-Way Bill Number:</strong>
                {{ viewedBill.eway_bill_number }}
              </div>
              <h3 class="text-subtitle-1 mt-5 mb-3">From Customer</h3>
              <div>
                <strong>From Customer Name:</strong>
                {{ viewedBill.from_customer }}
              </div>
              <div><strong>Place:</strong> {{ viewedBill.from_location }}</div>
              <div><strong>Mobile:</strong> {{ viewedBill.from_mobile }}</div>
              <div>
                <strong>GSTIN:</strong> {{ viewedBill.from_customer_gst }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <h3 class="text-subtitle-1 mb-3">To Customer</h3>
              <div>
                <strong>To Customer Name:</strong> {{ viewedBill.to_customer }}
              </div>
              <div><strong>Place:</strong> {{ viewedBill.to_location }}</div>
              <div><strong>Mobile:</strong> {{ viewedBill.to_mobile }}</div>
              <div>
                <strong>GSTIN:</strong> {{ viewedBill.to_customer_gst }}
              </div>
              <h3 class="text-subtitle-1 mt-5 mb-3">Vehicle & Driver</h3>
              <div>
                <strong>Lorry:</strong> {{ viewedBill.lorry_name }} -
                {{ viewedBill.lorry_number }}
              </div>
              <div>
                <strong>Driver Name:</strong> {{ viewedBill.driver_name }}
              </div>
              <div>
                <strong>Driver Number:</strong> {{ viewedBill.driver_number }}
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <h3 class="text-subtitle-1 mb-3">Product Details</h3>
              <div
                v-for="(product, i) in viewedBill.products"
                :key="i"
                class="mb-3 pa-2"
                style="border: 1px solid #ddd; border-radius: 6px"
              >
                <div>
                  <strong>Product Type:</strong> {{ product.product_name }}
                </div>
                <div>
                  <strong>Description:</strong> {{ product.description }}
                </div>
                <div><strong>Quantity:</strong> {{ product.quantity }}</div>
                <div><strong>Amount:</strong> {{ product.amount }}</div>
                <div><strong>Discount:</strong> {{ product.discount }}</div>
              </div>
              <h3 class="text-subtitle-1 mt-5 mb-3">Financial Summary</h3>
              <div><strong>Subtotal:</strong> {{ viewedBillSubtotal }}</div>
              <template v-if="viewedBill.sgst_amount || viewedBill.cgst_amount">
                <div>
                  <strong>SGST:</strong> {{ viewedBill.sgst_amount || 0 }}
                </div>
                <div>
                  <strong>CGST:</strong> {{ viewedBill.cgst_amount || 0 }}
                </div>
              </template>
              <div>
                <strong>Total Amount:</strong> {{ viewedBill.total_amount }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog> -->
    <v-dialog v-model="viewDialog" max-width="1000px" persistent>
      <v-card class="rounded-xl">
        <!-- Header -->
        <v-toolbar class="rm-bg-primary" flat>
          <v-toolbar-title class="text-h6 font-weight-bold"
            >View LR Bill</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-btn icon @click="viewDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-row dense class="cards-height">
            <!-- Basic Info -->
            <v-col cols="12" md="4">
              <h3 class="text-subtitle-1 font-weight-medium mb-2">
                Billing Information :
              </h3>
              <v-card border flat class="pa-3 rounded">
                <div class="mb-2">
                  <strong>LR Number :</strong>
                  {{ viewedBill.lr_number }}
                </div>
                <div class="mb-2">
                  <strong>Date :</strong>
                  {{ viewedBill.date }}
                </div>
                <div>
                  <strong class="me-2">Payment Status:</strong>
                  <v-chip
                    :class="
                      viewedBill.payment_status === 'Paid'
                        ? 'rm-bg-yes'
                        : viewedBill.payment_status === 'To Pay'
                        ? 'rm-bg-no'
                        : viewedBill.payment_status === 'Return Paid'
                        ? 'rm-bg-warning'
                        : ''
                    "
                    size="small"
                    variant="tonal"
                  >
                    {{ viewedBill.payment_status }}
                  </v-chip>
                </div>
                <div>
                  <strong>E-Way Bill Number :</strong>
                  <span v-if="viewedBill.eway_bill_number === true">{{
                    viewedBill.eway_bill_number
                  }}</span>
                  <span class="text-caption text-grey ml-1" v-else
                    ><em>No E-Way Bill</em></span
                  >
                </div>
              </v-card>
            </v-col>

            <!-- From Customer -->
            <v-col cols="12" md="4">
              <h3 class="text-subtitle-1 font-weight-medium mb-2">
                From Customer
              </h3>
              <v-card border flat class="pa-3 rounded-lg">
                <div>
                  <strong>From Name :</strong> {{ viewedBill.from_customer }}
                </div>
                <div>
                  <strong>From Place :</strong> {{ viewedBill.from_location }}
                </div>
                <div>
                  <strong>From Mobile Number :</strong>
                  {{ viewedBill.from_mobile }}
                </div>
                <div>
                  <strong>From GSTIN No :</strong>
                  {{ viewedBill.from_customer_gst }}
                </div>
              </v-card>
            </v-col>

            <!-- To Customer -->
            <v-col cols="12" md="4">
              <h3 class="text-subtitle-1 font-weight-medium mb-2">
                To Customer
              </h3>
              <v-card border flat class="pa-3 rounded-lg">
                <div>
                  <strong>To Name:</strong> {{ viewedBill.to_customer }}
                </div>
                <div>
                  <strong>To Place:</strong> {{ viewedBill.to_location }}
                </div>
                <div>
                  <strong>To Mobile Number:</strong> {{ viewedBill.to_mobile }}
                </div>
                <div>
                  <strong>To GSTIN No:</strong>
                  {{ viewedBill.to_customer_gst }}
                </div>
              </v-card>
            </v-col>

            <!-- Vehicle & Driver -->
            <v-col cols="12" md="6">
              <h3 class="text-subtitle-1 font-weight-medium mb-2">
                Vehicle & Driver
              </h3>
              <v-card border flat class="pa-3 rounded-lg">
                <div>
                  <strong>Lorry Name :</strong>
                  {{ viewedBill.lorry_name || "Nill" }}
                </div>
                <div>
                  <strong>Lorry Number :</strong>
                  {{ viewedBill.lorry_number || "Nill" }}
                </div>
                <div>
                  <strong>Driver Name :</strong>
                  {{ viewedBill.driver_name || "Nill" }}
                </div>
                <div>
                  <strong>Driver Number :</strong>
                  {{ viewedBill.driver_number || "Nill" }}
                </div>
              </v-card>
            </v-col>

            <!-- Financial Summary -->
            <v-col cols="12" md="6">
              <h3 class="text-subtitle-1 font-weight-medium mb-2">
                Financial Summary
              </h3>
              <v-card border flat class="pa-3 rounded-lg">
                <div>
                  <strong>Subtotal</strong>
                  <em class="text-caption mx-1">(incl Discount)</em>
                  <strong>:</strong> {{ viewedBillSubtotal }}
                </div>
                <!-- <div><strong>Discount:</strong> {{ viewedBillDiscount }}</div> -->
                <template
                  v-if="viewedBill.sgst_amount || viewedBill.cgst_amount"
                >
                  <div>
                    <strong>SGST & CGST :</strong>
                    {{ viewedBill.sgst_amount || 0 }} +
                    {{ viewedBill.cgst_amount || 0 }}
                  </div>
                </template>
                <div class="text-h6 font-weight-bold">
                  <v-divider class="my-2"></v-divider>
                  Total : {{ viewedBill.total_amount }}
                </div>
              </v-card>
            </v-col>

            <!-- Product Details (Table) -->
            <v-col cols="12">
              <h3 class="text-subtitle-1 font-weight-medium mb-2">
                Product Details :
              </h3>
              <v-card border flat class="pa-3 rounded-lg">
                <v-table density="compact" fixed-header>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Amount</th>
                      <th>Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(product, i) in viewedBill.products" :key="i">
                      <td>{{ product.product_name }}</td>
                      <td>{{ product.description }}</td>
                      <td>{{ product.quantity }}</td>
                      <td>{{ product.amount }}</td>
                      <td>{{ product.discount }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Confirm Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="text-h6 rm-bg-delete">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this LR Bill?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="rm-bg-cancel" @click="deleteDialog = false"
            >Cancel</v-btn
          >
          <v-btn class="rm-bg-delete" @click="deleteBill">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const search = ref("");
const paymentStatusFilter = ref(null);
const dialog = ref(false);
const viewDialog = ref(false);
const deleteDialog = ref(false);

const formValid = ref(false);
const form = ref(null);

const termsConditions = ref("");
const gstPercentage = ref();
const gstIncluded = ref(false);
const companyGst = ref("");
const companyNumber = ref("");
const companyAddress = ref("");

const customers = ref([]);
const lorries = ref([]);
const drivers = ref([]);
const products = ref([]);

const paymentStatusOptions = ["Paid", "To Pay", "Return Paid"];

const headers = [
  { title: "LR Number", value: "lr_number" },
  { title: "Date", value: "date" },
  { title: "From Customer Name", value: "from_customer_name" },
  { title: "To Customer Name", value: "to_customer_name" },
  { title: "Total Amount", value: "total_amount" },
  { title: "Payment Status", value: "payment_status" },
  { title: "Actions", value: "actions", sortable: false },
];

const customerPlaces = computed(() =>
  Array.from(new Set(customers.value.map((c) => c.place).filter(Boolean)))
);
const customerMobiles = computed(() =>
  Array.from(new Set(customers.value.map((c) => c.mobile).filter(Boolean)))
);
const lorryNumbers = computed(() =>
  Array.from(new Set(lorries.value.map((l) => l.lorry_number).filter(Boolean)))
);

const lrBills = ref([]);
const filteredLrBills = computed(() => {
  if (!paymentStatusFilter.value) return lrBills.value;
  return lrBills.value.filter(
    (b) => b.payment_status === paymentStatusFilter.value
  );
});

function getISTDate() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istTime = new Date(utc + 330 * 60000);
  const year = istTime.getFullYear();
  const month = String(istTime.getMonth() + 1).padStart(2, "0");
  const day = String(istTime.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const editedBill = reactive({
  id: null,
  lr_number: "",
  date: getISTDate(),
  from_customer: "",
  from_customer_name: "",
  from_location: "",
  from_mobile: "",
  from_gstin: "",
  to_customer: "",
  to_customer_name: "",
  to_location: "",
  to_mobile: "",
  to_gstin: "",
  lorry_id: null,
  lorry_name: "",
  lorry_number: "",
  driver_id: null,
  driver_name: "",
  driver_number: "",
  payment_status: "To Pay",
  eway_bill_number: "",
  products: [
    {
      product_id: null,
      product_name: null,
      description: "",
      quantity: null,
      amount: null,
      discount: 0,
    },
  ],
  subtotal_amount: 0,
  sgst_amount: 0,
  cgst_amount: 0,
  total_amount: 0,
});

const viewedBill = reactive({});

const calculatedSubtotal = computed(() => {
  return editedBill.products.reduce((sum, p) => {
    let amt = Number(p.amount) || 0;
    let disc = Number(p.discount) || 0;
    return sum + (amt - disc);
  }, 0);
});
const calculatedSGST = computed(() => {
  if (!gstIncluded.value) return 0;
  return Math.round((calculatedSubtotal.value * gstPercentage.value) / 100);
});
const calculatedCGST = computed(() => {
  if (!gstIncluded.value) return 0;
  return Math.round((calculatedSubtotal.value * gstPercentage.value) / 100);
});
const calculatedTotal = computed(() => {
  let total = calculatedSubtotal.value;
  if (gstIncluded.value) {
    total += calculatedSGST.value + calculatedCGST.value;
  }
  return total;
});
const viewedBillSubtotal = computed(() => {
  if (!viewedBill.products || !Array.isArray(viewedBill.products)) return 0;
  return viewedBill.products.reduce((sum, p) => {
    let amt = Number(p.amount) || 0;
    let disc = Number(p.discount) || 0;
    return sum + (amt - disc);
  }, 0);
});
watch(
  [calculatedSubtotal, calculatedSGST, calculatedCGST, calculatedTotal],
  () => {
    editedBill.subtotal_amount = calculatedSubtotal.value;
    editedBill.sgst_amount = gstIncluded.value ? calculatedSGST.value : 0;
    editedBill.cgst_amount = gstIncluded.value ? calculatedCGST.value : 0;
    editedBill.total_amount = calculatedTotal.value;
  }
);

const settings = reactive({
  gst_percentage: "",
  companyGst: "",
  companyAddress: "",
  companyNumber: "",
  gst_included: false,
  terms_conditions: "",
});

onMounted(async () => {
  await fetchMasters();
  await fetchSettings();
  await fetchBills();
  termsConditions.value = settings.terms_conditions || defaultTerms();
});

async function fetchMasters() {
  try {
    const [custRes, lorryRes, driverRes, productRes] = await Promise.all([
      axios.get("/api/customers/"),
      axios.get("/api/lorries/"),
      axios.get("/api/drivers/"),
      axios.get("/api/products/"),
    ]);
    customers.value = custRes.data;
    lorries.value = lorryRes.data;
    drivers.value = driverRes.data;
    products.value = productRes.data;
  } catch (error) {
    console.error("Failed to fetch master data:", error);
  }
}

async function fetchSettings() {
  try {
    const res = await axios.get("/api/settings/");
    if (res.data) {
      settings.companyGst = res.data.company_gst || "";
      companyGst.value = res.data.company_gst || "";
      settings.gst_percentage = Number(res.data.gst_percentage) || 9;
      settings.gst_included = res.data.gst_included;
      settings.companyAddress = res.data.company_address || "";
      companyAddress.value = res.data.company_address || "";

      settings.companyNumber = res.data.company_phones || "";
      if (typeof settings.companyNumber === "string") {
        try {
          companyNumber.value = JSON.parse(settings.companyNumber);
        } catch {
          companyNumber.value = settings.companyNumber;
        }
      } else {
        companyNumber.value = settings.companyNumber;
      }

      settings.terms_conditions = res.data.terms_conditions || defaultTerms();
      gstPercentage.value = settings.gst_percentage;
      gstIncluded.value = settings.gst_included;
      termsConditions.value = settings.terms_conditions;
    }
  } catch (error) {
    console.error("Failed to fetch settings:", error);
  }
}

async function fetchBills() {
  try {
    const res = await axios.get("/api/lrBills?status=active");
    lrBills.value = res.data;
  } catch (error) {
    console.error("Failed to fetch LR bills:", error);
  }
}

async function openNewBillDialog() {
  try {
    const res = await axios.get("/api/lrBills/generateLrNumber");
    Object.assign(editedBill, {
      id: null,
      lr_number: res.data,
      date: getISTDate(),
      from_customer: "",
      from_customer_name: "",
      from_location: "",
      from_mobile: "",
      from_gstin: "",
      to_customer: "",
      to_customer_name: "",
      to_location: "",
      to_mobile: "",
      to_gstin: "",
      lorry_id: null,
      lorry_name: "",
      lorry_number: "",
      driver_id: null,
      driver_name: "",
      driver_number: "",
      payment_status: "To Pay",
      products: [
        {
          product_id: null,
          product_name: null,
          description: "",
          quantity: null,
          amount: null,
          discount: 0,
        },
      ],
      subtotal_amount: 0,
      sgst_amount: 0,
      cgst_amount: 0,
      total_amount: 0,
    });
    dialog.value = true;
  } catch (error) {
    console.error("Failed to generate LR Number:", error);
  }
}

function addProduct() {
  editedBill.products.push({
    product_id: null,
    product_name: null,
    description: "",
    quantity: null,
    amount: null,
    discount: 0,
  });
}
function removeProduct(index) {
  if (editedBill.products.length > 1) {
    editedBill.products.splice(index, 1);
  }
}
function onProductChange(idx, val) {
  const productObj = products.value.find((p) => p.name === val);
  editedBill.products[idx].product_id = productObj ? productObj.id : null;
  editedBill.products[idx].product_name = val;
}

watch(
  () => editedBill.lorry_name,
  (newVal) => {
    const lorryObj = lorries.value.find((l) => l.lorry_name === newVal);
    if (lorryObj) {
      editedBill.lorry_id = lorryObj.id;
      editedBill.lorry_number = lorryObj.lorry_number;
    } else {
      editedBill.lorry_id = null;
      editedBill.lorry_number = "";
    }
  }
);

watch(
  () => editedBill.driver_name,
  (newVal) => {
    const dObj = drivers.value.find((d) => d.name === newVal);
    if (dObj) {
      editedBill.driver_id = dObj.id;
      editedBill.driver_number = dObj.driver_number;
    } else {
      editedBill.driver_id = null;
      editedBill.driver_number = "";
    }
  }
);

watch(
  () => editedBill.from_customer,
  (newVal) => {
    const cust = customers.value.find((c) => c.customer_name === newVal);
    if (cust) {
      editedBill.from_customer_id = cust.id;
      editedBill.from_customer_name = cust.customer_name;
      editedBill.from_location = cust.place || "";
      editedBill.from_mobile = cust.mobile || "";
      editedBill.from_customer_gst = cust.gst_number || "";
    } else {
      editedBill.from_customer_id = null;
      editedBill.from_customer_name = newVal || "";
      editedBill.from_customer_gst = "";
    }
  }
);

watch(
  () => editedBill.to_customer,
  (newVal) => {
    const cust = customers.value.find((c) => c.customer_name === newVal);
    if (cust) {
      editedBill.to_customer_id = cust.id;
      editedBill.to_customer_name = cust.customer_name;
      editedBill.to_location = cust.place || "";
      editedBill.to_mobile = cust.mobile || "";
      editedBill.to_customer_gst = cust.gst_number || "";
    } else {
      editedBill.to_customer_id = null;
      editedBill.to_customer_name = newVal || "";
      editedBill.to_customer_gst = "";
    }
  }
);

async function submitBill() {
  if (!form.value.validate()) return;
  try {
    editedBill.products.forEach((p) => {
      if (p.product_name) {
        const prod = products.value.find((pr) => pr.name === p.product_name);
        p.product_id = prod ? prod.id : null;
      } else {
        p.product_id = null;
        p.product_name = "";
      }
    });

    editedBill.from_customer_place = editedBill.from_location || "";
    editedBill.from_customer_mobile = editedBill.from_mobile || "";
    editedBill.to_customer_place = editedBill.to_location || "";
    editedBill.to_customer_mobile = editedBill.to_mobile || "";

    if (editedBill.date) {
      const d = new Date(editedBill.date);
      const pad = (n) => String(n).padStart(2, "0");
      editedBill.date =
        d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    } else {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      editedBill.date =
        now.getFullYear() +
        "-" +
        pad(now.getMonth() + 1) +
        "-" +
        pad(now.getDate());
    }

    if (editedBill.id) {
      await axios.put(`/api/lrBills/${editedBill.id}`, editedBill);
    } else {
      await axios.post("/api/lrBills/", editedBill);
    }
    await fetchBills();
    dialog.value = false;
    triggerPrint(editedBill.id);
  } catch (error) {
    console.error("Failed to save LR Bill:", error);
  }
}

async function editLrBill(id) {
  try {
    const { data: bill } = await axios.get(`/api/lrBills/${id}`);
    Object.assign(editedBill, bill, {
      date:
        bill.date && bill.date.length >= 10
          ? bill.date.slice(0, 10)
          : new Date().toISOString().substr(0, 10),
    });
    editedBill.from_customer =
      bill.from_customer_name || bill.from_customer || "";
    editedBill.from_location =
      bill.from_customer_place || bill.from_location || "";
    editedBill.from_mobile =
      bill.from_customer_mobile || bill.from_mobile || "";
    editedBill.from_customer_gst = bill.from_customer_gst || "";
    editedBill.to_customer = bill.to_customer_name || bill.to_customer || "";
    editedBill.to_location = bill.to_customer_place || bill.to_location || "";
    editedBill.to_mobile = bill.to_customer_mobile || bill.to_mobile || "";
    editedBill.to_customer_gst = bill.to_customer_gst || "";
    editedBill.lorry_name = bill.lorry_name || "";
    editedBill.lorry_number = bill.lorry_number || "";
    editedBill.driver_name = bill.driver_name || "";
    editedBill.driver_number = bill.driver_number || "";
    if (Array.isArray(bill.products)) {
      bill.products.forEach((p) => {
        if (!p.product_name && p.product_id) {
          const prod = products.value.find((pr) => pr.id === p.product_id);
          if (prod) p.product_name = prod.name;
        }
      });
      editedBill.products = bill.products;
    } else {
      editedBill.products = [
        {
          product_id: null,
          product_name: null,
          description: "",
          quantity: null,
          amount: null,
          discount: 0,
        },
      ];
    }
    dialog.value = true;
  } catch (error) {
    console.error("Failed to fetch LR Bill details for editing:", error);
  }
}

async function viewLrBill(id) {
  try {
    const { data: bill } = await axios.get(`/api/lrBills/${id}`);
    const vBill = { ...bill };
    vBill.from_customer = bill.from_customer_name || bill.from_customer || "";
    vBill.from_location = bill.from_customer_place || bill.from_location || "";
    vBill.from_mobile = bill.from_customer_mobile || bill.from_mobile || "";
    vBill.from_customer_gst = bill.from_customer_gst || "";
    vBill.to_customer = bill.to_customer_name || bill.to_customer || "";
    vBill.to_location = bill.to_customer_place || bill.to_location || "";
    vBill.to_mobile = bill.to_customer_mobile || bill.to_mobile || "";
    vBill.to_gstin = bill.to_customer_gst || bill.to_gstin || "";
    vBill.to_customer_gst = bill.to_customer_gst || "";
    vBill.lorry_name = bill.lorry_name || "";
    vBill.lorry_number = bill.lorry_number || "";
    vBill.driver_name = bill.driver_name || "";
    vBill.driver_number = bill.driver_number || "";
    if (Array.isArray(bill.products)) {
      bill.products.forEach((p) => {
        if (!p.product_name && p.product_id) {
          const prod = products.value.find((pr) => pr.id === p.product_id);
          if (prod) p.product_name = prod.name;
        }
      });
      vBill.products = bill.products;
    } else {
      vBill.products = [];
    }
    Object.assign(viewedBill, vBill);
    viewDialog.value = true;
  } catch (error) {
    console.error("Failed to fetch LR Bill details for viewing:", error);
  }
}

import { trashLrBill } from "@/api/api.js";

let deleteId = null;
function confirmDelete(id) {
  deleteId = id;
  deleteDialog.value = true;
}
async function deleteBill() {
  try {
    await trashLrBill(deleteId);
    await fetchBills();
  } catch (error) {
    console.error("Failed to move LR Bill to trash:", error);
  }
  deleteDialog.value = false;
}

function exportExcelRow(rowId) {
  const bill = lrBills.value.find((b) => b.id === rowId);
  if (!bill) return;
  const productsArr = Array.isArray(bill.products) ? bill.products : [];
  const flatRow = {
    "LR Number": bill.lr_number || "",
    Date: bill.date || "",
    "From Customer": bill.from_customer_name || "",
    "From Place": bill.from_customer_place || "",
    "From Mobile": bill.from_customer_mobile || "",
    "From GSTIN": bill.from_customer_gst || "",
    "To Customer": bill.to_customer_name || "",
    "To Place": bill.to_customer_place || "",
    "To Mobile": bill.to_customer_mobile || "",
    "To GSTIN": bill.to_customer_gst || "",
    "Lorry Name": bill.lorry_name || "",
    "Lorry Number": bill.lorry_number || "",
    "Driver Name": bill.driver_name || "",
    "Driver Number": bill.driver_number || "",
    "Payment Status": bill.payment_status || "",
    Products: productsArr
      .map((p, idx) => {
        let prodName = p.product_name;
        if (!prodName && p.product_id) {
          const prodObj = products.value.find((pr) => pr.id === p.product_id);
          prodName = prodObj ? prodObj.name : "";
        }
        return `${idx + 1}) ${prodName} - ${p.description || ""} (Qty: ${
          p.quantity || 0
        }, Amt: ${p.amount || 0}, Disc: ${p.discount || 0})`;
      })
      .join("\n"),
    "Subtotal Amount": bill.subtotal_amount || 0,
    "SGST Amount": bill.sgst_amount || 0,
    "CGST Amount": bill.cgst_amount || 0,
    "Total Amount": bill.total_amount || 0,
    "Terms and Conditions": termsConditions.value || "",
  };
  const ws = XLSX.utils.json_to_sheet([flatRow]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "LR Bill");
  XLSX.writeFile(wb, `LR_Bill_${bill.lr_number || bill.id}.xlsx`);
}

async function exportPdfRow(rowId) {
  const bill = lrBills.value.find((b) => b.id === rowId);
  let fullBill = bill;
  try {
    const { data } = await axios.get(`/api/lrBills/${rowId}`);
    fullBill = data;
  } catch (e) {
    fullBill.products = bill.products || [];
  }

  const doc = new jsPDF();
  doc.setFont("NotoSansTamil"); // Tamil-compatible font
  doc.setFontSize(14);

  // Header
  doc.setFontSize(18);
  doc.text("R.M. Transport", 105, 15, { align: "center" });
  doc.setFontSize(10);
  doc.text(
    "59, Ram Nagar 4th Street, Opp Balaji Road Lines, Tirupur-641602",
    105,
    22,
    { align: "center" }
  );
  doc.text("Phone: 9443700057 / 9894744433 / 9003344433", 105, 27, {
    align: "center",
  });

  // Section: Bill Info
  doc.setFontSize(12);
  doc.setDrawColor(0);
  doc.setFillColor(230, 230, 250);
  doc.rect(14, 35, 182, 8, "F");
  doc.text("LR Bill Details", 16, 41);

  let startY = 50;
  doc.setFontSize(11);
  doc.text(`LR Number : ${fullBill.lr_number || ""}`, 14, startY);
  doc.text(`Date : ${fullBill.date || ""}`, 150, startY);
  startY += 8;

  // From Party
  doc.setFontSize(12);
  doc.text("From :", 14, startY);
  doc.setFontSize(10);
  doc.text(
    `${fullBill.from_customer_name || ""}, ${
      fullBill.from_customer_place || ""
    }`,
    14,
    startY + 6
  );
  doc.text(`Phone: ${fullBill.from_customer_mobile || ""}`, 14, startY + 12);
  doc.text(`GSTIN: ${fullBill.from_customer_gst || "-"}`, 14, startY + 18);

  // To Party
  doc.setFontSize(12);
  doc.text("To :", 110, startY);
  doc.setFontSize(10);
  doc.text(
    `${fullBill.to_customer_name || ""}, ${fullBill.to_customer_place || ""}`,
    110,
    startY + 6
  );
  doc.text(`Phone: ${fullBill.to_customer_mobile || ""}`, 110, startY + 12);
  doc.text(`GSTIN: ${fullBill.to_customer_gst || "-"}`, 110, startY + 18);

  startY += 30;

  // Lorry & Driver
  doc.setFontSize(11);
  doc.text(`Lorry Name: ${fullBill.lorry_name || "Nill"}`, 14, startY);
  doc.text(`Lorry Number: ${fullBill.lorry_number || "Nill"}`, 14, startY + 6);

  doc.text(`Driver Name: ${fullBill.driver_name || "Nill"}`, 110, startY);
  doc.text(
    `Driver Number: ${fullBill.driver_number || "Nill"}`,
    110,
    startY + 6
  );

  startY += 12; // move cursor down for next section

  // Products Table
  const productsArr = Array.isArray(fullBill.products) ? fullBill.products : [];
  autoTable(doc, {
    startY: startY + 10,
    head: [["#", "Product Name", "Description", "Qty", "Rate", "Amount"]],
    body: productsArr.map((p, idx) => [
      idx + 1,
      p.product_name || "",
      p.description || "",
      p.quantity || "",
      p.rate || "",
      p.amount || "",
    ]),
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [52, 152, 219] },
    theme: "grid",
    margin: { left: 14, right: 14 },
  });

  const tableEndY = doc.lastAutoTable.finalY || startY + 20;

  // Payment Info
  doc.setFontSize(11);
  doc.text(
    `Payment Status: ${fullBill.payment_status || ""}`,
    14,
    tableEndY + 8
  );
  doc.text(`Total Amount: ₹ ${fullBill.total_amount || 0}`, 150, tableEndY + 8);

  // Terms & Conditions
  doc.setFontSize(10);
  doc.text("Terms and Conditions:", 14, tableEndY + 18);
  const termsText = termsConditions.value || defaultTerms();
  const splitTerms = doc.splitTextToSize(termsText, 180);
  doc.setFontSize(9);
  doc.text(splitTerms, 14, tableEndY + 24);

  doc.save(`LR_Bill_${fullBill.lr_number || fullBill.id}.pdf`);
}

// function exportExcel() {
//   const flatData = lrBills.value.map((bill) => {
//     const productsArr = Array.isArray(bill.products) ? bill.products : [];
//     return {
//       "LR Number": bill.lr_number || "",
//       Date: bill.date || "",
//       "From Customer": bill.from_customer_name || "",
//       "From Place": bill.from_customer_place || "",
//       "From Mobile": bill.from_customer_mobile || "",
//       "From GSTIN": bill.from_customer_gst || "",
//       "To Customer": bill.to_customer_name || "",
//       "To Place": bill.to_customer_place || "",
//       "To Mobile": bill.to_customer_mobile || "",
//       "To GSTIN": bill.to_customer_gst || "",
//       "Lorry Name": bill.lorry_name || "",
//       "Lorry Number": bill.lorry_number || "",
//       "Driver Name": bill.driver_name || "",
//       "Driver Number": bill.driver_number || "",
//       "Payment Status": bill.payment_status || "",
//       Products: productsArr
//         .map((p, idx) => {
//           let prodName = p.product_name;
//           if (!prodName && p.product_id) {
//             const prodObj = products.value.find((pr) => pr.id === p.product_id);
//             prodName = prodObj ? prodObj.name : "";
//           }
//           return `${idx + 1}) ${prodName} - ${p.description || ""} (Qty: ${
//             p.quantity || 0
//           }, Amt: ${p.amount || 0}, Disc: ${p.discount || 0})`;
//         })
//         .join("\n"),
//       "Subtotal Amount": bill.subtotal_amount || 0,
//       "SGST Amount": bill.sgst_amount || 0,
//       "CGST Amount": bill.cgst_amount || 0,
//       "Total Amount": bill.total_amount || 0,
//       "Terms and Conditions": termsConditions.value || "",
//     };
//   });
//   const ws = XLSX.utils.json_to_sheet(flatData);
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "LR Bills");
//   XLSX.writeFile(wb, "LR_Bills_Detailed.xlsx");
// }

// async function exportPDF() {
//   const doc = new jsPDF();
//   doc.setFontSize(18);
//   doc.text("LR Bills Detailed Report", 14, 15);
//   for (let i = 0; i < lrBills.value.length; i++) {
//     const bill = lrBills.value[i];
//     let fullBill = bill;
//     try {
//       const { data } = await axios.get(`/api/lrBills/${bill.id}`);
//       fullBill = data;
//       if (Array.isArray(fullBill.products)) {
//         fullBill.products.forEach((p) => {
//           if (!p.product_name && p.product_id) {
//             const prod = products.value.find((pr) => pr.id === p.product_id);
//             if (prod) p.product_name = prod.name;
//           }
//         });
//       }
//     } catch (e) {
//       fullBill.products = [];
//     }
//     const productsArr = Array.isArray(fullBill.products)
//       ? fullBill.products
//       : [];
//     let startY = i === 0 ? 25 : doc.lastAutoTable.finalY + 20;
//     if (startY > 250) {
//       doc.addPage();
//       startY = 20;
//     }
//     doc.setFontSize(12);
//     doc.text(`LR Number: ${fullBill.lr_number || ""}`, 14, startY);
//     doc.text(`Date: ${fullBill.date || ""}`, 150, startY);
//     startY += 6;
//     doc.text(
//       `From: ${fullBill.from_customer_name || ""} (${
//         fullBill.from_customer_place || ""
//       }), Mob: ${fullBill.from_customer_mobile || ""}`,
//       14,
//       startY
//     );
//     startY += 6;
//     doc.text(`From GSTIN: ${fullBill.from_customer_gst || "-"}`, 14, startY);
//     startY += 6;
//     doc.text(
//       `To: ${fullBill.to_customer_name || ""} (${
//         fullBill.to_customer_place || ""
//       }), Mob: ${fullBill.to_customer_mobile || ""}`,
//       14,
//       startY
//     );
//     startY += 6;
//     doc.text(`To GSTIN: ${fullBill.to_customer_gst || "-"}`, 14, startY);
//     startY += 6;
//     doc.text(
//       `Lorry: ${fullBill.lorry_name || ""} - ${fullBill.lorry_number || ""}`,
//       14,
//       startY
//     );
//     doc.text(
//       `Driver: ${fullBill.driver_name || ""} (${fullBill.driver_number || ""})`,
//       100,
//       startY
//     );
//     startY += 8;
//     autoTable(doc, {
//       startY: startY,
//       head: [
//         ["#", "Product Name", "Description", "Quantity", "Amount", "Discount"],
//       ],
//       body: productsArr.map((p, idx) => [
//         idx + 1,
//         p.product_name || "",
//         p.description || "",
//         p.quantity || "",
//         p.amount || "",
//         p.discount || "",
//       ]),
//       theme: "striped",
//       styles: { fontSize: 8, cellPadding: 2 },
//       headStyles: { fillColor: [22, 160, 133] },
//       margin: { left: 14, right: 14 },
//     });
//     const tableEndY = doc.lastAutoTable.finalY || startY + 20;
//     doc.setFontSize(11);
//     doc.text(
//       `Payment Status: ${fullBill.payment_status || ""}`,
//       14,
//       tableEndY + 6
//     );
//     if (fullBill.sgst_amount || fullBill.cgst_amount) {
//       doc.text(
//         `Subtotal: ${fullBill.subtotal_amount || 0}`,
//         14,
//         tableEndY + 12
//       );
//       doc.text(`SGST: ${fullBill.sgst_amount || 0}`, 14, tableEndY + 18);
//       doc.text(`CGST: ${fullBill.cgst_amount || 0}`, 14, tableEndY + 24);
//       doc.text(
//         `Total Amount: ${fullBill.total_amount || 0}`,
//         150,
//         tableEndY + 24
//       );
//     } else {
//       doc.text(
//         `Total Amount: ${fullBill.total_amount || 0}`,
//         150,
//         tableEndY + 6
//       );
//     }
//     const termsY =
//       fullBill.sgst_amount || fullBill.cgst_amount
//         ? tableEndY + 30
//         : tableEndY + 12;
//     doc.setFontSize(9);
//     doc.text("Terms and Conditions:", 14, termsY);
//     const termsText = termsConditions.value || defaultTerms();
//     doc.setFontSize(8);
//     const splitTerms = doc.splitTextToSize(termsText, 180);
//     doc.text(splitTerms, 14, termsY + 4);
//     if (i < lrBills.value.length - 1) {
//       doc.setDrawColor(180);
//       doc.line(
//         14,
//         doc.lastAutoTable.finalY + 35,
//         200,
//         doc.lastAutoTable.finalY + 35
//       );
//     }
//   }
//   doc.save("LR_Bills_Detailed.pdf");
// }

async function triggerPrint(id) {
  try {
    // Fetch the detailed bill including products
    const { data: bill } = await axios.get(
      `/api/lrBills/${id}?include=products`
    );

    let products = [];
    if (Array.isArray(bill.products)) {
      products = bill.products;
    } else {
      console.warn(
        "Products not included in bill response, skipping separate fetch."
      );
      products = [];
    }

    const companyName = "R.M. Transport";
    const companyDesc = "(Tirupur, Erode, Karur, Salem)";
    const gstNum = companyGst.value || "33GCXPR9565J1ZD";
    const companyAddressText =
      companyAddress.value ||
      `HO: 59, Ram Nagar 4th Street,
Old Balaji Road Line Opp, Tirupur - 641 602.`;

    let companyPhones = "";
    if (companyNumber.value) {
      companyPhones = Array.isArray(companyNumber.value)
        ? companyNumber.value.join(", ")
        : companyNumber.value;
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };

    // Build HTML rows for products
    const productsRows = products.length
      ? products
          .map((p, i) => {
            const qty = p.quantity != null ? p.quantity : "";
            const prodName = p.product_name || "";
            const description = p.description || "";
            const amount = p.amount || "";

            return `<tr>
              <td style="width: 46px; text-align:center;">${i + 1}</td>
              <td style="width: 160px;">${prodName}</td>
              <td style="width: 80px;">${description}</td>
              <td style="width: 53px; text-align:center;">${qty}</td>
              <td style="width: 72px; text-align:right;">${
                bill.payment_status === "To Pay" ? amount : ""
              }</td>
              <td style="width: 58px; text-align:right;">${
                bill.payment_status === "Paid" ? amount : ""
              }</td>
              <td style="width: 90px; text-align:right;">${
                bill.payment_status === "Return Paid" ? amount : ""
              }</td>
            </tr>`;
          })
          .join("")
      : `<tr><td colspan="7" style="text-align:center;">No Products</td></tr>`;

    // Calculations
    const totalQuantity = products.reduce(
      (sum, p) => sum + (Number(p.quantity) || 0),
      0
    );
    const productAmount = products.reduce(
      (sum, p) => sum + (Number(p.amount) || 0),
      0
    );
    const discount = products.reduce(
      (sum, p) => sum + (Number(p.discount) || 0),
      0
    );
    const sgst = Number(bill.sgst_amount) || 0;
    const cgst = Number(bill.cgst_amount) || 0;
    const grandTotal =
      Number(bill.total_amount) || productAmount - discount + cgst + sgst;

    const fromName = bill.from_customer_name || "";
    const fromMobile = bill.from_customer_mobile || "";
    const fromPlace = bill.from_customer_place || "";
    const fromGst = bill.from_customer_gst || "";

    const toName = bill.to_customer_name || "";
    const toMobile = bill.to_customer_mobile || "";
    const toPlace = bill.to_customer_place || "";
    const toGst = bill.to_customer_gst || "";

    const lorryDetails = `${bill.lorry_name || ""}, ${bill.lorry_number || ""}`;
    const driverDetails = `${bill.driver_name || ""}, ${
      bill.driver_number || ""
    }`;
    const ewayBill = bill.eway_bill_number || "-";
    const paymentStatus = bill.payment_status || "";

    // Compose full HTML for the print content
    const printContent = `
      <style>
        @page {
          size: A5 landscape;
          margin: 10pt;
        }
        html, body {
          margin: 10px; padding: 0;
          font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
          background: #fff; color: #222;
        }
        .a5box {
          width: 100%;
          max-width: 1200px;
          min-height: 595px;
          background: #fff;
          border: 1px solid #77a6df;
          margin: 0 auto;
          box-sizing: border-box;
          padding: 0px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .bill-header-row {
          display: flex;
          justify-content: space-between;
          margin: 0px 10px;
          align-items: center;
        }
        .bill-header-left { width: 31%; min-width: 230px; }
        .bill-header-mid { width: 18%; min-width: 130px; text-align: left; font-size: 1.06em; margin-top: 2px; }
        .bill-header-right { width: 40%; min-width: 280px; text-align: right; font-size: 1em; line-height: 1.3; padding-top: 2px; }
        .bill-title { font-weight: bold; font-size: 1.8em; margin-bottom: 2px; }
        .bill-desc { font-style: italic; font-size: 1.07em; margin-bottom: 2px; }
        .bill-gst { color: #555; margin-bottom: 2px; font-size: 0.98em; }
        .bill-header-right .addr-label { font-weight: bold; }
        .add-no { white-space: nowrap; }
        .bill-header-mid { font-size: 1.09em; text-align: left; padding-left: 18px; line-height: 1.4; }
        .main-info-row { display: flex; gap: 8px; margin: 15px 10px 10px 10px; width: 98%; }
        .info-section { border: 1px solid #b7ceed; padding: 9px 16px 10px 12px; flex: 1; background: #fff; min-height: 86px; font-size: 0.99em; }
        .info-title { font-weight: bold; font-size: 1.09em; margin-bottom: 2px; display: block; }
        .trans-details { font-size: 1em; }
        .trans-details span { font-weight: bold; }
        .goods-label-row { display: flex; justify-content: space-between; align-items: center; margin: 5px 10px; }
        .goods-label { font-weight: bold; font-size: 1.11em; letter-spacing: 0.07em; margin-bottom: 0; }
        .payment-status { font-size: 1.08em; font-weight: normal; color: #314768; }
        .goods-table-container { margin-top: 6px; margin-bottom: 0; margin-right: 10px; margin-left: 10px; background: #fff; }
        .goods-table { width: 100%; border-collapse: collapse; background: #fff; }
        .goods-table th, .goods-table td { border: 1px solid #b7ceed; padding: 6px 5px; text-align: left; font-size: 0.98em; }
        .goods-table th { background: #eaf3ff; font-weight: bold; text-align: center; letter-spacing: 0.03em; }
        .goods-table td { min-height: 25px; background: #fff; vertical-align: top; }
        .goods-table tfoot td { font-weight: bold; background: #f6faff; text-align: center; }
        .summary-table-container { margin-top: 14px; margin-right: 10px; background: #fff; }
        .summary-table { width: 100%; border-collapse: collapse; background: #fff; font-size: 1.05em; }
        .summary-table td { border: 1px solid #b7ceed; padding: 7px 10px 7px 8px; text-align: right; min-width: 65px; background: #fff; }
        .summary-table tr:last-child td { font-weight: bold; background: #e7f1ff; font-size: 1.11em; color: #282828; }
        .footer-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 22px; margin-left: 10px; }
        .footer-left { font-size: 1.07em; padding-left: 1px; }
        .footer-right { font-style: italic; font-size: 0.97em; color: #656565; opacity: 0.94; text-align: right; }
        @media print {
          html, body, .a5box {
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box;
          }
          .a5box {
            size: A5 landscape !important;
            page-break-after: always;
          }
        }
      </style>
      <div class="a5box">
        <div class="bill-header-row">
          <div class="bill-header-left">
            <div class="bill-title">${companyName}</div>
            <div class="bill-desc">${companyDesc}</div>
            <div class="bill-gst">GSTIN: ${gstNum}</div>
          </div>
          <div class="bill-header-mid">
            <div>LR No : ${bill.lr_number || ""}</div>
            <div>Date : ${formatDate(bill.date)}</div>
          </div>
          <div class="bill-header-right">
            <div class="addr-label">Address :</div>
            <span class="add-no">${companyAddressText.replace(
              /\n/g,
              "<br>"
            )}<br>${companyPhones}</span>
          </div>
        </div>

        <div class="main-info-row">
          <div class="info-section">
            <span class="info-title">From Customer:</span>
            Name : ${fromName}<br>
            Ph. No. : ${fromMobile}<br>
            Place : ${fromPlace}<br>
            GSTIN : ${fromGst}
          </div>
          <div class="info-section">
            <span class="info-title">To Customer:</span>
            Name : ${toName}<br>
            Ph. No. : ${toMobile}<br>
            Place : ${toPlace}<br>
            GSTIN : ${toGst}
          </div>
          <div class="info-section trans-details">
            <span class="info-title">RM Transport Details</span>
            <span style="font-weight:bold">Lorry Details</span> : ${lorryDetails}<br>
            <span style="font-weight:bold">Driver Details</span> : ${driverDetails}<br>
            <span style="font-weight:bold">E-Way Bill No</span> : ${ewayBill}
          </div>
        </div>

        <div class="goods-label-row">
          <div class="goods-label">Goods Details :</div>
          <div class="payment-status">Payment Status : ${paymentStatus}</div>
        </div>

        <div class="goods-table-container">
          <table class="goods-table">
            <thead>
              <tr>
                <th style="width:26px;">S.No</th>
                <th style="width:180px;">Goods</th>
                <th style="width:80px;">Description</th>
                <th style="width:53px;">Qty.</th>
                <th style="width:72px;">To Pay</th>
                <th style="width:58px;">Paid</th>
                <th style="width:90px;">Return Paid</th>
              </tr>
            </thead>
            <tbody>
              ${productsRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2"></td>
                <td style="text-align:center;">Total</td>
                <td style="text-align:center;">${totalQuantity}</td>
                <td style="text-align:right;">${
                  paymentStatus === "To Pay" ? productAmount.toFixed(2) : ""
                }</td>
                <td style="text-align:right;">${
                  paymentStatus === "Paid" ? productAmount.toFixed(2) : ""
                }</td>
                <td style="text-align:right;">${
                  paymentStatus === "Return Paid"
                    ? productAmount.toFixed(2)
                    : ""
                }</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="summary-table-container">
          <table class="summary-table">
            <tbody>
              <tr><td>Discount</td><td>${discount.toFixed(2)}</td></tr>
              <tr><td>CGST (${gstPercentage.value}%)</td><td>${cgst.toFixed(
      2
    )}</td></tr>
              <tr><td>SGST (${gstPercentage.value}%)</td><td>${sgst.toFixed(
      2
    )}</td></tr>
              <tr><td>Grand Total</td><td>${grandTotal.toFixed(2)}</td></tr>
            </tbody>
          </table>
        </div>

        <div class="footer-row">
          <div class="footer-left">For ${companyName}</div>
        </div>
      </div>
    `;

    // Inject the print HTML into a hidden div on your page
    let printDiv = document.getElementById("print-bill");
    if (!printDiv) {
      printDiv = document.createElement("div");
      printDiv.id = "print-bill";
      printDiv.style.display = "none";
      document.body.appendChild(printDiv);
    }
    printDiv.innerHTML = printContent;
    printDiv.style.display = "block";

    // CSS to hide everything except #print-bill on print
    const printStyle = document.createElement("style");
    printStyle.id = "print-style";
    printStyle.innerHTML = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        #print-bill, #print-bill * {
          visibility: visible !important;
        }
        #print-bill {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          background: white;
          z-index: 9999;
        }
      }
    `;
    document.head.appendChild(printStyle);

    // Trigger the print dialog
    window.print();

    // After printing, hide the div and remove print styles
    printDiv.style.display = "none";
    document.head.removeChild(printStyle);
  } catch (error) {
    console.error("Failed to fetch bill or products for printing:", error);
  }
}

function defaultTerms() {
  return ``;
}
</script>

<style>
.cards-height .v-col-md-4 .v-card,
.cards-height .v-col-md-6 .v-card {
  /* height: 300px; */
  min-height: 160px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
</style>
