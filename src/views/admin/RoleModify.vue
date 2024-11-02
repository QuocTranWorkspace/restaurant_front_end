<template>
  <CForm class="row g-3">
    <CCol md="12">
      <CFormLabel for="roleID">ID</CFormLabel>
      <CFormInput type="text" id="roleID" placeholder="ID" v-model="role.id" />
    </CCol>
    <CCol md="12">
      <CFormLabel for="roleName">Role Name</CFormLabel>
      <CFormInput
        type="text"
        id="roleName"
        placeholder="Some name"
        v-model="role.roleName"
      />
    </CCol>
    <CCol md="12">
      <CFormLabel for="description">Description</CFormLabel>
      <CFormInput
        type="text"
        id="description"
        placeholder="Some description"
        v-model="role.roleDescription"
      />
    </CCol>
    <CCol xs="12">
      <CButton color="primary" type="submit" @click="handleSubmit">Save</CButton>
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

const role = ref({
  id: "",
  roleName: "",
  roleDescription: "",
});

const fetchRoleData = async (roleId) => {
  try {
    const fetchedRole = await userStoreInit.fetchRole(parseInt(roleId));
    if (fetchedRole) {
      role.value = fetchedRole;
    } else {
      console.warn("Role not found.");
    }
  } catch (error) {
    console.error("Error fetching role:", error);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  userStoreInit.saveOrUpdateRole(role.value, parseInt(props.id));
};

watch(
  () => props.id,
  (newId) => {
    if (!isNaN(parseInt(newId)) && parseInt(newId) >= 0) {
      fetchRoleData(newId);
    } else {
      console.warn("Invalid role ID.");
    }
  },
  { immediate: true }
);
</script>
