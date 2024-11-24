<template>
  <CForm class="row g-3">
    <CCol md="12">
      <CFormLabel for="orderID">ID</CFormLabel>
      <CFormInput type="text" id="orderID" placeholder="ID" v-model="user.id" readonly />
    </CCol>

    <CCol md="6">
      <CFormLabel for="username">Username <AteriskField /></CFormLabel>
      <CFormInput
        type="text"
        id="username"
        placeholder="username"
        v-model="user.userName"
        @blur="validateField('userName', $event)"
      />
      <div v-if="errors.userName" class="text-danger">{{ errors.userName }}</div>
    </CCol>

    <CCol md="6">
      <CFormLabel for="emailU">Email <AteriskField /></CFormLabel>
      <CFormInput
        type="email"
        id="emailU"
        placeholder="Example@gmail.com"
        v-model="user.email"
        @blur="validateField('email', $event)"
      />
      <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
    </CCol>

    <CCol md="6">
      <CFormLabel for="firstName">First Name <AteriskField /></CFormLabel>
      <CFormInput
        type="text"
        id="firstName"
        placeholder="Some name"
        v-model="user.firstName"
        @blur="validateField('firstName', $event)"
      />
      <div v-if="errors.firstName" class="text-danger">{{ errors.firstName }}</div>
    </CCol>

    <CCol md="6">
      <CFormLabel for="lastName">Last Name <AteriskField /></CFormLabel>
      <CFormInput
        type="text"
        id="lastName"
        placeholder="Some name"
        v-model="user.lastName"
        @blur="validateField('lastName', $event)"
      />
      <div v-if="errors.lastName" class="text-danger">{{ errors.lastName }}</div>
    </CCol>

    <CCol md="6">
      <CFormLabel for="passwordU">Password <AteriskField /></CFormLabel>
      <CFormInput
        type="password"
        id="passwordU"
        placeholder="************"
        v-model="user.password"
        @blur="validateField('password', $event)"
      />
      <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
    </CCol>

    <CCol md="6">
      <CFormLabel>Role <AteriskField /></CFormLabel>
      <div class="d-flex">
        <CFormCheck
          v-for="role in fetchRoles"
          :key="role.roleName"
          :id="role.id"
          :value="role.roleName"
          :label="role.roleName"
          v-model="user.roles"
        />
      </div>
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

    <CCol xs="6">
      <CFormLabel for="address">Customer Address</CFormLabel>
      <CFormInput id="address" placeholder="Main Street etc." v-model="user.address" />
    </CCol>

    <CCol xs="12">
      <CButton color="primary" type="submit" @click="handleSubmit"
        >Save or Update</CButton
      >
    </CCol>
  </CForm>
</template>

<script setup>
import { ref, watch } from "vue";
import { userStore } from "@/stores/data/UserData";
import AteriskField from "@/components/AteriskField.vue";
import { authStore } from "@/stores/auth/auth";

const userStoreInit = userStore();

const authStoreRegister = authStore();

const props = defineProps({
  id: String,
});

const user = ref({
  id: "",
  userName: "",
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  roles: [],
  phone: "",
  address: "",
});

const errors = ref({
  userName: "",
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  phone: "",
  address: "",
});

const fetchRoles = ref([]);
(async () => {
  try {
    await userStoreInit.fetchRoles();
    fetchRoles.value = userStoreInit.getRoles;
  } catch (error) {
    console.log(error);
  }
})();

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

const emailRegex = /\S+@\S+\.\S+/;

const validateField = async (field, event) => {
  switch (field) {
    case "userName":
      if (!user.value.userName.trim()) {
        errors.value.userName = "Username is required.";
      } else {
        try {
          authStoreRegister
            .isUsernameAvaiable(user.value.userName.trim())
            .then((value) => {
              errors.value.userName = !value ? "Username already exists." : "";
            });
        } catch (error) {
          console.error("Error checking username existence:", error);
          errors.value.userName = "An error occurred. Please try again.";
        }
      }
      break;
    case "email":
      errors.value.email = emailRegex.test(user.value.email)
        ? ""
        : "Invalid email format.";
      break;
    case "firstName":
      errors.value.firstName = user.value.firstName.trim()
        ? ""
        : "First name is required.";
      break;
    case "lastName":
      errors.value.lastName = user.value.lastName.trim() ? "" : "Last name is required.";
      break;
    case "password":
      errors.value.password =
        event.target.value.trim().length >= 6
          ? ""
          : "Password must be at least 6 characters.";
      break;
    default:
      break;
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();

  await validateField("userName");
  validateField("email");
  validateField("firstName");
  validateField("lastName");
  validateField("password");

  const hasErrors = Object.values(errors.value).some((error) => error);
  if (!hasErrors) {
    userStoreInit.saveOrUpdateUser(user.value, parseInt(props.id));
    console.log("User saved:", user.value);
  } else {
    console.warn("Form contains errors:", errors.value);
  }
};

watch(
  () => props.id,
  (newId) => {
    if (!isNaN(parseInt(newId)) && parseInt(newId) >= 0) {
      fetchUserData(newId);
      userStoreInit.fetchRoles();
    } else {
      console.warn("Invalid user ID.");
    }
  },
  { immediate: true }
);
</script>
