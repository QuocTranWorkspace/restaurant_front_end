<script setup>
import { CContainer } from "@coreui/vue";
import AppFooter from "@/components/user/userFooter.vue";
import AppHeader from "@/components/user/userHeader.vue";
import AppSidebar from "@/components/user/userSidebar.vue";
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
