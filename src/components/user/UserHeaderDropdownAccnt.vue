<script setup>
import avatar from "@/assets/images/avatars/8.jpg";
import { authStore } from "@/stores/auth/auth";
import router from "@/router";
import { ref } from "vue";

const authStoreInit = authStore();

const isAdmin = ref(authStoreInit.getUser);
console.log(isAdmin.value);

const handleLogout = () => {
  authStoreInit.logout();
};

const handleProfile = () => {
  router.push("/profile");
};

const handleAdmin = () => {
  router.push("/admin");
};

const itemsCount = 42;
</script>

<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0 pe-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader
        component="h6"
        class="bg-body-secondary text-body-secondary fw-semibold mb-2 rounded-top"
      >
        Account
      </CDropdownHeader>
      <CDropdownItem>
        <CIcon icon="cil-bell" /> Updates
        <CBadge color="info" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownDivider />
      <CDropdownItem @click="handleProfile">
        <CIcon icon="cil-user" /> Profile
      </CDropdownItem>
      <CDropdownItem @click="handleAdmin" v-if="isAdmin">
        <CIcon icon="cil-settings" /> Admin
      </CDropdownItem>
      <CDropdownDivider />
      <CDropdownItem> <CIcon icon="cil-shield-alt" /> Lock Account </CDropdownItem>
      <CDropdownItem @click="handleLogout">
        <CIcon icon="cil-lock-locked" /> Logout
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>
