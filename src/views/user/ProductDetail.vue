<template>
  <div class="container mt-4 mb-5">
    <div class="row">
      <div class="col-md-6 text-center">
        <!-- Add loading and error states for the image -->
        <div v-if="isLoadingImage" class="d-flex justify-content-center align-items-center" style="height: 300px;">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <img 
          v-else
          :src="productImage" 
          alt="Product Image" 
          class="img-fluid rounded" 
          @error="handleImageError"
        />
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
import api from "@/api/api";

const route = useRoute();
const productId = route.params.id;
const product = ref({});
const productStoreInit = productStore();
const cartStoreInit = cartStore();
const imageUrl = ref("");
const isLoadingImage = ref(true);
const hasImageError = ref(false);
const fallbackImageUrl = "https://via.placeholder.com/400x300?text=No+Image+Available";

// Load product data and image URL
const loadProductData = async (id) => {
  try {
    // Reset loading states
    isLoadingImage.value = true;
    hasImageError.value = false;
    
    // Fetch product details
    product.value = await productStoreInit.fetchProduct(id);
    
    // If product has an avatar, fetch its URL
    if (product.value && product.value.avatar) {
      try {
        const response = await api.get(`/product/${id}/image`);
        imageUrl.value = response.data.url;
      } catch (error) {
        console.error("Failed to load image URL:", error);
        hasImageError.value = true;
      }
    } else {
      hasImageError.value = true;
    }
  } catch (error) {
    console.error("Error loading product:", error);
  } finally {
    isLoadingImage.value = false;
  }
};

onMounted(() => {
  loadProductData(productId);
});

// Computed property for product image with fallback
const productImage = computed(() => {
  if (hasImageError.value) return fallbackImageUrl;
  return imageUrl.value || fallbackImageUrl;
});

// Handle image loading errors
const handleImageError = () => {
  hasImageError.value = true;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value
  );
};

const handleAdd = (event, id) => {
  event.preventDefault();
  cartStoreInit.addToCart(id, 1);
};

// Watch for changes in the route parameter
watch(
  () => route.params.id,
  (newId) => {
    if (newId && newId !== productId) {
      loadProductData(newId);
    }
  }
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