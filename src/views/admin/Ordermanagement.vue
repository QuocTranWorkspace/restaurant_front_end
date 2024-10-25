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

    <VTable :data="orderList" :filters="filters" class="table table-hover table-bordered">
      <template #head>
        <tr>
          <th>#</th>
          <th>Code</th>
          <VTh sortKey="totalPrice">Total Price</VTh>
          <th>Customer</th>
          <th>Address</th>
        </tr>
      </template>
      <template #body="{ rows }">
        <tr v-for="row in rows" :key="row.guid">
          <td>{{ row.id }}</td>
          <td>{{ row.code }}</td>
          <td>{{ row.totalPrice }}</td>
          <td>{{ row.customerName }}</td>
          <td>{{ row.customerAddress }}</td>
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
