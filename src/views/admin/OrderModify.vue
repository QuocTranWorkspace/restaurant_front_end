<template>
  <CForm class="row g-3">
    <CCol md="6">
      <CFormLabel for="orderID">ID</CFormLabel>
      <CFormInput type="text" id="orderID" placeholder="ID" v-model="order.id" readonly />
    </CCol>
    <CCol md="6">
      <CFormLabel for="code">Code <AteriskField /></CFormLabel>
      <CFormInput
        type="text"
        id="code"
        placeholder="Code"
        v-model="order.code"
        @blur="validateField('code')"
      />
      <div v-if="errors.code" class="text-danger">{{ errors.code }}</div>
    </CCol>
    <CCol md="12" class="d-none">
      <CFormLabel for="orderDate">Order Date</CFormLabel>
      <CFormInput
        id="orderDate"
        placeholder="MM-DD-YY HH:MM:SS"
        v-model="order.createdDate"
      />
    </CCol>
    <CCol md="6">
      <CFormLabel for="customerName">Customer Name <AteriskField /></CFormLabel>
      <CFormInput
        type="text"
        id="customerName"
        placeholder="Some name"
        v-model="order.customerName"
        @blur="validateField('customerName')"
      />
      <div v-if="errors.customerName" class="text-danger">{{ errors.customerName }}</div>
    </CCol>
    <CCol md="6">
      <CFormLabel for="customerEmail">Customer Email <AteriskField /></CFormLabel>
      <CFormInput
        type="email"
        id="customerEmail"
        placeholder="Example@gmail.com"
        v-model="order.customerEmail"
        @blur="validateField('customerEmail')"
      />
      <div v-if="errors.customerEmail" class="text-danger">
        {{ errors.customerEmail }}
      </div>
    </CCol>
    <CCol md="6">
      <CFormLabel for="customerPhone">Customer Phone <AteriskField /></CFormLabel>
      <CFormInput
        type="text"
        id="customerPhone"
        placeholder="+01**********"
        v-model="order.customerPhone"
        @blur="validateField('customerPhone')"
      />
      <div v-if="errors.customerPhone" class="text-danger">
        {{ errors.customerPhone }}
      </div>
    </CCol>
    <CCol md="6">
      <CFormLabel for="customerAddress">Customer Address <AteriskField /></CFormLabel>
      <CFormInput
        type="email"
        id="customerAddress"
        placeholder="Main Street etc."
        v-model="order.customerAddress"
        @blur="validateField('customerAddress')"
      />
      <div v-if="errors.customerAddress" class="text-danger">
        {{ errors.customerAddress }}
      </div>
    </CCol>
    <CCol xs="12">
      <CFormLabel for="totalPrice">Total Price <AteriskField /></CFormLabel>
      <CFormInput
        id="totalPrice"
        placeholder="199$"
        v-model="order.totalPrice"
        @blur="validateField('totalPrice')"
      />
      <div v-if="errors.totalPrice" class="text-danger">
        {{ errors.totalPrice }}
      </div>
    </CCol>
    <CCol md="6">
      <CFormLabel for="orderDate">Order Date</CFormLabel>
      <CFormInput
        id="orderDate"
        placeholder="MM-DD-YY HH:MM:SS"
        v-model="order.createdDate"
      />
    </CCol>
    <CCol md="6">
      <CFormLabel for="deliveryStatus">Delivery Status <AteriskField /></CFormLabel>
      <CFormSelect
        aria-label="Default select example"
        id="deliveryStatus"
        v-model="order.deliveryStatus"
        @change="handleStatusChange"
      >
        <option :value="0">Cancelled</option>
        <option :value="1">Pending</option>
        <option :value="2">Delivering</option>
        <option :value="3">Success</option>
      </CFormSelect>
    </CCol>
    <CCol md="12">
      <div class="container mt-5 p-4 bg-secondary text-light rounded">
        <h4 class="mb-4">Order Product List</h4>
        <div class="d-flex justify-content-between mb-3">
          <div class="d-flex gap-3">
            <div>
              <label for="nameFilter" class="form-label">Filter by Name:</label>
              <input
                id="nameFilter"
                type="text"
                class="form-control"
                v-model="filters.name.value"
                placeholder="Enter product name"
              />
            </div>
          </div>
        </div>

        <VTable
          :data="orderProducts"
          :filters="filters"
          class="table table-hover table-bordered text-dark"
          :currentPage="currentPage"
          :pageSize="6"
          @totalPagesChanged="totalPages = $event"
        >
          <template #head>
            <tr>
              <th class="col-0">#</th>
              <th>Id</th>
              <th>Name</th>
              <th>Category</th>
              <th>originalPrice</th>
              <th>SalePrice</th>
              <th>Quantity</th>
              <th class="text-center col-2">Status</th>
            </tr>
          </template>

          <template #body="{ rows }">
            <tr v-for="row in rows" :key="row.guid">
              <td class="col-0">{{ row.id }}</td>
              <td>{{ row.product.id }}</td>
              <td>{{ row.product.productName }}</td>
              <td>{{ row.product.category }}</td>
              <td>{{ row.product.originalPrice }}</td>
              <td>{{ row.product.salePrice }}</td>
              <td>{{ row.quantity }}</td>
              <td>{{ row.status }}</td>
            </tr>
          </template>
        </VTable>

        <div class="container mt-5 d-flex justify-content-center">
          <VTPagination
            v-model:currentPage="currentPage"
            :total-pages="totalPages"
            :boundary-links="true"
          />
        </div>
      </div>
    </CCol>
    <CCol xs="12">
      <CButton color="primary" type="submit" @click="handleSubmit">Save</CButton>
    </CCol>
  </CForm>
</template>

<script setup>
import { ref, watch, reactive } from "vue";
import { ordersStore } from "@/stores/data/OrderData";
import AteriskField from "@/components/AteriskField.vue";

const currentPage = ref(1);
const totalPages = ref(100);
const filters = reactive({
  name: { value: "", keys: ["product.productName"] },
});

const handleStatusChange = (event) => {
  order.value.deliveryStatus = event.target.value;
};

const orderStoreInit = ordersStore();

const props = defineProps({
  id: String,
});

const orderProducts = ref([]);

const order = ref({
  id: "",
  code: "",
  totalPrice: "",
  customerName: "",
  customerEmail: "",
  user: "",
  customerPhone: "",
  customerAddress: "",
  orderProducts: orderProducts,
  createdDate: "",
  deliveryStatus: "",
});

const errors = reactive({
  code: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerAddress: "",
  totalPrice: "",
});

const validateField = (field) => {
  errors[field] = "";

  if (field === "code" && !order.value.code.trim()) {
    errors.code = "Code is required.";
  }

  if (field === "customerName" && !order.value.customerName.trim()) {
    errors.customerName = "Customer name is required.";
  }

  if (field === "customerEmail") {
    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(order.value.customerEmail)) {
      errors.customerEmail = "Please enter a valid email address.";
    }
  }

  if (field === "customerPhone") {
    const phonePattern = /^\+?[0-9]{10,15}$/;
    if (!phonePattern.test(order.value.customerPhone)) {
      errors.customerPhone = "Phone number must be valid and contain 10-15 digits.";
    }
  }

  if (field === "customerAddress" && !order.value.customerAddress.trim()) {
    errors.customerAddress = "Customer address is required.";
  }

  if (field === "totalPrice") {
    if (
      isNaN(parseFloat(order.value.totalPrice)) ||
      parseFloat(order.value.totalPrice) <= 0 ||
      order.value.totalPrice === undefined
    ) {
      errors.totalPrice = "Total price must be a positive number.";
    }
  }
};

const validateForm = () => {
  const fields = [
    "code",
    "customerName",
    "customerEmail",
    "customerPhone",
    "customerAddress",
    "totalPrice",
  ];
  fields.forEach(validateField);

  return Object.values(errors).every((error) => error === "");
};

const fetchOrderData = async (userId) => {
  try {
    const fetchedOrder = await orderStoreInit.fetchOrder(parseInt(userId));
    if (fetchedOrder) {
      order.value = fetchedOrder;
      order.value.createdDate = new Date(order.value.createdDate);
      const fetchedOrderProducts = await orderStoreInit.fetchOrderByCode(
        parseInt(order.value.id)
      );
      if (fetchedOrderProducts) {
        orderProducts.value = fetchedOrderProducts;
      } else {
        console.warn("Order products not found.");
      }
    } else {
      console.warn("Order not found.");
    }
  } catch (error) {
    console.error("Error fetching order:", error);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  if (validateForm()) {
    orderStoreInit.saveOrUpdateOrder(order.value, parseInt(props.id));
  } else {
    console.warn("Form validation failed.", errors);
  }
};

watch(
  () => props.id,
  (newId) => {
    if (!isNaN(parseInt(newId)) && parseInt(newId) >= 0) {
      fetchOrderData(newId);
    } else {
      console.warn("Invalid order ID.");
    }
  },
  { immediate: true }
);
</script>
