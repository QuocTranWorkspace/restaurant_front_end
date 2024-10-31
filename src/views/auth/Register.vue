<template>
  <div class="bwrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CModal
        alignment="center"
        :visible="successModal"
        @close="
          () => {
            successModal = false;
          }
        "
      >
        <CModalHeader>
          <CModalTitle>Register Successfull</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Register successful, now you can
          <CLink href="http://localhost:3000/#/login">login</CLink>
          with this Account
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            @click="
              () => {
                successModal = false;
              }
            "
            >Close</CButton
          >
          <CButton color="primary" @click="redirectLogin">Log in</CButton>
        </CModalFooter>
      </CModal>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-4">
            <CCardBody class="p-4">
              <CForm
                class="row g-3 needs-validation"
                @submit="handleRegister"
                novalidate
                :validated="validateForm"
              >
                <h1>Register</h1>
                <p class="text-body-secondary">Create your account</p>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Username"
                    v-model="credentials.username"
                    required
                    @input="(event) => validateField('username', event)"
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Firstname"
                    autocomplete="firstname"
                    v-model="credentials.firstname"
                    required
                  />
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput
                    placeholder="Lastname"
                    v-model="credentials.lastname"
                    autocomplete="lastname"
                    required
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput
                    placeholder="Email"
                    autocomplete="email"
                    v-model="credentials.email"
                    required
                    @input="(event) => validateField('email', event)"
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Password"
                    autocomplete="new-password"
                    v-model="credentials.password"
                    required
                    @input="(event) => validateField('password', event)"
                  />
                </CInputGroup>
                <CInputGroup class="mb-4">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Repeat password"
                    autocomplete="new-password"
                    @input="(event) => validateField('repeatPassword', event)"
                    required
                  />
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
import { authStore } from "@/stores/auth/auth";
import { ref, reactive } from "vue";
import router from "@/router";
const authStoreRegister = authStore();

const successModal = ref(false);
const validateForm = ref();
const credentials = reactive({
  username: "",
  password: "",
  firstname: "",
  lastname: "",
  email: "",
});

const errors = reactive({
  username: "",
  password: "",
  email: "",
  repeatPassword: "",
});

const validateField = (field, event) => {
  errors[field] = "";
  // Validate username
  if (field === "username") {
    authStoreRegister.isUsernameAvaiable(event.target.value).then((value) => {
      if (!value) {
        errors[field] = `Username: "${credentials[field]}" has already existed`;
        event.target.setCustomValidity(errors[field]);
      }
    });
  }
  console.log(errors[field]);

  if (field === "password") {
    const pwdFilter = /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*[\d|@#$!%*?&])[\p{L}\d@#$!%*?&]{8,96}$/gmu;
    if (!pwdFilter.test(credentials.password)) {
      errors.password = `Password must contains at least 1 uppercase letter, digit, special character and more than 8 letters`;
    }
  }

  if (field === "repeatPassword") {
    if (credentials.password !== event.target.value) {
      errors.repeatPassword = `Does not match`;
    }
  }

  if (field === "email") {
    const emailFilter = /\S+@\S+\.\S+/;
    if (!emailFilter.test(credentials[field])) {
      errors[field] = `Email must follows: Example@example.sth`;
    }
  }
  event.target.setCustomValidity(errors[field]);
};

const redirectLogin = () => {
  router.push("/login");
};

const handleRegister = (event) => {
  const form = event.currentTarget;
  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
  } else {
    event.preventDefault();
    authStoreRegister.register(credentials);
    successModal.value = true;
  }
  validateForm.value = true;
};
</script>
