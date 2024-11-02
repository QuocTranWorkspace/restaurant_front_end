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
      <CFormLabel for="deliverDate">Deliver Date</CFormLabel>
      <CFormInput id="deliverDate" placeholder="MM-DD-YY HH:MM:SS" v-model="order.id" />
    </CCol>
    <CCol xs="12">
      <CButton color="primary" type="submit" @click="handleSubmit">Save</CButton>
    </CCol>
  </CForm>
</template>

<script setup>
import { ref, watch } from "vue";
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
});

const fetchOrderData = async (userId) => {
  try {
    const fetchedOrder = await orderStoreInit.fetchOrder(parseInt(userId));
    if (fetchedOrder) {
      order.value = fetchedOrder;
      order.value.createdDate = new Date(order.value.createdDate);
    } else {
      console.warn("User not found.");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  orderStoreInit.saveOrUpdateOrder(order.value, parseInt(props.id));
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
