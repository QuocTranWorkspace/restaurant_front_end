<template>
  <CForm class="row g-3">
    <CCol md="12">
      <CFormLabel for="roleID">ID</CFormLabel>
      <CFormInput type="text" id="roleID" placeholder="ID" v-model="role.id" readonly />
    </CCol>

    <CCol md="12">
      <CFormLabel for="roleName">Role Name <AteriskField /></CFormLabel>
      <CFormInput
        type="text"
        id="roleName"
        placeholder="Some name"
        v-model="role.roleName"
        @blur="validateField('roleName')"
      />
      <div v-if="errors.roleName" class="text-danger">{{ errors.roleName }}</div>
    </CCol>

    <CCol md="12">
      <CFormLabel for="description">Description</CFormLabel>
      <CFormInput
        type="text"
        id="description"
        placeholder="Some description"
        v-model="role.roleDescription"
        @blur="validateField('roleDescription')"
      />
      <div v-if="errors.roleDescription" class="text-danger">
        {{ errors.roleDescription }}
      </div>
    </CCol>

    <CCol xs="12">
      <CButton color="primary" type="submit" @click="handleSubmit">Save</CButton>
    </CCol>
  </CForm>
</template>

<script setup>
import { ref, watch } from "vue";
import { userStore } from "@/stores/data/UserData";
import AteriskField from "@/components/AteriskField.vue";

const userStoreInit = userStore();

const props = defineProps({
  id: String,
});

const role = ref({
  id: "",
  roleName: "",
  roleDescription: "",
});

const errors = ref({
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

const validateField = (field) => {
  switch (field) {
    case "roleName":
      errors.value.roleName = role.value.roleName.trim() ? "" : "Role Name is required.";
      break;
    case "roleDescription":
      errors.value.roleDescription = role.value.roleDescription.trim()
        ? ""
        : "Description is optional but should not be empty if provided.";
      break;
    default:
      break;
  }
};

const handleSubmit = (event) => {
  event.preventDefault();

  validateField("roleName");
  validateField("roleDescription");

  const hasErrors = Object.values(errors.value).some((error) => error);
  if (!hasErrors) {
    userStoreInit.saveOrUpdateRole(role.value, parseInt(props.id));
    console.log("Role saved:", role.value);
  } else {
    console.warn("Form contains errors:", errors.value);
  }
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
