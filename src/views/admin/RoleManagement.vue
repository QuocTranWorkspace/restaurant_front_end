<template>
  <div class="container mt-5">
    <div class="mb-3">
      <label for="nameFilter" class="form-label">Filter by Role Name:</label>
      <input
        id="nameFilter"
        type="text"
        class="form-control"
        v-model="filters.name.value"
        placeholder="Enter Order code"
      />
    </div>

    <VTable :data="orderList" :filters="filters" class="table table-hover table-bordered">
      <template #head>
        <tr>
          <th>#</th>
          <VTh sortKey="roleName">Role name</VTh>
          <th>Role Description</th>
        </tr>
      </template>
      <template #body="{ rows }">
        <tr v-for="row in rows" :key="row.guid">
          <td>{{ row.id }}</td>
          <td>{{ row.roleName }}</td>
          <td>{{ row.description }}</td>
        </tr>
      </template>
    </VTable>
  </div>
</template>

<script setup>
import { ordersStore } from "@/stores/data/OrderData";
import { reactive, ref } from "vue";

const orderStoreInit = ordersStore();

let orderList = ref([]);
orderStoreInit.fetchOrders().then(() => {
  orderList.value = orderStoreInit.getOrders;
});

const filters = reactive({
  name: { value: "", keys: ["customerName"] },
  code: { value: "", keys: ["code"] },
});
</script>
