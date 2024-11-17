<template>
  <CCard class="product-card card mt-3 mb-3 h-100">
    <CCardImage class="card-img-top img-fluid" orientation="top" :src="avatarSrc" />
    <CCardBody class="card-body d-flex flex-column">
      <CCardTitle class="card-title">{{ product.productName }}</CCardTitle>
      <CCardText class="card-text flex-grow-1">
        {{ product.productDescription }}
      </CCardText>
      <div class="d-flex justify-content-between mt-auto">
        <span class="text-muted text-decoration-line-through me-2">
          {{ formatCurrency(product.originalPrice) }}
        </span>
        <span class="text-success fw-bold">
          {{ formatCurrency(product.salePrice) }}
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
</template>

<script setup>
import { computed } from "vue";
import { cartStore } from "@/stores/data/CartData";
import router from "@/router";

const cartStoreInit = cartStore();

const props = defineProps({
  product: null,
});

const avatarSrc = computed(
  () => `${import.meta.env.VITE_BASE_IMG_URL}${props.product.avatar}`
);

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
  cartStoreInit.addToCart(id, 1);
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
