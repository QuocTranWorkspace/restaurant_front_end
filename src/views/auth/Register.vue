<template>
  <div class="bwrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CModal
        alignment="center"
        :visible="successModal"
        @close="() => (successModal = false)"
      >
        <CModalHeader>
          <CModalTitle>Register Successful</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Registration successful! You can now
          <CLink href="#/login">log in</CLink> with your new account.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" @click="() => (successModal = false)">Close</CButton>
          <CButton color="primary" @click="redirectLogin">Log in</CButton>
        </CModalFooter>
      </CModal>

      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-4">
            <CCardBody class="p-4">
              <CForm @submit="handleRegister" novalidate>
                <h1>Register</h1>
                <p class="text-medium-emphasis">Create your account</p>

                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Username"
                    v-model="credentials.username"
                    @input="(e) => validateField('username', e.target.value)"
                    required
                  />
                  <div v-if="errors.username" class="text-danger">
                    {{ errors.username }}
                  </div>
                </CInputGroup>

                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Firstname"
                    v-model="credentials.firstname"
                    required
                  />
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Lastname"
                    v-model="credentials.lastname"
                    required
                  />
                </CInputGroup>

                <CInputGroup class="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput
                    placeholder="Email"
                    v-model="credentials.email"
                    @input="(e) => validateField('email', e.target.value)"
                    required
                  />
                  <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
                </CInputGroup>

                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Password"
                    v-model="credentials.password"
                    @input="(e) => validateField('password', e.target.value)"
                    required
                  />
                  <div v-if="errors.password" class="text-danger">
                    {{ errors.password }}
                  </div>
                </CInputGroup>

                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Repeat password"
                    @input="(e) => validateField('repeatPassword', e.target.value)"
                    required
                  />
                  <div v-if="errors.repeatPassword" class="text-danger">
                    {{ errors.repeatPassword }}
                  </div>
                </CInputGroup>

                <div class="d-grid">
                  <CButton color="success" type="submit">Create Account</CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { authStore } from "@/stores/auth/auth";
import router from "@/router";

const authStoreRegister = authStore();
const successModal = ref(false);

const credentials = reactive({
  username: "",
  firstname: "",
  lastname: "",
  email: "",
  password: "",
});

const errors = reactive({
  username: "",
  email: "",
  password: "",
  repeatPassword: "",
});

const validateField = async (field, value) => {
  errors[field] = "";

  if (field === "username") {
    if (!value.trim()) {
      errors.username = "Username is required.";
    } else {
      const isAvailable = await authStoreRegister.isUsernameAvaiable(value);
      if (!isAvailable) errors.username = "Username is already taken.";
    }
  } else if (field === "email") {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(value)) {
      errors.email = "Invalid email format.";
    }
  } else if (field === "password") {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
    if (!passwordRegex.test(value)) {
      errors.password =
        "Password must be at least 8 characters, include an uppercase, a number, and a special character.";
    }
  } else if (field === "repeatPassword") {
    console.log(value, credentials.password);
    if (value !== credentials.password) {
      errors.repeatPassword = "Passwords do not match.";
    }
  }
};

const handleRegister = async (event) => {
  event.preventDefault();
  await validateField("username", credentials.username);
  validateField("email", credentials.email);
  validateField("password", credentials.password);

  if (!Object.values(errors).some((error) => error)) {
    await authStoreRegister.register(credentials);
    successModal.value = true;
  }
};

const redirectLogin = () => {
  router.push("/login");
};
</script>
