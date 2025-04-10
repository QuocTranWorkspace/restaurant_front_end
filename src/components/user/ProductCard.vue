<template>
  <CCard class="product-card card mt-3 mb-3 h-100">
    <CCardImage 
      class="card-img-top img-fluid" 
      orientation="top" 
      :src="imageUrl || fallbackImageUrl" 
      @error="handleImageError"
    />
    <CCardBody class="card-body d-flex flex-column">
      <CCardTitle class="card-title">{{ product.productName }}</CCardTitle>
      <CCardText class="card-text flex-grow-1">
        {{ product.productDescription }}
      </CCardText>
      <div
        class="d-flex justify-content-between mt-auto"
        v-if="product.originalPrice > product.salePrice"
      >
        <span class="text-muted text-decoration-line-through me-2">
          {{ formatCurrency(product.originalPrice) }}
        </span>
        <span class="text-success fw-bold">
          {{ formatCurrency(product.salePrice) }}
        </span>
      </div>
      <div v-else>
        <span class="text-success fw-bold">
          {{ formatCurrency(product.originalPrice) }}
        </span>
      </div>
      <div class="d-flex justify-content-between mt-2">
        <CButton color="primary" class="col-5" @click="handleDetail($event, product.id)"
          >Detail</CButton
        >
        <CButton color="success" class="col-5" @click="handleAdd($event, product.id)"
          >Add</CButton
        >
      </div>
    </CCardBody>
  </CCard>
  <CModal
    alignment="center"
    :visible="successModal"
    @close="() => (successModal = false)"
  >
    <CModalHeader>
      <CModalTitle>Register Successful</CModalTitle>
    </CModalHeader>
    <CModalBody>
      Add {{ product.productName }} successful! You can now
      <CLink href="/check-out">Check out</CLink>.
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="() => (successModal = false)">Close</CButton>
      <CButton color="primary" @click="redirectCheckout">Checkout</CButton>
    </CModalFooter>
  </CModal>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { cartStore } from "@/stores/data/CartData";
import { productStore } from "@/stores/data/ProductData"; // Import your product store
import router from "@/router";

const cartStoreInit = cartStore();
const productStoreInit = productStore(); // Initialize your product store
const successModal = ref(false);
const props = defineProps({
  product: null,
});

// Image handling
const imageLoaded = ref(false);
const imageError = ref(false);
const fallbackImageUrl = "https://via.placeholder.com/300x200?text=No+Image";

const imageUrl = computed(() => {
  if (!props.product || !props.product.id) return fallbackImageUrl;
  
  // Get URL from store or use fallback
  const url = productStoreInit.getProductImageUrl(props.product.id);
  return url || fallbackImageUrl;
});

// On component mount, fetch the image URL
onMounted(async () => {
  if (props.product && props.product.id) {
    try {
      await productStoreInit.fetchProductImageUrl(props.product.id);
    } catch (error) {
      console.error("Error loading image URL:", error);
    }
  }
});

// Handle image loading errors
const handleImageError = () => {
  imageError.value = true;
};

const formatCurrency = (value) => {
  if (typeof value !== "number") {
    return value;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value
  );
};

const handleDetail = (event, id) => {
  event.preventDefault();
  router.push(`/product/${id}`);
};

const handleAdd = (event, id) => {
  event.preventDefault();
  successModal.value = true;
  cartStoreInit.addToCart(id, 1);
};

const redirectCheckout = () => {
  router.push("/check-out");
};
</script>

<style scoped>
.product-card {
  max-height: 450px;
}

.card-img-top {
  height: 50%;
  object-fit: cover;
}

.card-text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
