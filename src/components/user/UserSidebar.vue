<script setup>
import { UserSidebarNav } from "@/components/user/UserSidebarNav.js";
import { useSidebarStore } from "@/stores/sidebar.js";

const sidebar = useSidebarStore();
sidebar.visible = false;
</script>

<template>
  <CSidebar
    class="border-end"
    colorScheme="light"
    position="fixed"
    :unfoldable="sidebar.unfoldable"
    :visible="sidebar.visible"
    @visible-change="(value) => sidebar.toggleVisible(value)"
  >
    <CSidebarHeader class="border-bottom">
      <CSidebarBrand class="fs-5 text-decoration-none">
        <p>Category</p>
      </CSidebarBrand>
      <CCloseButton class="d-lg-none" dark @click="sidebar.toggleVisible()" />
    </CSidebarHeader>
    <UserSidebarNav />
  </CSidebar>
</template>
