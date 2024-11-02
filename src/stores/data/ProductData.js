import api from "@/api/api"
import { defineStore } from "pinia";
import router from "@/router";

export const productStore = defineStore("productStore", {
    state: () => ({
        products: null,
        categories: null,
    }),

    getters: {
        getProducts: (state) => { return state.products },
        getCategories: (state) => { return state.categories }
    },

    actions: {
        setProducts(products) {
            this.products = products;
        },
        setCategories(categories) {
            this.categories = categories;
        },
        async fetchProduct(id) {
            try {
                const response = await api.get(`/product/${id}`);
                console.log(response.data.data)
                return response.data.data;
            } catch (error) {
                console.log(error);
            }
        },
        async fetchProducts() {
            try {
                const response = await api.get(`/product/productList`);
                this.setProducts(response.data.data);
            } catch (error) {
                console.log(error);
            }
        },
        async saveOrUpdateProduct(product, id) {
            try {
                let response = null;
                if (isNaN(id)) {
                    response = await api.post(`/product/addProduct`, product);
                }
                else {
                    response = await api.post(`/product/${id}`, product);
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
                    response = await api.post(`/product/deleteProduct/${id}`);
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
                this.setCategories(response.data.data);
            } catch (error) {
                console.log(error);
            }
        },
        async saveOrUpdateCategory(category, id) {
            try {
                let response = null;
                if (isNaN(id)) {
                    response = await api.post(`/category/addCategory`, category);
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
                    response = await api.post(`/category/deleteCategory/${id}`);
                    alert(`Delete category: ${response.data.data.categoryname} successful`);
                    router.go();
                }
            } catch (error) {
                console.log(error);
            }
        },
    }
})

