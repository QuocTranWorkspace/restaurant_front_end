<template>
  <CForm class="row g-3">
    <!-- Avatar -->
    <CCol md="6">
      <CFormLabel for="avatar">Avatar</CFormLabel>
      <CFormInput type="file" id="avatar" @change="handleFileUpload" />
      <div v-if="errors.avatar" class="text-danger">{{ errors.avatar }}</div>
    </CCol>

    <!-- Product Name -->
    <CCol md="6">
      <CFormLabel for="productName">Product Name <AteriskField /></CFormLabel>
      <CFormInput
        type="text"
        id="productName"
        placeholder="Some name"
        v-model="product.productName"
        @blur="validateField('productName')"
      />
      <div v-if="errors.productName" class="text-danger">{{ errors.productName }}</div>
    </CCol>

    <!-- Original Price -->
    <CCol md="6">
      <CFormLabel for="originPrice">Original Price <AteriskField /></CFormLabel>
      <CFormInput
        type="text"
        id="originPrice"
        placeholder="299$"
        v-model="product.originalPrice"
        @blur="validateField('originalPrice')"
      />
      <div v-if="errors.originalPrice" class="text-danger">
        {{ errors.originalPrice }}
      </div>
    </CCol>

    <!-- Sale Price -->
    <CCol md="6">
      <CFormLabel for="salePrice">Sale Price <AteriskField /></CFormLabel>
      <CFormInput
        type="text"
        id="salePrice"
        placeholder="199$"
        v-model="product.salePrice"
        @blur="validateField('salePrice')"
      />
      <div v-if="errors.salePrice" class="text-danger">{{ errors.salePrice }}</div>
    </CCol>

    <!-- Category -->
    <CCol xs="12">
      <CFormLabel for="category">Category <AteriskField /></CFormLabel>
      <CFormSelect
        id="category"
        v-model="product.category"
        @change="validateField('category')"
      >
        <option
          v-for="category in categories"
          :key="category.id"
          :value="JSON.stringify(category)"
        >
          {{ category.categoryName }}
        </option>
      </CFormSelect>
      <div v-if="errors.category" class="text-danger">{{ errors.category }}</div>
    </CCol>
    <CCol xs="12">
      <CButton color="primary" type="submit" @click="handleSubmit">Save</CButton>
    </CCol>
  </CForm>
</template>

<script setup>
import { ref, watch } from "vue";
import { productStore } from "@/stores/data/ProductData";
import AteriskField from "@/components/AteriskField.vue";

const producStoreInit = productStore();

const props = defineProps({
  id: String,
});

const imageFile = ref(null);

const product = ref({
  id: "",
  avatar: "",
  productName: "",
  originalPrice: "",
  salePrice: "",
  productDescription: "",
  category: "Open this select menu",
});

const categories = ref([]);

producStoreInit.fetchCategories().then(() => {
  categories.value = producStoreInit.getCategories;
  console.log(
    JSON.stringify(product.value.category) === JSON.stringify(categories.value[0])
  );
  product.value.category = JSON.stringify(fetchProductData);
});

const fetchProductData = async (productId) => {
  try {
    const fetchedProduct = await producStoreInit.fetchProduct(parseInt(productId));

    if (fetchedProduct) {
      product.value = fetchedProduct;
      product.value.category = JSON.stringify(fetchProductData);
    } else {
      console.warn("Product not found.");
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  validateField("productName");
  validateField("originalPrice");
  validateField("salePrice");
  validateField("category");

  const hasErrors = Object.values(errors.value).some((error) => error);
  if (!hasErrors) {
    const formData = new FormData();
    if (imageFile.value) {
      formData.append("avatar", imageFile.value);
    }

    formData.append("category", JSON.parse(product.value.category).id);
    product.value.category = null;
    formData.append("product", JSON.stringify(product.value));

    producStoreInit.saveOrUpdateProduct(formData, parseInt(props.id));
  } else {
    console.warn("Form validation failed.", errors);
  }
};

const errors = ref({});

const handleFileUpload = (event) => {
  imageFile.value = event.target.files[0];
  if (!imageFile.value) {
    errors.value.avatar = "Avatar is required.";
  } else {
    errors.value.avatar = "";
  }
};

const validateField = (field) => {
  switch (field) {
    case "productName":
      errors.value.productName = product.value.productName
        ? ""
        : "Product Name is required.";
      break;
    case "originalPrice":
      errors.value.originalPrice = product.value.originalPrice
        ? ""
        : "Original Price is required.";
      break;
    case "salePrice":
      errors.value.salePrice = product.value.salePrice ? "" : "Sale Price is required.";
      break;
    case "category":
      errors.value.category = product.value.category ? "" : "Category is required.";
      break;
    default:
      break;
  }
};

watch(
  () => props.id,
  (newId) => {
    if (!isNaN(parseInt(newId)) && parseInt(newId) >= 0) {
      fetchProductData(newId);
    } else {
      console.warn("Invalid product ID.");
    }
  },
  { immediate: true }
);
</script>
