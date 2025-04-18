<script setup>
import { onMounted, ref, computed } from "vue";
import { CHeaderNav, useColorModes } from "@coreui/vue";

import AppBreadcrumb from "@/components/user/UserBreadcrumb.vue";
import AppHeaderDropdownAccnt from "@/components/user/UserHeaderDropdownAccnt.vue";
import { useSidebarStore } from "@/stores/sidebar.js";

import { cartStore } from "@/stores/data/CartData";

const headerClassNames = ref("mb-4 p-0");
const { colorMode, setColorMode } = useColorModes("coreui-free-vue-admin-template-theme");
const sidebar = useSidebarStore();

const cartStoreInit = cartStore();

cartStoreInit.initState();

const cartSize = computed(() => cartStoreInit.getCart.length);

const userLogedin = sessionStorage.getItem("user");

onMounted(() => {
  document.addEventListener("scroll", () => {
    if (document.documentElement.scrollTop > 0) {
      headerClassNames.value = "mb-4 p-0 shadow-sm";
    } else {
      headerClassNames.value = "mb-4 p-0";
    }
  });
});
</script>

<template>
  <CHeader position="sticky" :class="headerClassNames">
    <CContainer class="border-bottom px-4" fluid>
      <CHeaderToggler @click="sidebar.toggleVisible()" style="margin-inline-start: -14px">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CHeaderNav class="d-none d-md-flex">
        <RouterLink custom to="/home" v-slot="{ href, navigate }">
          <CSidebarBrand
            v-bind="$attrs"
            as="a"
            :href="href"
            @click="navigate"
            class="d-flex align-items-center text-decoration-none fs-2"
          >
            <CNavLink href="/home" active> Restaurant </CNavLink>
          </CSidebarBrand>
        </RouterLink>
      </CHeaderNav>
      <CHeaderNav class="ms-auto">
        <CDropdown variant="nav-item" placement="bottom-end">
          <CDropdownToggle :caret="false">
            <CIcon v-if="colorMode === 'dark'" icon="cil-moon" size="lg" />
            <CIcon v-else-if="colorMode === 'light'" icon="cil-sun" size="lg" />
            <CIcon v-else icon="cil-contrast" size="lg" />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem
              :active="colorMode === 'light'"
              class="d-flex align-items-center"
              component="button"
              type="button"
              @click="setColorMode('light')"
            >
              <CIcon class="me-2" icon="cil-sun" size="lg" /> Light
            </CDropdownItem>
            <CDropdownItem
              :active="colorMode === 'dark'"
              class="d-flex align-items-center"
              component="button"
              type="button"
              @click="setColorMode('dark')"
            >
              <CIcon class="me-2" icon="cil-moon" size="lg" /> Dark
            </CDropdownItem>
            <CDropdownItem
              :active="colorMode === 'auto'"
              class="d-flex align-items-center"
              component="button"
              type="button"
              @click="setColorMode('auto')"
            >
              <CIcon class="me-2" icon="cil-contrast" size="lg" /> Auto
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
        <li class="nav-item py-1">
          <div class="vr h-100 mx-2 text-body text-opacity-75"></div>
        </li>
        <CNavItem>
          <CNavLink href="/check-out">
            <CIcon icon="cil-basket" size="lg"></CIcon>
            <CBadge color="secondary" v-model="cartSize">{{ cartSize }}</CBadge>
          </CNavLink>
        </CNavItem>
      </CHeaderNav>
      <div v-if="userLogedin" class="d-flex">
        <CHeaderNav>
          <li class="nav-item py-1">
            <div class="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdownAccnt />
        </CHeaderNav>
      </div>
      <div v-else class="d-flex">
        <CHeaderNav>
          <li class="nav-item py-1">
            <div class="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CHeaderNav class="ms-auto">
            <a href="/login" class="text-decoration-none">
              <RouterLink to="/login" custom v-slot="{ navigate }">
                <CNavLink @click="navigate">Login</CNavLink>
              </RouterLink>
            </a>
          </CHeaderNav>
          <li class="nav-item py-1">
            <div class="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CHeaderNav class="ms-auto">
            <a href="/register" class="text-decoration-none">
              <RouterLink to="/register" custom v-slot="{ navigate }">
                <CNavLink @click="navigate">Register</CNavLink>
              </RouterLink>
            </a>
          </CHeaderNav>
        </CHeaderNav>
      </div>
    </CContainer>
    <CContainer class="px-4" fluid>
      <AppBreadcrumb />
    </CContainer>
  </CHeader>
</template>
