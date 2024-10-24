<template>
    <CRow>
    <CCol>
      <CCard>
        <CCardHeader>CoreUI Icons Free</CCardHeader>
        <CCardBody>
          <CRow class="text-center">
            <template v-for="(icon, iconName) in icons" :key="iconName">
              <CCol class="mb-5" :xs="3" :sm="2">
                <CIcon :content="icon" size="xxl" />
                <div>{{ toKebabCase(iconName) }}</div>
              </CCol>
            </template>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>