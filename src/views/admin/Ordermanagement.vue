<template>
  <div class="container mt-5">
    <div class="d-flex flex-row-reverse mb-3">
      <div class="ps-2">
        <label for="nameFilter" class="form-label">Filter by Code:</label>
        <input
          id="nameFilter"
          type="text"
          class="form-control"
          v-model="filters.name.value"
          placeholder="Enter Order code"
        />
      </div>
      <div>
        <label for="nameFilter" class="form-label">Filter by Name:</label>
        <input
          id="nameFilter"
          type="text"
          class="form-control"
          v-model="filters.code.value"
          placeholder="Enter customer name"
        />
      </div>
    </div>

    <VTable
      :data="orderList"
      :filters="filters"
      class="table table-hover table-bordered"
      :currentPage="currentPage"
      :pageSize="6"
      @totalPagesChanged="totalPages = $event"
    >
      <template #head>
        <tr>
          <th class="col-0">#</th>
          <th>Code</th>
          <VTh sortKey="totalPrice">Total Price</VTh>
          <th>Customer</th>
          <th>Address</th>
          <th class="text-center col-2">Actions</th>
        </tr>
      </template>

      <template #body="{ rows }">
        <tr v-for="row in rows" :key="row.guid">
          <td class="col-0">{{ row.id }}</td>
          <td>{{ row.code }}</td>
          <td>{{ row.totalPrice }}</td>
          <td>{{ row.customerName }}</td>
          <td>{{ row.customerAddress }}</td>
          <td class="d-flex justify-content-evenly">
            <div class="d-flex align-items-center justify-content-center gap-2">
              <CButton
                color="primary"
                class="p-0 d-flex align-items-center justify-content-center"
                style="width: 30px; height: 30px; border-radius: 8px"
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
                @click="deleteUser(row.id)"
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
import { ordersStore } from "@/stores/data/OrderData";
import { reactive, ref } from "vue";

const orderStoreInit = ordersStore();

const currentPage = ref(1);
const totalPages = ref(100);

let orderList = ref([]);
orderStoreInit.fetchOrders().then(() => {
  orderList.value = orderStoreInit.getOrders.filter((data) => data.status);
});

const deleteUser = (id) => {
  orderStoreInit.deleteOrder(id);
};

const filters = reactive({
  name: { value: "", keys: ["customerName"] },
  code: { value: "", keys: ["code"] },
});
</script>
