<template>
  <div class="container mt-4 mb-4">
    <div class="row">
      <div class="col-lg-12 bg-light p-4 rounded">
        <h4 class="mb-4">User Information</h4>
        <CForm class="row g-3">
          <CCol md="6">
            <CFormLabel for="username">Username</CFormLabel>
            <CFormInput
              type="text"
              id="username"
              placeholder="username"
              v-model="user.userName"
            />
          </CCol>
          <CCol md="6">
            <CFormLabel for="emailU">Email</CFormLabel>
            <CFormInput
              type="email"
              id="emailU"
              placeholder="example@gmail.com"
              v-model="user.email"
            />
          </CCol>
          <CCol md="6">
            <CFormLabel for="firstName">First Name</CFormLabel>
            <CFormInput
              type="text"
              id="firstName"
              placeholder="First name"
              v-model="user.firstName"
            />
          </CCol>
          <CCol md="6">
            <CFormLabel for="lastName">Last Name</CFormLabel>
            <CFormInput
              type="text"
              id="lastName"
              placeholder="Last name"
              v-model="user.lastName"
            />
          </CCol>
          <CCol md="6">
            <CFormLabel for="passwordU">Password</CFormLabel>
            <CFormInput
              type="password"
              id="passwordU"
              placeholder="************"
              v-model="user.password"
            />
          </CCol>
          <CCol md="6">
            <CFormLabel for="phone">Customer Phone</CFormLabel>
            <CFormInput
              type="text"
              id="phone"
              placeholder="+01**********"
              v-model="user.phone"
            />
          </CCol>
          <CCol xs="12">
            <CFormLabel for="address">Customer Address</CFormLabel>
            <CFormInput
              id="address"
              placeholder="Main Street, etc."
              v-model="user.address"
            />
          </CCol>
          <CCol xs="12" class="text-center mt-3">
            <CButton color="primary" type="submit" @click="handleSubmit"
              >Save or Update</CButton
            >
          </CCol>
        </CForm>
      </div>
    </div>

    <div class="container mt-5 p-4 bg-secondary text-light rounded">
      <h4 class="mb-4">Order List</h4>
      <div class="d-flex justify-content-between mb-3">
        <div class="d-flex gap-3">
          <div>
            <label for="codeFilter" class="form-label">Filter by Code:</label>
            <input
              id="codeFilter"
              type="text"
              class="form-control"
              v-model="filters.code.value"
              placeholder="Enter order code"
            />
          </div>
          <div>
            <label for="nameFilter" class="form-label">Filter by Name:</label>
            <input
              id="nameFilter"
              type="text"
              class="form-control"
              v-model="filters.name.value"
              placeholder="Enter customer name"
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
            <th>Code</th>
            <VTh sortKey="totalPrice">Total Price</VTh>
            <th>Customer</th>
            <th>Address</th>
            <th class="text-center col-2">Status</th>
          </tr>
        </template>

        <template #body="{ rows }">
          <tr v-for="row in rows" :key="row.guid">
            <td class="col-0">{{ row.id }}</td>
            <td>{{ row.code }}</td>
            <td>{{ row.totalPrice }}</td>
            <td>{{ row.customerName }}</td>
            <td>{{ row.customerAddress }}</td>
            <td class="text-center">
              <CBadge color="danger" v-if="row.deliveryStatus === 0">Cancelled</CBadge>
              <CBadge color="warning" v-if="row.deliveryStatus === 1">Pending</CBadge>
              <CBadge color="info" v-if="row.deliveryStatus === 2">Delivering</CBadge>
              <CBadge color="success" v-if="row.deliveryStatus === 3">Success</CBadge>
            </td>
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
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { userStore } from "@/stores/data/UserData";
import { ordersStore } from "@/stores/data/OrderData";

const userStoreInit = userStore();

const user = ref({ ...JSON.parse(sessionStorage.getItem("user")), password: "" });

const handleSubmit = (event) => {
  event.preventDefault();
  userStoreInit.updateProfile(user.value, parseInt(user.value.id));
};

const orderStoreInit = ordersStore();

const currentPage = ref(1);
const totalPages = ref(100);

let orderList = ref([]);
orderStoreInit.fetchUserOrders(user.value.id).then((response) => {
  orderList.value = response.filter((data) => data.status);
});

const filters = reactive({
  name: { value: "", keys: ["customerName"] },
  code: { value: "", keys: ["code"] },
});
</script>
