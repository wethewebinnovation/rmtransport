<template>
  <v-container fluid>
    <!-- LR Bills Summary -->
    <h3 class="mb-3">LR Bills Summary :</h3>
    <v-row>
      <v-col
        ><v-card elevation="0" border>
          <v-card-text>
            <div class="d-flex justify-space-between align-center mb-7">
              <h2>Total LR Bills</h2>
              <h1>{{ billsCount }}</h1>
            </div>
            <v-row>
              <v-col class="text-center">
                <h4 class="mb-2">Paid</h4>
                <h4>{{ paidBillsCount }}</h4>
              </v-col>
              <v-col class="text-center">
                <h4 class="mb-2">To Pay</h4>
                <h4>{{ toPayBillCount }}</h4>
              </v-col>
              <v-col class="text-center">
                <h4 class="mb-2">Returned</h4>
                <h4>{{ returnBillsCount }}</h4>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card></v-col
      >
      <v-col
        ><v-card elevation="0" border>
          <v-card-text>
            <div class="d-flex justify-space-between align-center mb-7">
              <h2>Total Paid Bills</h2>
              <h1>{{ paidBillsCount }}</h1>
            </div>
            <v-row>
              <v-col class="text-center">
                <h4 class="mb-2">Today</h4>
                <h4>{{ paidBillsToday }}</h4>
              </v-col>
              <v-col class="text-center">
                <h4 class="mb-2">This Month</h4>
                <h4>{{ paidBillsMonth }}</h4>
              </v-col>
              <v-col class="text-center">
                <h4 class="mb-2">This Year</h4>
                <h4>{{ paidBillsYear }}</h4>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card></v-col
      >
      <v-col
        ><v-card elevation="0" border>
          <v-card-text>
            <div class="d-flex justify-space-between align-center mb-7">
              <h2>Total To Pay Bills</h2>
              <h1>{{ toPayBillCount }}</h1>
            </div>
            <v-row>
              <v-col class="text-center">
                <h4 class="mb-2">Today</h4>
                <h4>{{ toPayBillsToday }}</h4>
              </v-col>
              <v-col class="text-center">
                <h4 class="mb-2">This Month</h4>
                <h4>{{ toPayBillsMonth }}</h4>
              </v-col>
              <v-col class="text-center">
                <h4 class="mb-2">This Year</h4>
                <h4>{{ toPayBillsYear }}</h4>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card></v-col
      >
      <v-col
        ><v-card elevation="0" border>
          <v-card-text>
            <div class="d-flex justify-space-between align-center mb-7">
              <h2>Total Returned Paid Bills</h2>
              <h1>{{ returnBillsCount }}</h1>
            </div>
            <v-row>
              <v-col class="text-center">
                <h4 class="mb-2">Today</h4>
                <h4>{{ returnPaidBillsToday }}</h4>
              </v-col>
              <v-col class="text-center">
                <h4 class="mb-2">This Month</h4>
                <h4>{{ returnPaidBillsMonth }}</h4>
              </v-col>
              <v-col class="text-center">
                <h4 class="mb-2">This Year</h4>
                <h4>{{ returnPaidBillsYear }}</h4>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card></v-col
      >
    </v-row>

    <v-divider class="mb-5 mt-7"></v-divider>

    <!-- Revenue Summary -->
    <h3 class="mb-3">Revenue Summary :</h3>
    <v-row>
      <v-col>
        <v-card elevation="0" border>
          <v-card-text>
            <div class="d-flex justify-space-between align-center mb-7">
              <h2>Total Revenue</h2>
              <h1>
                <strong>₹</strong>
                {{ overallRevenueTotal?.toLocaleString() || "0" }}
              </h1>
            </div>
            <v-row>
              <v-col class="text-center">
                <h4 class="mb-2">Today</h4>
                <h4>{{ revenueToday.toLocaleString() }}</h4>
              </v-col>
              <v-col class="text-center">
                <h4 class="mb-2">This Month</h4>
                <h4>{{ revenueMonth.toLocaleString() }}</h4>
              </v-col>
              <v-col class="text-center">
                <h4 class="mb-2">This Year</h4>
                <h4>{{ revenueYear.toLocaleString() }}</h4>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col>
        <v-card elevation="0" border>
          <v-card-text>
            <div class="d-flex justify-space-between align-center mb-7">
              <h2>Total Paid</h2>
              <h1>
                <strong>₹</strong>
                {{ paidRevenueTotal?.toLocaleString() || "0" }}
              </h1>
            </div>
            <v-row>
              <v-col class="text-center">
                <h4 class="mb-2">Today</h4>
                <h4>
                  <strong>₹</strong>
                  {{ paidRevenueToday?.toLocaleString() || "0" }}
                </h4>
              </v-col>
              <v-col class="text-center">
                <h4 class="mb-2">This Month</h4>
                <h4>
                  <strong>₹</strong>
                  {{ paidRevenueMonth?.toLocaleString() || "0" }}
                </h4>
              </v-col>
              <v-col class="text-center">
                <h4 class="mb-2">This Year</h4>
                <h4>
                  <strong>₹</strong>
                  {{ paidRevenueYear?.toLocaleString() || "0" }}
                </h4>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col>
        <v-card elevation="0" border>
          <v-card-text>
            <div class="d-flex justify-space-between align-center mb-7">
              <h2>Total To Pay</h2>
              <h1>
                <strong>₹</strong>
                {{ toPayRevenueTotal?.toLocaleString() || "0" }}
              </h1>
            </div>
            <v-row>
              <v-col class="text-center">
                <h4 class="mb-2">Today</h4>
                <h4>
                  <strong>₹</strong>
                  {{ toPayRevenueToday?.toLocaleString() || "0" }}
                </h4>
              </v-col>
              <v-col class="text-center">
                <h4 class="mb-2">This Month</h4>
                <h4>
                  <strong>₹</strong>
                  {{ toPayRevenueMonth?.toLocaleString() || "0" }}
                </h4>
              </v-col>
              <v-col class="text-center">
                <h4 class="mb-2">This Year</h4>
                <h4>
                  <strong>₹</strong>
                  {{ toPayRevenueYear?.toLocaleString() || "0" }}
                </h4>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col>
        <v-card elevation="0" border>
          <v-card-text>
            <div class="d-flex justify-space-between align-center mb-7">
              <h2>Total Returned Paid</h2>
              <h1>
                <strong>₹</strong>
                {{ returnPaidRevenueTotal?.toLocaleString() || "0" }}
              </h1>
            </div>
            <v-row>
              <v-col class="text-center">
                <h4 class="mb-2">Today</h4>
                <h4>
                  <strong>₹</strong>
                  {{ returnPaidRevenueToday?.toLocaleString() || "0" }}
                </h4>
              </v-col>
              <v-col class="text-center">
                <h4 class="mb-2">This Month</h4>
                <h4>
                  <strong>₹</strong>
                  {{ returnPaidRevenueMonth?.toLocaleString() || "0" }}
                </h4>
              </v-col>
              <v-col class="text-center">
                <h4 class="mb-2">This Year</h4>
                <h4>
                  <strong>₹</strong>
                  {{ returnPaidRevenueYear?.toLocaleString() || "0" }}
                </h4>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="mb-5 mt-7"></v-divider>

    <!-- Resources Summary -->
    <h3 class="mb-3">Resources Summary :</h3>
    <v-row dense class="mb-6">
      <v-col>
        <v-card elevation="0" border
          ><v-card-text>
            <div class="d-flex align-center justify-space-between">
              <h3>Customers</h3>
              <h3>{{ customersCount }}</h3>
            </div></v-card-text
          ></v-card
        >
      </v-col>
      <v-col>
        <v-card elevation="0" border
          ><v-card-text>
            <div class="d-flex align-center justify-space-between">
              <h3>Products</h3>
              <h3>{{ productsCount }}</h3>
            </div></v-card-text
          ></v-card
        >
      </v-col>
      <v-col>
        <v-card elevation="0" border
          ><v-card-text>
            <div class="d-flex align-center justify-space-between">
              <h3>Drivers</h3>
              <h3>{{ driversCount }}</h3>
            </div></v-card-text
          ></v-card
        >
      </v-col>
      <v-col>
        <v-card elevation="0" border
          ><v-card-text>
            <div class="d-flex align-center justify-space-between">
              <h3>Lorry</h3>
              <h3>{{ lorriesCount }}</h3>
            </div></v-card-text
          ></v-card
        >
      </v-col>
      <v-col>
        <v-card elevation="0" border
          ><v-card-text>
            <div class="d-flex align-center justify-space-between">
              <h3>Customers</h3>
              <h3>{{ customersCount }}</h3>
            </div></v-card-text
          ></v-card
        >
      </v-col>
    </v-row>

    <v-divider class="mb-5 mt-7"></v-divider>

    <h3 class="mb-3">Driver Invoice :</h3>
    <v-card elevation="0" class="mb-6" border>
      <v-card-text>
        <div class="d-flex align-center mb-3">
          <v-spacer></v-spacer>
          <!-- Date pickers -->
          <v-menu
            v-model="dateFilterMenuFrom"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                clearable
                variant="outlined"
                v-model="filterFromDisplay"
                label="From Date"
                append-inner-icon="mdi-calendar"
                hide-details
                v-bind="props"
                density="compact"
                class="mr-3"
              />
            </template>
            <v-date-picker v-model="filterFromInternal" no-title scrollable />
          </v-menu>
          <v-menu
            v-model="dateFilterMenuTo"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                clearable
                v-model="filterToDisplay"
                label="To Date"
                v-bind="props"
                append-inner-icon="mdi-calendar"
                hide-details
                variant="outlined"
                density="compact"
                class="mr-3"
              />
            </template>
            <v-date-picker v-model="filterToInternal" no-title scrollable />
          </v-menu>
          <!-- From Place dropdown filter -->
          <v-select
            v-model="fromPlaceFilter"
            :items="uniqueFromPlaces"
            label="Select From Place"
            clearable
            hide-details
            variant="outlined"
            density="compact"
            class="mr-3"
          />
          <!-- To Place dropdown filter -->
          <v-select
            v-model="toPlaceFilter"
            :items="uniqueToPlaces"
            label="Select To Place"
            clearable
            hide-details
            density="compact"
            class="mr-3"
            variant="outlined"
          />
          <v-btn
            class="me-2"
            append-icon="mdi-calendar"
            @click="setTodayFilter"
            flat
            color="info"
            >Today</v-btn
          >
          <v-btn
            @click="exportDashboardPdf"
            color="red"
            flat
            append-icon="mdi-file-pdf"
            >Export PDF</v-btn
          >
        </div>
      </v-card-text>
      <v-card-text class="px-0 pb-0">
        <!-- Datatable -->
        <v-data-table
          :headers="dashboardHeaders"
          :items="filteredDashboardBills"
          :items-per-page="10"
          class="elevation-1"
          dense
        >
          <template v-slot:[`item.sno`]="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:[`item.date`]="{ item }">
            {{ formatDateTime(item.date) }}
          </template>
          <template v-slot:[`item.productsDisplay`]="{ item }">
            {{ item.productsDisplay }}
          </template>
          <template v-slot:[`item.quantitiesDisplay`]="{ item }">
            {{ item.quantitiesDisplay }}
          </template>
          <template v-slot:[`item.amountDisplay`]="{ item }">
            {{ item.amountDisplay }}
          </template>
          <template v-slot:[`item.payment_status`]="{ item }">
            <v-chip
              :color="
                item.payment_status === 'Paid'
                  ? 'green'
                  : item.payment_status === 'To Pay'
                  ? 'red'
                  : item.payment_status === 'Return Paid'
                  ? 'orange'
                  : ''
              "
              dark
              small
            >
              {{ item.payment_status }}
            </v-chip>
          </template>
          <!-- <template v-slot:[`item.action`]="{ item }">
            <v-btn icon color="primary" @click="openViewDialog(item.id)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template> -->
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Recent Sections currently hidden-->
    <div class="d-none">
      <v-row dense>
        <!-- Recent Bills -->
        <v-col cols="12" md="12">
          <v-card elevation="0" border>
            <v-card-title>
              Recent LR Bills
              <v-spacer></v-spacer>
              <v-btn text small @click="$router.push('/history')"
                >View All</v-btn
              >
            </v-card-title>
            <v-data-table
              :headers="billsHeaders"
              :items="recentBills"
              class="elevation-1"
              dense
              hide-default-footer
            >
              <template v-slot:[`item.payment_status`]="{ item }">
                <v-chip
                  :class="
                    item.payment_status === 'Paid' ? 'rm-bg-yes' : 'rm-bg-no'
                  "
                  size="small"
                  variant="tonal"
                >
                  {{ item.payment_status }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>

      <v-row dense class="mt-6">
        <!-- Recent Customers -->
        <v-col cols="12" md="4">
          <v-card elevation="0" border>
            <v-card-title>
              Recent Customers
              <v-spacer></v-spacer>
              <v-btn text small @click="$router.push('/customers')"
                >View All</v-btn
              >
            </v-card-title>
            <v-data-table
              :headers="customerHeaders"
              :items="recentCustomers"
              dense
              hide-default-footer
            />
          </v-card>
        </v-col>
        <!-- Recent Drivers -->
        <v-col cols="12" md="4">
          <v-card elevation="0" border>
            <v-card-title>
              Recent Drivers
              <v-spacer></v-spacer>
              <v-btn text small @click="$router.push('/drivers')"
                >View All</v-btn
              >
            </v-card-title>
            <v-data-table
              :headers="driverHeaders"
              :items="recentDrivers"
              dense
              hide-default-footer
            />
          </v-card>
        </v-col>

        <!-- Recent Lorries -->
        <v-col cols="12" md="4">
          <v-card elevation="0" border>
            <v-card-title>
              Recent Lorries
              <v-spacer></v-spacer>
              <v-btn text small @click="$router.push('/lorries')"
                >View All</v-btn
              >
            </v-card-title>
            <v-data-table
              :headers="lorryHeaders"
              :items="recentLorries"
              dense
              hide-default-footer
            />
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const companyName = ref("RM Regular Service");
const bills = ref([]);
const customers = ref([]);
const drivers = ref([]);
const lorries = ref([]);
const products = ref([]);

// Date Filter States
const filterFrom = ref("");
const filterTo = ref("");
const dateFilterMenuFrom = ref(false);
const dateFilterMenuTo = ref(false);
const filterFromInternal = ref("");
const filterToInternal = ref("");
const filterFromDisplay = ref("");
const filterToDisplay = ref("");

// From Place Filter
const fromPlaceFilter = ref();
const uniqueFromPlaces = ref([]);
// To Place Filter
const toPlaceFilter = ref();
const uniqueToPlaces = ref([]);

// Format helpers
function isoToDisplayDate(isoDate) {
  if (!isoDate) return "";
  if (typeof isoDate === "string") {
    const datePart = isoDate.length >= 10 ? isoDate.substring(0, 10) : isoDate;
    const parts = datePart.split("-");
    if (parts.length !== 3) return "";
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  if (isoDate instanceof Date && !isNaN(isoDate)) {
    const pad = (x) => String(x).padStart(2, "0");
    const day = pad(isoDate.getDate());
    const month = pad(isoDate.getMonth() + 1);
    const year = isoDate.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return "";
}
function parseDisplayDateToDate(displayDate) {
  if (!displayDate) return null;
  const parts = displayDate.split("/");
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  return new Date(year, month - 1, day);
}
watch(filterFromInternal, (newVal) => {
  filterFromDisplay.value = isoToDisplayDate(newVal);
  filterFrom.value = newVal;
});
watch(filterToInternal, (newVal) => {
  filterToDisplay.value = isoToDisplayDate(newVal);
  filterTo.value = newVal;
});
const dashboardHeaders = [
  { title: "S.No", value: "sno", sortable: false, align: "center" },
  { title: "LR Billed Date", value: "date" },
  { title: "LR No", value: "lr_number" },
  { title: "From Customer", value: "from_customer_name" },
  { title: "From Place", value: "from_customer_place" },
  { title: "To Customer", value: "to_customer_name" },
  { title: "To Place", value: "to_customer_place" },
  { title: "Goods/Products", value: "productsDisplay" },
  { title: "Quantity", value: "quantitiesDisplay" },
  { title: "Amount", value: "amountDisplay" },
  { title: "Payment Status", value: "payment_status", align: "center" },
  // { title: "Action", value: "action", sortable: false },
];
const billsHeaders = [
  { title: "LR Number", value: "lr_number" },
  { title: "Date", value: "date" },
  { title: "To", value: "to_customer_name" },
  { title: "Total Amount", value: "total_amount" },
  { title: "Payment Status", value: "payment_status" },
];
const customerHeaders = [
  { title: "Customer Name", value: "customer_name" },
  { title: "Mobile", value: "mobile" },
];
const driverHeaders = [
  { title: "Driver Name", value: "name" },
  { title: "License No", value: "license_number" },
];
const lorryHeaders = [
  { title: "Lorry Number", value: "lorry_number" },
  { title: "Capacity", value: "capacity" },
];

// Fetch products for all bills after bulk fetch
async function fetchProductsForBills(bar) {
  const promises = bar.map(async (bill) => {
    try {
      const { data } = await axios.get(`/api/lrBills/${bill.id}`);
      return { ...bill, products: data.products || [] };
    } catch {
      return { ...bill, products: [] };
    }
  });
  return Promise.all(promises);
}

async function fetchDashboardData() {
  try {
    const [
      billsRes,
      customersRes,
      driversRes,
      lorriesRes,
      productsRes,
      settingsRes,
    ] = await Promise.all([
      axios.get("/api/lrBills?status=active"),
      axios.get("/api/customers"),
      axios.get("/api/drivers"),
      axios.get("/api/lorries"),
      axios.get("/api/products"),
      axios.get("/api/settings"),
    ]); // This is the only change required for what you want:

    const billsWithProducts = await fetchProductsForBills(billsRes.data);
    bills.value = billsWithProducts;

    customers.value = customersRes.data;
    drivers.value = driversRes.data;
    lorries.value = lorriesRes.data;
    products.value = productsRes.data;
    uniqueFromPlaces.value = [
      ...new Set(bills.value.map((b) => b.from_customer_place).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b));
    uniqueToPlaces.value = [
      ...new Set(bills.value.map((b) => b.to_customer_place).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b));
    if (settingsRes.data && settingsRes.data.company_name) {
      companyName.value = settingsRes.data.company_name;
    }
    if (bills.value.length > 0) {
      const bill = bills.value[0];
      if (bill.lorry_id) {
        const foundLorry = lorries.value.find((l) => l.id === bill.lorry_id);
        if (foundLorry) {
          lorryName.value = foundLorry.lorry_name || "";
          lorryNumber.value = foundLorry.lorry_number || "";
        }
      }
      if (bill.driver_id) {
        const foundDriver = drivers.value.find((d) => d.id === bill.driver_id);
        if (foundDriver) {
          driverName.value = foundDriver.name || "";
          driverNumber.value = foundDriver.driver_number || "";
        }
      }
    } else {
      lorryName.value = "";
      lorryNumber.value = "";
      driverName.value = "";
      driverNumber.value = "";
    }
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
  }
}
onMounted(() => {
  fetchDashboardData();
});
function setTodayFilter() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  filterFrom.value = `${yyyy}-${mm}-${dd}`;
  filterTo.value = `${yyyy}-${mm}-${dd}`;
  filterFromInternal.value = filterFrom.value;
  filterToInternal.value = filterTo.value;
}
function formatDateTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const pad = (x) => String(x).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}
const filteredDashboardBills = computed(() => {
  let data = bills.value || [];
  const fromDate = parseDisplayDateToDate(filterFromDisplay.value);
  const toDate = parseDisplayDateToDate(filterToDisplay.value);
  if (fromDate) {
    fromDate.setHours(0, 0, 0, 0);
    data = data.filter((b) => {
      const billDate = new Date(b.date);
      return billDate >= fromDate;
    });
  }
  if (toDate) {
    toDate.setHours(23, 59, 59, 999);
    data = data.filter((b) => {
      const billDate = new Date(b.date);
      return billDate <= toDate;
    });
  }
  if (fromPlaceFilter.value) {
    data = data.filter((b) => b.from_customer_place === fromPlaceFilter.value);
  }
  if (toPlaceFilter.value) {
    data = data.filter((b) => b.to_customer_place === toPlaceFilter.value);
  }

  return data.map((b, i) => {
    const productsArray = Array.isArray(b.products) ? b.products : [];
    const productNames = productsArray
      .map((p) => {
        if (p.product_name) return p.product_name;
        if (p.product_id) {
          const prod = products.value.find((pr) => pr.id === p.product_id);
          return prod ? prod.name : "";
        }
        return "";
      })
      .filter(Boolean)
      .join(", ");
    const totalQty = productsArray.reduce(
      (sum, p) => sum + (Number(p.quantity) || 0),
      0
    );
    const totalAmt = productsArray.reduce(
      (sum, p) => sum + (Number(p.amount) || 0) - (Number(p.discount) || 0),
      0
    );
    return {
      ...b,
      sno: i + 1,
      productsDisplay: productNames || "-",
      quantitiesDisplay: totalQty || "-",
      amountDisplay: totalAmt.toFixed(2),
    };
  });
});

const lorryName = ref("");
const lorryNumber = ref("");
const driverName = ref("");
const driverNumber = ref("");
// function openViewDialog(lrId) {
//   alert("View LR Bill dialog for Bill ID: " + lrId);
// }
async function exportDashboardPdf() {
  if (!filteredDashboardBills.value.length) {
    alert("No records to export!");
    return;
  }
  const doc = new jsPDF();
  doc.setFontSize(18); // HEADER: Show from and to place
  // const fromPlace = "Tirupur";
  const fromPlace =
    fromPlaceFilter.value ||
    (filteredDashboardBills.value[0]
      ? filteredDashboardBills.value.from_customer_place
      : "");
  const toPlace =
    toPlaceFilter.value ||
    (filteredDashboardBills.value[0]
      ? filteredDashboardBills.value.to_customer_place
      : "");
  // === Company Title ===
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(companyName.value, 105, 15, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Driver Invoice", 105, 22, { align: "center" });

  // === Divider Line ===
  doc.setLineWidth(0.5);
  doc.line(14, 28, 196, 28);

  // === Row 1: From / To / Date ===
  doc.setFontSize(11);
  let rowY = 36;
  doc.text(`From: ${fromPlace || "All Places"}`, 14, rowY);
  doc.text(`To: ${toPlace || "All Places"}`, 105, rowY, { align: "center" });
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 196, rowY, {
    align: "right",
  });

  // === Row 2: Lorry / Driver ===
  rowY += 8;
  doc.text(`Lorry Name: ${lorryName.value}`, 14, rowY);
  doc.text(`Driver Name: ${driverName.value}`, 120, rowY);

  rowY += 6;
  doc.text(`Lorry Number: ${lorryNumber.value}`, 14, rowY);
  doc.text(`Driver Number: ${driverNumber.value}`, 120, rowY);

  // === Bottom Divider ===
  rowY += 6;
  doc.line(14, rowY, 196, rowY);

  // const now = new Date();
  // // const datePrinted = formatDateTime(now.toISOString());
  // // doc.text(`rinted On: ${datePrinted}`, 14, 44);
  autoTable(doc, {
    startY: 60,
    head: [
      [
        "Sl.No",
        "Date",
        "LR No",
        "From Customer",
        "From Place",
        "To Customer",
        "To Place",
        "Products",
        "Quantity",
        "Amount",
        "Payment",
      ],
    ],
    body: filteredDashboardBills.value.map((b, idx) => [
      idx + 1,
      formatDateTime(b.date),
      b.lr_number || "-",
      b.from_customer_name || "-",
      b.from_customer_place || "-",
      b.to_customer_name || "-",
      b.to_customer_place || "-",
      b.productsDisplay,
      b.quantitiesDisplay,
      b.amountDisplay,
      b.payment_status || "-",
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [22, 160, 133] },
    margin: { left: 6, right: 6 },
  });
  doc.save("driver_invoice.pdf");
}
const billsCount = computed(() => bills.value.length);
const paidBillsCount = computed(
  () => bills.value.filter((b) => b.payment_status === "Paid").length
);
const toPayBillCount = computed(
  () => bills.value.filter((b) => b.payment_status === "To Pay").length
);
const returnBillsCount = computed(
  () => bills.value.filter((b) => b.payment_status === "Return Paid").length
);

// const totalRevenue = computed(() =>
//   bills.value
//     .filter((b) => b.payment_status === "Paid")
//     .reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0)
// );
function parseBillDate(dateString) {
  if (!dateString) return null;
  const d = new Date(dateString);
  return isNaN(d) ? null : d;
}
const revenueToday = computed(() => {
  const today = new Date();
  return bills.value
    .filter((b) => {
      if (
        b.payment_status !== "Paid" &&
        b.payment_status !== "To Pay" &&
        b.payment_status !== "Return Paid"
      )
        return false;
      const billDate = parseBillDate(b.date);
      return (
        billDate &&
        billDate.getDate() === today.getDate() &&
        billDate.getMonth() === today.getMonth() &&
        billDate.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);
});

const revenueMonth = computed(() => {
  const today = new Date();
  return bills.value
    .filter((b) => {
      if (
        b.payment_status !== "Paid" &&
        b.payment_status !== "To Pay" &&
        b.payment_status !== "Return Paid"
      )
        return false;
      const billDate = parseBillDate(b.date);
      return (
        billDate &&
        billDate.getMonth() === today.getMonth() &&
        billDate.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);
});
const revenueYear = computed(() => {
  const today = new Date();
  return bills.value
    .filter((b) => {
      if (
        b.payment_status !== "Paid" &&
        b.payment_status !== "To Pay" &&
        b.payment_status !== "Return Paid"
      )
        return false;
      const billDate = parseBillDate(b.date);
      return billDate && billDate.getFullYear() === today.getFullYear();
    })
    .reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);
});

// const billsToday = computed(() => {
//   const today = new Date();
//   return bills.value.filter((b) => {
//     const billDate = parseBillDate(b.date);
//     return (
//       billDate &&
//       billDate.getDate() === today.getDate() &&
//       billDate.getMonth() === today.getMonth() &&
//       billDate.getFullYear() === today.getFullYear()
//     );
//   }).length;
// });
// const billsMonth = computed(() => {
//   const today = new Date();
//   return bills.value.filter((b) => {
//     const billDate = parseBillDate(b.date);
//     return (
//       billDate &&
//       billDate.getMonth() === today.getMonth() &&
//       billDate.getFullYear() === today.getFullYear()
//     );
//   }).length;
// });
// const billsYear = computed(() => {
//   const today = new Date();
//   return bills.value.filter((b) => {
//     const billDate = parseBillDate(b.date);
//     return billDate && billDate.getFullYear() === today.getFullYear();
//   }).length;
// });

// Helper to count bills by status and date match

function billCountByStatus(status, matchFn) {
  return bills.value.filter(
    (b) =>
      (Array.isArray(status)
        ? status.includes(b.payment_status)
        : b.payment_status === status) && matchFn(parseBillDate(b.date))
  ).length;
}

// Counts for "Paid"
const paidBillsToday = computed(() => billCountByStatus("Paid", isToday));
const paidBillsMonth = computed(() => billCountByStatus("Paid", isMonth));
const paidBillsYear = computed(() => billCountByStatus("Paid", isYear));
// const paidBillsTotal = computed(() => billCountByStatus("Paid", alwaysTrue));

// Counts for "To Pay" (check both spellings)
const toPayBillStatuses = ["To Pay", "ToPay"];
const toPayBillsToday = computed(() =>
  billCountByStatus(toPayBillStatuses, isToday)
);
const toPayBillsMonth = computed(() =>
  billCountByStatus(toPayBillStatuses, isMonth)
);
const toPayBillsYear = computed(() =>
  billCountByStatus(toPayBillStatuses, isYear)
);
// const toPayBillsTotal = computed(() =>
//   billCountByStatus(toPayBillStatuses, alwaysTrue)
// );

// Counts for "Return Paid"
const returnPaidBillsToday = computed(() =>
  billCountByStatus("Return Paid", isToday)
);
const returnPaidBillsMonth = computed(() =>
  billCountByStatus("Return Paid", isMonth)
);
const returnPaidBillsYear = computed(() =>
  billCountByStatus("Return Paid", isYear)
);
// const returnPaidBillsTotal = computed(() =>
//   billCountByStatus("Return Paid", alwaysTrue)
// );

// Helper to parse date strings safely
function billAmountByStatus(status, matchFn) {
  return bills.value
    .filter(
      (b) =>
        (Array.isArray(status)
          ? status.includes(b.payment_status)
          : b.payment_status === status) && matchFn(parseBillDate(b.date))
    )
    .reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);
}
const alwaysTrue = () => true;
const isToday = (d) => {
  if (!d) return false;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};
const isMonth = (d) => {
  if (!d) return false;
  const today = new Date();
  return (
    d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
  );
};
const isYear = (d) => {
  if (!d) return false;
  const today = new Date();
  return d.getFullYear() === today.getFullYear();
};

// Paid
const paidRevenueToday = computed(() => billAmountByStatus("Paid", isToday));
const paidRevenueMonth = computed(() => billAmountByStatus("Paid", isMonth));
const paidRevenueYear = computed(() => billAmountByStatus("Paid", isYear));
const paidRevenueTotal = computed(() => billAmountByStatus("Paid", alwaysTrue));

// To Pay (handle "To Pay" and "ToPay")
const toPayStatuses = ["To Pay", "ToPay"];
const toPayRevenueToday = computed(() =>
  billAmountByStatus(toPayStatuses, isToday)
);
const toPayRevenueMonth = computed(() =>
  billAmountByStatus(toPayStatuses, isMonth)
);
const toPayRevenueYear = computed(() =>
  billAmountByStatus(toPayStatuses, isYear)
);
const toPayRevenueTotal = computed(() =>
  billAmountByStatus(toPayStatuses, alwaysTrue)
);

// Return Paid
const returnPaidRevenueToday = computed(() =>
  billAmountByStatus("Return Paid", isToday)
);
const returnPaidRevenueMonth = computed(() =>
  billAmountByStatus("Return Paid", isMonth)
);
const returnPaidRevenueYear = computed(() =>
  billAmountByStatus("Return Paid", isYear)
);
const returnPaidRevenueTotal = computed(() =>
  billAmountByStatus("Return Paid", alwaysTrue)
);

// Overall total revenue (all bills)
const overallRevenueTotal = computed(() =>
  bills.value.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0)
);

const customersCount = computed(() => customers.value.length);
const driversCount = computed(() => drivers.value.length);
const lorriesCount = computed(() => lorries.value.length);
const recentBills = computed(() => [...bills.value].slice(-5).reverse());
const recentCustomers = computed(() =>
  [...customers.value].slice(-5).reverse()
);
const recentDrivers = computed(() => [...drivers.value].slice(-5).reverse());
const recentLorries = computed(() => [...lorries.value].slice(-5).reverse());
</script>

<style scoped>
body,
h1,
h2,
h3,
h4,
h5,
p {
  color: rgb(78, 78, 78);
}
</style>
