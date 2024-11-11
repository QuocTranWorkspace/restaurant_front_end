<script setup>
import { CContainer } from "@coreui/vue";
import AppFooter from "@/components/admin/AdminFooter.vue";
import AppHeader from "@/components/admin/AdminHeader.vue";
import AppSidebar from "@/components/admin/AdminSidebar.vue";
</script>

<template>
  <div>
    <AppSidebar />
    <div class="wrapper d-flex flex-column min-vh-100">
      <AppHeader />
      <div class="body flex-grow-1">
        <CContainer class="px-4" lg>
          <router-view />
        </CContainer>
      </div>
      <AppFooter />
    </div>
  </div>
</template>
