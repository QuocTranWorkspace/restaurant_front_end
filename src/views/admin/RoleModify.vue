<template>
  <CForm class="row g-3">
    <CCol md="12">
      <CFormLabel for="roleID">ID</CFormLabel>
      <CFormInput type="text" id="roleID" placeholder="ID" />
    </CCol>
    <CCol md="12">
      <CFormLabel for="roleName">Role Name</CFormLabel>
      <CFormInput type="text" id="roleName" placeholder="Some name" />
    </CCol>
    <CCol md="12">
      <CFormLabel for="description">Description</CFormLabel>
      <CFormInput type="text" id="description" placeholder="Some description" />
    </CCol>
    <CCol xs="12">
      <CButton color="primary" type="submit">Save</CButton>
    </CCol>
  </CForm>
</template>

<script setup></script>
