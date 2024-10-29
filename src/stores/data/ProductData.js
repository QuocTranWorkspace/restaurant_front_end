import api from "@/api/api"
import { defineStore } from "pinia";

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
        async fetchProducts() {
            try {
                const response = await api.get(`/product/productList`);
                this.setProducts(response.data.data);
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
        }
    }
})

