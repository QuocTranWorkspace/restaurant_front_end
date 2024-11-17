<template>
  <div class="container mt-5 mb-5">
    <div class="row">
      <div
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        v-for="product in productList"
        :key="product.id"
      >
        <ProductCard :product="product" />
      </div>
    </div>
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

const productList = ref([]);

const fetchProducts = async (category) => {
  try {
    if (category) {
      await productStoreInit.fetchFilteredProducts(category);
    } else {
      await productStoreInit.fetchProducts();
    }
    productList.value = productStoreInit.getProducts.filter((data) => data.status);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

fetchProducts(props.category);

watch(
  () => props.category,
  (newCategory) => {
    fetchProducts(newCategory);
  },
  { immediate: true }
);
</script>
