<template>
  <CForm class="row g-3">
    <CCol md="6">
      <CFormLabel for="avatar">Avatar</CFormLabel>
      <CFormInput type="file" id="avatar" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="orderID">ID</CFormLabel>
      <CFormInput type="text" id="orderID" placeholder="ID" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="productName">Product Name</CFormLabel>
      <CFormInput type="text" id="productName" placeholder="Some name" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="productDescription">Description</CFormLabel>
      <CFormInput type="text" id="productDescription" placeholder="Some descripion" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="originPrice">Original Price</CFormLabel>
      <CFormInput type="text" id="originPrice" placeholder="299$" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="salePrice">Sale price</CFormLabel>
      <CFormInput type="text" id="salePrice" placeholder="199$" />
    </CCol>
    <CCol xs="12">
      <CFormSelect aria-label="Default select example">
        <option>Open this select menu</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3" disabled>Three</option>
      </CFormSelect>
    </CCol>
    <CCol xs="12">
      <CButton color="primary" type="submit">Save</CButton>
    </CCol>
  </CForm>
</template>

<script setup></script>
