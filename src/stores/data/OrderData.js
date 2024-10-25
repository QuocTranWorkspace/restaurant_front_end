import api from "@/api/api"
import { defineStore } from "pinia";

export const ordersStore = defineStore("orderStore", {
    state: () => ({
        orders: null,
    }),

    getters: {
        getOrders: (state) => { return state.orders }
    },

    actions: {
        setOrders(orders) {
            this.orders = orders
        },
        async fetchOrders() {
            try {
                const response = await api.get(`/order/orderList`);
                this.setOrders(response.data.data);
            } catch (error) {
                console.log(error);
            }
        }
    }
})

