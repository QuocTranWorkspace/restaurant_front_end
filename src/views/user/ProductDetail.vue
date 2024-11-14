<template>
  <div class="container mt-4 mb-5">
    <div class="row">
      <div class="col-md-6 text-center">
        <img :src="productImage" alt="Product Image" class="img-fluid rounded" />
      </div>

      <div class="col-md-6">
        <h2>{{ product.productName }}</h2>
        <div v-if="product.category" class="text-muted mb-2">
          Category: {{ product.category.categoryName }}
        </div>

        <div class="mb-4">
          <span
            v-if="product.originalPrice"
            class="text-muted me-2"
            style="text-decoration: line-through"
          >
            {{ formatCurrency(product.originalPrice) }}
          </span>
          <span class="fw-bold text-success">
            {{ formatCurrency(product.salePrice) }}
          </span>
        </div>

        <p>{{ product.productDescription }}</p>

        <button class="btn btn-primary" @click="(event) => handleAdd(event, product.id)">
          Add to Cart
        </button>
      </div>
    </div>
    <div class="mt-5 p-4 bg-light rounded">
      <h3>Comments</h3>
      <div class="mb-3">
        <h5>User 1</h5>
        <p>This product is amazing! Quality exceeded my expectations.</p>
        <hr />
      </div>
      <div class="mb-3">
        <h5>User 2</h5>
        <p>Good value for the price. Will recommend to friends.</p>
        <hr />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { productStore } from "@/stores/data/ProductData";
import { cartStore } from "@/stores/data/CartData";

const route = useRoute();
const productId = route.params.id;
const product = ref({});
const productStoreInit = productStore();
const cartStoreInit = cartStore();

onMounted(async () => {
  product.value = await productStoreInit.fetchProduct(productId);
});

const productImage = computed(() => {
  return product.value.avatar
    ? import.meta.env.VITE_BASE_IMG_URL + product.value.avatar
    : "";
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value
  );
};

const handleAdd = (event, id) => {
  event.preventDefault();
  cartStoreInit.addToCart(id, 1);
};

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      productStoreInit.fetchProduct(newId);
    } else {
      console.warn("Invalid product ID.");
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.container {
  max-width: 960px;
}

img {
  max-width: 100%;
  height: auto;
}

.text-muted {
  color: #6c757d;
}
</style>
