<template>
  <div class="container mt-5">
    <div class="d-flex flex-row-reverse mb-3">
      <div class="ps-2">
        <label for="nameFilter" class="form-label">Filter by Name:</label>
        <input
          id="nameFilter"
          type="text"
          class="form-control"
          v-model="filters.name.value"
          placeholder="Enter product name"
        />
      </div>
      <div>
        <label for="nameFilter" class="form-label">Filter by Category:</label>
        <input
          id="nameFilter"
          type="text"
          class="form-control"
          v-model="filters.category.value"
          placeholder="Enter category"
        />
      </div>
    </div>

    <VTable
      :data="productList"
      :filters="filters"
      class="table table-hover table-bordered"
      :currentPage="currentPage"
      :pageSize="6"
      @totalPagesChanged="totalPages = $event"
    >
      <template #head>
        <tr>
          <th class="col-0">#</th>
          <th>Name</th>
          <VTh sortKey="totalPrice">Original Price</VTh>
          <th>Sale Price</th>
          <th>Category</th>
          <th class="text-center col-2">Actions</th>
        </tr>
      </template>

      <template #body="{ rows }">
        <tr v-for="row in rows" :key="row.guid">
          <td class="col-0">{{ row.id }}</td>
          <td>{{ row.productName }}</td>
          <td>{{ row.originalPrice }}</td>
          <td>{{ row.salePrice }}</td>
          <td>{{ row.category }}</td>
          <td class="d-flex justify-content-evenly">
            <div class="d-flex align-items-center justify-content-center gap-2">
              <CButton
                color="primary"
                class="p-0 d-flex align-items-center justify-content-center"
                style="width: 30px; height: 30px; border-radius: 8px"
                @click="redirectUpdate(row.id)"
              >
                <font-awesome-icon :icon="['fas', 'info']" />
              </CButton>
              <CButton
                color="danger"
                class="p-0 d-flex align-items-center justify-content-center"
                style="width: 30px; height: 30px; border-radius: 8px"
                @click="deleteProduct(row.id)"
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
import { productStore } from "@/stores/data/ProductData";
import { reactive, ref } from "vue";
import router from "@/router";

const productStoreInit = productStore();

const currentPage = ref(1);
const totalPages = ref(100);

let productList = ref([]);
productStoreInit.fetchProducts().then(() => {
  let product = ref({
    id: "",
    avatar: "",
    category: "",
    createdDate: "",
    originalPrice: "",
    productDescription: "",
    productName: "",
    salePrice: "",
    status: "",
    updatedDate: "",
  });
  let productListTemp = productStoreInit.getProducts.filter((data) => data.status);
  for (let item of productListTemp) {
    if (item) {
      product.value = item;
      product.value.category = normalizeCategory(item.category);
    }
    productList.value.push(product.value);
  }
});

const normalizeCategory = (category) =>
  typeof category === "object" ? category.categoryName : category;

const redirectUpdate = (id) => {
  router.push({ path: `/admin/product/${id}`, props: true });
};

const deleteProduct = (id) => {
  productStoreInit.deleteProduct(id);
};

const filters = reactive({
  name: { value: "", keys: ["productName"] },
  category: { value: "", keys: ["category"] },
});
</script>
