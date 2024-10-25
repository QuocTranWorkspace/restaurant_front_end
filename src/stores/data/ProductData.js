import api from "@/api/api"
import { defineStore } from "pinia";

export const productStore = defineStore("productStore", {
    state: () => ({
        products: null,
    }),

    getters: {
        getProducts: (state) => { return state.products }
    },

    actions: {
        setProducts(products) {
            this.products = products;
        },
        async fetchProducts() {
            try {
                const response = await api.get(`/product/productList`);
                console.log(response.data.data)
                this.setProducts(response.data.data);
            } catch (error) {
                console.log(error);
            }
        }
    }
})

