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
import { ref, watch, onMounted } from "vue";
import { productStore } from "@/stores/data/ProductData";
import AteriskField from "@/components/AteriskField.vue";

// Correct variable naming
const productStoreInit = productStore();

const props = defineProps({
  id: String,
});

const imageFile = ref(null);

// Initialize product with proper default values
const product = ref({
  id: "",
  avatar: "",
  productName: "",
  originalPrice: "",
  salePrice: "",
  productDescription: "",
  category: null,
});

const categories = ref([]);

// Load categories on component mount
onMounted(async () => {
  await productStoreInit.fetchCategories();
  categories.value = productStoreInit.getCategories;
  
  // If editing an existing product, fetch it
  if (props.id && !isNaN(parseInt(props.id))) {
    await fetchProductData(props.id);
  }
});

// Function to fetch product data when editing
const fetchProductData = async (productId) => {
  try {
    const fetchedProduct = await productStoreInit.fetchProduct(parseInt(productId));

    if (fetchedProduct) {
      // Set product values
      product.value = {...fetchedProduct};
      
      // Find and set the matching category
      if (fetchedProduct.category && fetchedProduct.category.id) {
        const matchingCategory = categories.value.find(
          cat => cat.id === fetchedProduct.category.id
        );
        
        if (matchingCategory) {
          product.value.category = JSON.stringify(matchingCategory);
        }
      }
    } else {
      console.warn("Product not found.");
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  
  // Validate all fields
  validateField("productName");
  validateField("originalPrice");
  validateField("salePrice");
  validateField("category");

  const hasErrors = Object.values(errors.value).some((error) => error);
  if (!hasErrors) {
    try {
      // Extract categoryId from the selected category
      let categoryId = null;
      if (product.value.category) {
        try {
          const categoryObj = JSON.parse(product.value.category);
          categoryId = categoryObj.id;
        } catch (e) {
          console.error("Error parsing category data:", e);
          errors.value.category = "Invalid category format";
          return;
        }
      }
      
      // Create a clean copy of the product for submission
      const productForSubmission = {...product.value};
      
      // Remove the stringified category to prevent duplication
      delete productForSubmission.category;
      
      // Call the updated method with separate parameters
      await productStoreInit.saveOrUpdateProduct(
        productForSubmission,
        parseInt(props.id) || null,
        categoryId,
        imageFile.value
      );
      
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("An error occurred while saving the product. Please try again.");
    }
  } else {
    console.warn("Form validation failed.", errors.value);
  }
};

const errors = ref({
  productName: "",
  originalPrice: "",
  salePrice: "",
  category: "",
  avatar: ""
});

const handleFileUpload = (event) => {
  imageFile.value = event.target.files[0];
  errors.value.avatar = ""; // Clear previous error
};

const validateField = (field) => {
  switch (field) {
    case "productName":
      errors.value.productName = product.value.productName
        ? ""
        : "Product Name is required.";
      break;
    case "originalPrice":
      if (!product.value.originalPrice) {
        errors.value.originalPrice = "Original Price is required.";
      } else if (isNaN(parseFloat(product.value.originalPrice))) {
        errors.value.originalPrice = "Original Price must be a number.";
      } else {
        errors.value.originalPrice = "";
      }
      break;
    case "salePrice":
      if (!product.value.salePrice) {
        errors.value.salePrice = "Sale Price is required.";
      } else if (isNaN(parseFloat(product.value.salePrice))) {
        errors.value.salePrice = "Sale Price must be a number.";
      } else {
        errors.value.salePrice = "";
      }
      break;
    case "category":
      errors.value.category = product.value.category ? "" : "Category is required.";
      break;
    default:
      break;
  }
};

// Watch for changes to the ID prop
watch(
  () => props.id,
  (newId) => {
    if (newId && !isNaN(parseInt(newId))) {
      fetchProductData(newId);
    }
  }
);
</script>