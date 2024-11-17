<template>
  <CForm class="row g-3">
    <CCol md="6">
      <CFormLabel for="avatar">Avatar</CFormLabel>
      <CFormInput type="file" id="avatar" @change="handleFileUpload" />
    </CCol>
    <CCol md="6">
      <CFormLabel for="orderID">ID</CFormLabel>
      <CFormInput type="text" id="orderID" placeholder="ID" v-model="product.id" readonly/>
    </CCol>
    <CCol md="6">
      <CFormLabel for="productName">Product Name</CFormLabel>
      <CFormInput
        type="text"
        id="productName"
        placeholder="Some name"
        v-model="product.productName"
      />
    </CCol>
    <CCol md="6">
      <CFormLabel for="productDescription">Description</CFormLabel>
      <CFormInput
        type="text"
        id="productDescription"
        placeholder="Some descripion"
        v-model="product.productDescription"
      />
    </CCol>
    <CCol md="6">
      <CFormLabel for="originPrice">Original Price</CFormLabel>
      <CFormInput
        type="text"
        id="originPrice"
        placeholder="299$"
        v-model="product.originalPrice"
      />
    </CCol>
    <CCol md="6">
      <CFormLabel for="salePrice">Sale price</CFormLabel>
      <CFormInput
        type="text"
        id="salePrice"
        placeholder="199$"
        v-model="product.salePrice"
      />
    </CCol>
    <CCol xs="12">
      <CFormLabel for="category">Category</CFormLabel>
      <CFormSelect
        aria-label="Default select example"
        id="category"
        v-model="product.category"
        @change="handleCategoryChange"
      >
        <option
          v-for="category in categories"
          :key="category.id"
          :value="JSON.stringify(category)"
        >
          {{ category.categoryName }}
        </option>
      </CFormSelect>
    </CCol>
    <CCol xs="12">
      <CButton color="primary" type="submit" @click="handleSubmit">Save</CButton>
    </CCol>
  </CForm>
</template>

<script setup>
import { ref, watch } from "vue";
import { productStore } from "@/stores/data/ProductData";

const producStoreInit = productStore();

const props = defineProps({
  id: String,
});

const imageFile = ref(null);

const handleFileUpload = (event) => {
  imageFile.value = event.target.files[0];
};

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
  try {
    const formData = new FormData();
    if (imageFile.value) {
      formData.append("avatar", imageFile.value);
    }

    formData.append("category", JSON.parse(product.value.category).id);
    product.value.category = null;
    formData.append("product", JSON.stringify(product.value));

    producStoreInit.saveOrUpdateProduct(formData, parseInt(props.id));
  } catch (error) {
    console.error("Error uploading product:", error);
  }
};

const handleCategoryChange = (event) => {
  product.value.category = JSON.parse(event.target.value);
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
