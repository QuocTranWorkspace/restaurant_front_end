<template>
  <CForm class="row g-3">
    <CCol md="6">
      <CFormLabel for="orderID">ID</CFormLabel>
      <CFormInput type="text" id="orderID" placeholder="ID" v-model="order.id" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="code">Code</CFormLabel>
      <CFormInput type="text" id="code" placeholder="Code" v-model="order.code" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="customerName">Customer Name</CFormLabel>
      <CFormInput
        type="text"
        id="customerName"
        placeholder="Some name"
        v-model="order.customerName"
      />
    </CCol>
    <CCol md="6">
      <CFormLabel for="customerEmail">Customer Email</CFormLabel>
      <CFormInput
        type="email"
        id="customerEmail"
        placeholder="Example@gmail.com"
        v-model="order.customerEmail"
      />
    </CCol>
    <CCol md="6">
      <CFormLabel for="customerPhone">Customer Phone</CFormLabel>
      <CFormInput
        type="text"
        id="customerPhone"
        placeholder="09********"
        v-model="order.customerPhone"
      />
    </CCol>
    <CCol md="6">
      <CFormLabel for="customerAddress">Customer Address</CFormLabel>
      <CFormInput
        type="email"
        id="customerAddress"
        placeholder="Hanoi e.t.c"
        v-model="order.customerAddress"
      />
    </CCol>
    <CCol xs="12">
      <CFormLabel for="totalPrice">Total Price</CFormLabel>
      <CFormInput id="totalPrice" placeholder="199$" v-model="order.totalPrice" />
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
      <CFormLabel for="category">Category</CFormLabel>
      <CFormSelect
        aria-label="Default select example"
        id="category"
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
          :data="orderList"
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
  customerPhone: "",
  customerAddress: "",
  orderProducts: orderProducts,
  createdDate: "",
  deliveryStatus: "",
});

const fetchOrderData = async (userId) => {
  try {
    const fetchedOrder = await orderStoreInit.fetchOrder(parseInt(userId));
    if (fetchedOrder) {
      order.value = fetchedOrder;
      order.value.createdDate = new Date(order.value.createdDate);
      orderStoreInit.fetchOrderByCode(props.id).then((response) => {
        orderList.value = response.filter((data) => data.status);
      });
    } else {
      console.warn("Order not found.");
    }
  } catch (error) {
    console.error("Error fetching order:", error);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  orderStoreInit.saveOrUpdateOrder(order.value, parseInt(props.id));
};

const currentPage = ref(1);
const totalPages = ref(100);

let orderList = ref([]);

const filters = reactive({
  name: { value: "", keys: ["product.productName"] },
});

const handleStatusChange = (event) => {
  order.value.deliveryStatus = event.target.value;
  console.log(order.value.deliveryStatus);
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
