<template>
  <CForm class="row g-3">
    <CCol md="12">
      <CFormLabel for="orderID">ID</CFormLabel>
      <CFormInput type="text" id="orderID" placeholder="ID" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="username">Username</CFormLabel>
      <CFormInput type="text" id="username" placeholder="username" />
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
      <CFormInput type="password" id="passwordU" placeholder="" />
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
      <CButton color="primary" type="submit">Save</CButton>
    </CCol>
  </CForm>
</template>

<script setup></script>
