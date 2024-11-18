<template>
  <CForm class="row g-3" @submit="handleSubmit" novalidate>
    <CCol md="12">
      <CFormLabel for="categoryID"> ID</CFormLabel>
      <CFormInput
        type="text"
        id="categoryID"
        placeholder="ID"
        v-model="category.id"
        readonly
      />
    </CCol>
    <CCol md="12">
      <CFormLabel for="categoryName"> Category Name <AteriskField /> </CFormLabel>
      <CFormInput
        type="text"
        id="categoryName"
        placeholder="Some name"
        v-model="category.categoryName"
        @blur="validateField('categoryName')"
      />
      <div v-if="errors.categoryName" class="text-danger">{{ errors.categoryName }}</div>
    </CCol>
    <CCol md="12">
      <CFormLabel for="description">Description</CFormLabel>
      <CFormInput
        type="text"
        id="description"
        placeholder="Some description"
        v-model="category.categoryDescription"
        @input="validateField('categoryDescription', $event)"
      />
      <span class="text-danger">{{ errors.categoryDescription }}</span>
    </CCol>
    <CCol xs="12">
      <CButton color="primary" type="submit" @click="handleSubmit($event)">Save</CButton>
    </CCol>
  </CForm>
</template>

<script setup>
import { reactive, watch } from "vue";
import { productStore } from "@/stores/data/ProductData";
import AteriskField from "@/components/AteriskField.vue";

const producStoreInit = productStore();

const props = defineProps({
  id: String,
});

const category = reactive({
  id: "",
  categoryName: "",
  categoryDescription: "",
});

const errors = reactive({
  categoryName: "",
  categoryDescription: "",
});

const validateForm = () => {
  const fields = ["categoryName", "categoryDescription"];
  fields.forEach(validateField);

  return Object.values(errors).every((error) => error === "");
};

const validateField = (field) => {
  errors[field] = "";

  if (field === "categoryName") {
    if (!category.categoryName.trim()) {
      errors.categoryName = "Category Name is required.";
    } else if (category.categoryName.length < 3) {
      errors.categoryName = "Category Name must be at least 3 characters.";
    }
  }

  if (field === "categoryDescription") {
    if (category.categoryDescription && category.categoryDescription.length > 255) {
      errors.categoryDescription = "Description cannot exceed 255 characters.";
    }
  }
};

const handleSubmit = (event) => {
  event.preventDefault();

  if (!validateForm()) {
    event.stopPropagation();
    console.error("Validation failed", errors);
  } else {
    producStoreInit.saveOrUpdateCategory(category, parseInt(props.id));
    console.log("Category saved:", category);
  }
};

const fetchCategoryData = async (categoryId) => {
  try {
    const fetchedCategory = await producStoreInit.fetchCategory(parseInt(categoryId));
    if (fetchedCategory) {
      Object.assign(category, fetchedCategory);
    } else {
      console.warn("Category not found.");
    }
  } catch (error) {
    console.error("Error fetching category:", error);
  }
};

watch(
  () => props.id,
  (newId) => {
    if (!isNaN(parseInt(newId)) && parseInt(newId) >= 0) {
      fetchCategoryData(newId);
    } else {
      console.warn("Invalid category ID.");
    }
  },
  { immediate: true }
);
</script>
