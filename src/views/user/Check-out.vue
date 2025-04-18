<template>
  <div class="container mb-3">
    <div class="row">
      <!-- User Information Section -->
      <div class="col-md-6 p-4 bg-light section-left">
        <h3>User Information</h3>
        <form>
          <div class="mb-3 row">
            <div class="col-6">
              <label for="name" class="form-label">Last Name</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="user.lastName"
                readonly
                required
              />
            </div>
            <div class="col-6">
              <label for="name" class="form-label">First Name</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="user.firstName"
                readonly
                required
              />
            </div>
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
              required
            />
          </div>
          <div v-if="cartItems.length !== 0">
            <button
              type="submit"
              class="btn btn-primary"
              @click="(event) => submitCheckout(event)"
            >
              Proceed to Payment
            </button>
          </div>
          <div v-else>
            <button class="btn btn-danger">Don't have any product</button>
          </div>
        </form>
      </div>

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
                  :src="getProductImageUrl(item)"
                  alt=""
                  style="max-width: 60px; max-height: 60px"
                  @error="handleImageError($event, item.id)"
                />
              </div>
              <div>
                <h6 class="my-0">{{ item.productName }}</h6>
                <div class="quantity-controls d-flex align-items-center mt-1">
                  <button
                    class="btn btn-sm btn-secondary"
                    @click="updateQuantity(item.id, -1)"
                  >
                    -
                  </button>
                  <span class="mx-2">{{ item.quantity }}</span>
                  <button
                    class="btn btn-sm btn-secondary"
                    @click="updateQuantity(item.id, 1)"
                  >
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
    <CModal
      alignment="center"
      :visible="confirmModal"
      @close="
        () => {
          confirmModal = false;
        }
      "
      aria-labelledby="confirmModal"
    >
      <CModalHeader>
        <CModalTitle id="confirmModal">Order successful</CModalTitle>
      </CModalHeader>
      <CModalBody> Your order is being processed, please wait. </CModalBody>
      <CModalFooter>
        <CButton
          color="secondary"
          @click="
            () => {
              confirmModal = false;
            }
          "
        >
          Close
        </CButton>
        <CButton color="primary" @click="redirectHome">Home</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { cartStore } from "@/stores/data/CartData";
import { productStore } from "@/stores/data/ProductData";
import api from "@/api/api";
import router from "@/router";

const cartStoreInit = cartStore();
const productStoreInit = productStore();

const confirmModal = ref(false);
const user = ref(JSON.parse(sessionStorage.getItem("user")));
const cartItems = ref([]);

// Track image errors by product ID
const imageErrors = ref({});
const fallbackImageUrl = "https://via.placeholder.com/60x60?text=No+Image";

// Image URL cache to avoid repeated API calls
const imageUrlCache = ref({});

// Get image URL for a product in the cart
const getProductImageUrl = (item) => {
  // If we've previously had an error for this image, use fallback
  if (imageErrors.value[item.id]) {
    return fallbackImageUrl;
  }
  
  // If we already have the URL cached, use it
  if (imageUrlCache.value[item.id]) {
    return imageUrlCache.value[item.id];
  }
  
  // If no avatar, use fallback
  if (!item.avatar) {
    return fallbackImageUrl;
  }
  
  // Try to fetch the image URL asynchronously 
  fetchImageUrl(item.id);
  
  // Return a temporary loading placeholder while fetching
  return fallbackImageUrl;
};

// Fetch image URL from backend
const fetchImageUrl = async (productId) => {
  if (!productId || imageUrlCache.value[productId]) return;
  
  try {
    const response = await api.get(`/product/${productId}/image`);
    imageUrlCache.value[productId] = response.data.url;
    // Force a component update
    cartItems.value = [...cartItems.value];
  } catch (error) {
    console.error(`Failed to load image for product ${productId}:`, error);
    imageErrors.value[productId] = true;
  }
};

// Handle image loading errors
const handleImageError = (event, productId) => {
  event.target.src = fallbackImageUrl;
  imageErrors.value[productId] = true;
};

const loadCartItems = async () => {
  const cart = cartStoreInit.getCart;
  if (cart) {
    const productPromises = cart.map((item) =>
      productStoreInit.fetchProduct(item.id).then((product) => ({
        ...product,
        quantity: item.quantity,
      }))
    );

    cartItems.value = await Promise.all(productPromises);
    
    // Prefetch all image URLs for cart items
    cartItems.value.forEach(item => {
      if (item.id && item.avatar) {
        fetchImageUrl(item.id);
      }
    });
  }
};

onMounted(() => {
  loadCartItems();
});

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

const updateQuantity = (id, quantity) => {
  cartStoreInit.updateQuantity(id, quantity);
  loadCartItems();
};

const submitCheckout = (event) => {
  event.preventDefault();
  try {
    const formData = new FormData();
    if (user.value) {
      formData.append("user", JSON.stringify(user.value));
    }

    let orderData = [];

    for (let item of cartItems.value) {
      orderData.push({ productId: item.id, quantity: item.quantity });
    }

    formData.append("order", JSON.stringify(orderData));

    const response = cartStoreInit.saveOrUpdateOrder(formData);

    if (response) {
      confirmModal.value = true;
      sessionStorage.removeItem("cart");
    }
  } catch (error) {
    console.error("Error processing checkout:", error);
  }
};

const redirectHome = () => {
  router.push("/home");
};
</script>