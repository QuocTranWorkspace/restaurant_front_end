<template>
  <div class="container mt-5">
    <div class="d-flex flex-row-reverse mb-3">
      <div class="ps-2">
        <label for="nameFilter" class="form-label">Filter by Name:</label>
        <input
          id="nameFilter"
          type="text"
          class="form-control"
          v-model="filters.fullname.value"
          placeholder="Enter Name"
        />
      </div>
      <div>
        <label for="nameFilter" class="form-label">Filter by Email:</label>
        <input
          id="nameFilter"
          type="text"
          class="form-control"
          v-model="filters.email.value"
          placeholder="Enter customer email"
        />
      </div>
    </div>

    <VTable
      :data="userList"
      :filters="filters"
      class="table table-hover table-bordered"
      :currentPage="currentPage"
      :pageSize="6"
      @totalPagesChanged="totalPages = $event"
    >
      <template #head>
        <tr>
          <th class="col-0">#</th>
          <th>Username</th>
          <th>Full name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Address</th>
          <th class="text-center col-2">Actions</th>
        </tr>
      </template>

      <template #body="{ rows }">
        <tr v-for="row in rows" :key="row.guid">
          <td>{{ row.id }}</td>
          <td>{{ row.userName }}</td>
          <td>{{ row.firstName + " " + row.lastName }}</td>
          <td>{{ row.email }}</td>
          <td>{{ row.phone }}</td>
          <td>{{ row.address }}</td>
          <td class="d-flex justify-content-evenly">
            <div class="d-flex align-items-center justify-content-center gap-2">
              <CButton
                color="primary"
                class="p-0 d-flex align-items-center justify-content-center"
                style="width: 30px; height: 30px; border-radius: 8px"
                @click="redirectDetail(row.id)"
              >
                <font-awesome-icon :icon="['fas', 'info']" />
              </CButton>
              <CButton
                color="secondary"
                class="p-0 d-flex align-items-center justify-content-center"
                style="width: 30px; height: 30px; border-radius: 8px"
              >
                <font-awesome-icon :icon="['fas', 'pen-to-square']" />
              </CButton>
              <CButton
                color="danger"
                class="p-0 d-flex align-items-center justify-content-center"
                style="width: 30px; height: 30px; border-radius: 8px"
              >
                <font-awesome-icon :icon="['fas', 'trash-can']" />
              </CButton>
            </div>
          </td>
        </tr>
      </template>
    </VTable>
    <div class="container mt-5 d-flex justify-content-center">
      <VTPagination
        v-model:currentPage="currentPage"
        :total-pages="totalPages"
        :boundary-links="true"
      />
    </div>
  </div>
</template>

<script setup>
import { userStore } from "@/stores/data/UserData";
import { reactive, ref } from "vue";
import router from "@/router";

const userStoreInit = userStore();

const currentPage = ref(1);
const totalPages = ref(100);

let userList = ref([]);
userStoreInit.fetchUsers().then(() => {
  userList.value = userStoreInit.getUsers;
});

const redirectDetail = (id) => {
  router.push({ path: `/admin/user/${id}`, props: true });
};

const filters = reactive({
  fullname: { value: "", keys: ["firstName", "lastName"] },
  email: { value: "", keys: ["email"] },
});
</script>
