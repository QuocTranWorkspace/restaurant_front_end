<template>
  <CForm class="row g-3">
    <CCol md="12">
      <CFormLabel for="categoryID">ID</CFormLabel>
      <CFormInput type="text" id="categoryID" placeholder="ID" v-model="category.id" />
    </CCol>
    <CCol md="12">
      <CFormLabel for="categoryName">Role Name</CFormLabel>
      <CFormInput
        type="text"
        id="categoryName"
        placeholder="Some name"
        v-model="category.categoryName"
      />
    </CCol>
    <CCol md="12">
      <CFormLabel for="description">Description</CFormLabel>
      <CFormInput
        type="text"
        id="description"
        placeholder="Some description"
        v-model="category.categoryDescription"
      />
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

const category = ref({
  id: "",
  categoryName: "",
  categoryDescription: "",
});

const fetchCategoryData = async (categoryId) => {
  try {
    const fetchedCategory = await producStoreInit.fetchCategory(parseInt(categoryId));
    if (fetchedCategory) {
      category.value = fetchedCategory;
    } else {
      console.warn("Category not found.");
    }
  } catch (error) {
    console.error("Error fetching category:", error);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  producStoreInit.saveOrUpdateCategory(category.value, parseInt(props.id));
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
