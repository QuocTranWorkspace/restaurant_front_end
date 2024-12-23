import api from "@/api/api"
import { defineStore } from "pinia";
import router from "@/router";

export const productStore = defineStore("productStore", {
    state: () => ({
        products: null,
        categories: null,
    }),

    getters: {
        getProducts: (state) => state.products,
        getCategories: (state) => state.categories.filter((data) => data.status)
    },

    actions: {
        setProducts(products) {
            this.products = products.filter((data) => data.status);
        },
        setCategories(categories) {
            this.categories = categories.filter((data) => data.status);
        },
        async fetchProduct(id) {
            try {
                const response = await api.get(`/product/${id}`);
                return response.data.data;
            } catch (error) {
                console.log(error);
            }
        },
        async fetchProducts() {
            try {
                const response = await api.get(`/product/productList`); 
                this.setProducts(response.data.data.filter((data) => data.status));
            } catch (error) {
                console.log(error);
            }
        },
        async fetchFilteredProducts(categoryName) {
            try {
                const response = await api.get(`/product/productList/${categoryName}`);
                this.setProducts(response.data.data.filter((data) => data.status));
            } catch (error) {
                console.log(error);
            }
        },
        async saveOrUpdateProduct(product, id) {
            try {
                let response = null;
                if (isNaN(id)) {
                    response = await api.post(`/admin/product/addProduct`, product);
                }
                else {
                    response = await api.post(`/admin/product/${id}`, product);
                }
                alert(`Save product: ${response.data.data.productName} successful`);
            } catch (error) {
                console.log(error);
            }
        },
        async deleteProduct(id) {
            try {
                let response = null;
                if (!isNaN(id)) {
                    response = await api.post(`/admin/product/deleteProduct/${id}`);
                    alert(`Delete product: ${response.data.data.productName} successful`);
                    router.go();
                }
            } catch (error) {
                console.log(error);
            }
        },
        async fetchCategory(id) {
            try {
                const response = await api.get(`/category/${id}`);
                return response.data.data;
            } catch (error) {
                console.log(error);
            }
        },
        async fetchCategories() {
            try {
                const response = await api.get(`/category/categoryList`);
                this.setCategories(response.data.data.filter((data) => data.status));
            } catch (error) {
                console.log(error);
            }
        },
        async saveOrUpdateCategory(category, id) {
            try {
                let response = null;
                if (isNaN(id)) {
                    response = await api.post(`/admin/category/addCategory`, category);
                }
                else {
                    response = await api.post(`/category/${id}`, category);
                }
                alert(`Save Category: ${response.data.data.categoryname} successful`);
            } catch (error) {
                console.log(error);
            }
        },
        async deleteCategory(id) {
            try {
                let response = null;
                if (!isNaN(id)) {
                    response = await api.post(`/admin/category/deleteCategory/${id}`);
                    alert(`Delete category: ${response.data.data.categoryname} successful`);
                    router.go();
                }
            } catch (error) {
                console.log(error);
            }
        },
    }
})

