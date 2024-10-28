<template>
  <CForm class="row g-3">
    <CCol md="6">
      <CFormLabel for="orderID">ID</CFormLabel>
      <CFormInput type="text" id="orderID" placeholder="ID" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="code">Code</CFormLabel>
      <CFormInput type="text" id="code" placeholder="Code" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="customerName">Customer Name</CFormLabel>
      <CFormInput type="text" id="customerName" placeholder="Some name" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="customerEmail">Customer Email</CFormLabel>
      <CFormInput type="email" id="customerEmail" placeholder="Example@gmail.com" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="customerPhone">Customer Phone</CFormLabel>
      <CFormInput type="text" id="customerPhone" placeholder="09********" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="customerAddress">Customer Address</CFormLabel>
      <CFormInput type="email" id="customerAddress" placeholder="Hanoi e.t.c" />
    </CCol>
    <CCol xs="12">
      <CFormLabel for="totalPrice">Total Price</CFormLabel>
      <CFormInput id="totalPrice" placeholder="199$" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="orderDate">Order Date</CFormLabel>
      <CFormInput id="orderDate" placeholder="MM-DD-YY HH:MM:SS" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="deliverDate">Deliver Date</CFormLabel>
      <CFormInput id="deliverDate" placeholder="MM-DD-YY HH:MM:SS" />
    </CCol>
    <CCol xs="12">
      <CButton color="primary" type="submit">Save</CButton>
    </CCol>
  </CForm>
</template>

<script setup></script>
