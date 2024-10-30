<template>
  <CForm class="row g-3">
    <CCol md="12">
      <CFormLabel for="orderID">ID</CFormLabel>
      <CFormInput type="text" id="orderID" placeholder="ID" v-model="user.id" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="username">Username</CFormLabel>
      <CFormInput
        type="text"
        id="username"
        placeholder="username"
        v-model="user.username"
      />
    </CCol>
    <CCol md="6">
      <CFormLabel for="emailU">Email</CFormLabel>
      <CFormInput type="email" id="emailU" placeholder="Example@gmail.com" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="firstName">First Name</CFormLabel>
      <CFormInput type="text" id="firstName" placeholder="Some name" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="lastName">Last Name</CFormLabel>
      <CFormInput type="text" id="lastName" placeholder="Some name" />
    </CCol>
    <CCol md="12">
      <CFormLabel for="passwordU">Password</CFormLabel>
      <CFormInput type="password" id="passwordU" placeholder="Some password" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="phone">Customer Phone</CFormLabel>
      <CFormInput type="text" id="phone" placeholder="09********" />
    </CCol>
    <CCol xs="6">
      <CFormLabel for="address">Customer Address</CFormLabel>
      <CFormInput id="address" placeholder="Hanoi e.t.c" />
    </CCol>
    <CCol xs="12">
      <CButton color="primary" type="submit">Save or Update</CButton>
    </CCol>
  </CForm>
</template>

<script setup>
import { ref, watch } from "vue";
import { userStore } from "@/stores/data/UserData";

const userStoreInit = userStore();

const props = defineProps({
  id: String,
});

const user = ref({
  id: "",
  username: "",
});

const fetchUserData = async (userId) => {
  try {
    const fetchedUser = await userStoreInit.fetchUser(parseInt(userId));
    if (fetchedUser) {
      user.value = fetchedUser;
    } else {
      console.warn("User not found.");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

watch(
  () => props.id,
  (newId) => {
    if (!isNaN(parseInt(newId)) && parseInt(newId) >= 0) {
      fetchUserData(newId);
    } else {
      console.warn("Invalid user ID."); // Avoid noisy errors for invalid IDs
    }
  },
  { immediate: true }
);
</script>
