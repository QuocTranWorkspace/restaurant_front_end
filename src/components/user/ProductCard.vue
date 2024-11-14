<template>
  <CCard style="width: 18rem" class="mt-3 mb-3">
    <CCardImage class="mt-3" orientation="top" :src="avatarSrc" />
    <CCardBody>
      <CCardTitle>{{ product.productName }}</CCardTitle>
      <CCardText>
        {{ product.productDescription }}
      </CCardText>
      <div class="d-flex justify-content-start align-items-center mb-2">
        <span style="text-decoration: line-through; color: gray; margin-right: 10px">
          {{ formatCurrency(product.originalPrice) }}
        </span>
        <span style="font-weight: bold; color: green">
          {{ formatCurrency(product.salePrice) }}
        </span>
      </div>
      <div class="d-flex justify-content-between">
        <CButton color="primary" href="#" class="col-5">Detail</CButton>
        <CButton
          color="success"
          class="col-5"
          @click="
            (event) => {
              handleAdd(event, product.id);
            }
          "
          >Add</CButton
        >
      </div>
    </CCardBody>
  </CCard>
</template>

<script setup>
import { computed } from "vue";
import { cartStore } from "@/stores/data/CartData";

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

const handleDetail = () => {};

const handleAdd = (event, id) => {
  event.preventDefault();
  cartStoreInit.addToCart(id, 1);
  console.log(cartStoreInit.getCart[0]["quantity"]);
};
</script>
