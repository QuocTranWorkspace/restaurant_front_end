<template>
  <div class="container mb-3">
    <div class="row">
      <!-- User Information Section -->
      <div class="col-md-6 p-4 bg-light section-left">
        <h3>User Information</h3>
        <form>
          <div class="mb-3">
            <label for="name" class="form-label">Full Name</label>
            <input
              type="text"
              class="form-control"
              id="name"
              v-model="user.lastName"
              readonly
              required
            />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email Address</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="user.email"
              readonly
              required
            />
          </div>
          <div class="mb-3">
            <label for="phone" class="form-label">Phone</label>
            <input
              type="text"
              class="form-control"
              id="phone"
              v-model="user.phone"
              readonly
              required
            />
          </div>
          <div class="mb-3">
            <label for="address" class="form-label">Address</label>
            <input
              type="text"
              class="form-control"
              id="address"
              v-model="user.address"
              readonly
              required
            />
          </div>
          <div v-if="cartItems.length !== 0">
            <button type="submit" class="btn btn-primary" @click="submitCheckout">
              Proceed to Payment
            </button>
          </div>
          <div v-else>
            <button class="btn btn-danger">Don't have any product</button>
          </div>
        </form>
      </div>

      <!-- Cart Details Section -->
      <div class="col-md-6 p-4 bg-secondary text-white section-right">
        <h3>Cart Details</h3>
        <ul class="list-group mb-3">
          <li
            v-for="item in cartItems"
            :key="item.id"
            class="list-group-item d-flex justify-content-between"
          >
            <div class="d-flex">
              <div>
                <img
                  :src="image(item.avatar)"
                  alt=""
                  style="max-width: 60px; max-height: 60px"
                />
              </div>
              <div>
                <h6 class="my-0">{{ item.productName }}</h6>
                <div class="quantity-controls d-flex align-items-center mt-1">
                  <button class="btn btn-sm btn-secondary" @click="updateQuantity(1, -1)">
                    -
                  </button>
                  <span class="mx-2">{{ item.quantity }}</span>
                  <button class="btn btn-sm btn-secondary" @click="updateQuantity(1, 1)">
                    +
                  </button>
                </div>
              </div>
            </div>
            <span class="text-muted">{{
              formatCurrency(item.salePrice * item.quantity)
            }}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>Total (USD)</span>
            <strong>{{ formatCurrency(total) }}</strong>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { cartStore } from "@/stores/data/CartData";
import { productStore } from "@/stores/data/productData";

const cartStoreInit = cartStore();
const productStoreInit = productStore();

const user = ref(JSON.parse(sessionStorage.getItem("user")));

console.log(user.value);

const cart = cartStoreInit.getCart;

const cartItems = ref([]);

const loadCartItems = () => {
  cartItems.value = [];
  const cart = cartStoreInit.getCart;

  // Fetch each product by ID and merge quantity
  for (let item of cart) {
    productStoreInit.fetchProduct(item.id).then((product) => {
      cartItems.value.push({ ...product, quantity: item.quantity });
    });
  }
};

loadCartItems();

const formatCurrency = (value) => {
  if (typeof value !== "number") {
    return value;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value
  );
};

const total = computed(() =>
  cartItems.value.reduce((acc, item) => acc + item.salePrice * item.quantity, 0)
);

const image = (imagePath) => {
  return import.meta.env.VITE_BASE_IMG_URL + imagePath;
};

const updateQuantity = (id, quantity) => {
  console.log(id, quantity);
  cartStoreInit.updateQuantity(id, quantity);
  loadCartItems();
};

const submitCheckout = () => {
  console.log("User info:", user.value);
  console.log("Total price:", total.value);
  alert("Checkout completed");
};
</script>
