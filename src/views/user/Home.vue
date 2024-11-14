<template>
  <div class="container mt-5 mb-5" v-for="product in productList" :key="product.id">
    <ProductCard :product="product" />
  </div>
</template>

<script setup>
import ProductCard from "@/components/user/ProductCard.vue";
import { productStore } from "@/stores/data/ProductData";
import { ref, watch } from "vue";

const productStoreInit = productStore();

const props = defineProps({
  category: String,
});

let productList = ref([]);
productStoreInit.fetchProducts().then(() => {
  productList.value = productStoreInit.getProducts.filter((data) => data.status);
});

watch(
  () => props.category,
  (newCategory) => {
    console.log(newCategory);
    if (newCategory) {
      productStoreInit.fetchFilteredProducts(newCategory);
    } else {
      console.warn("Invalid category.");
    }
  },
  { immediate: true }
);
</script>
