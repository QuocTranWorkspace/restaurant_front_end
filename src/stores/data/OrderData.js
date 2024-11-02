import api from "@/api/api"
import { defineStore } from "pinia";
import router from "@/router";

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
        },
        async fetchOrder(id) {
            try {
                const response = await api.get(`/order/${id}`);
                console.log(response.data.data)
                return response.data.data;
            } catch (error) {
                console.log(error);
            }
        },
        async saveOrUpdateOrder(order, id) {
            try {
                let response = null;
                if (isNaN(id)) {
                    response = await api.post(`order/addOrder`, order);
                }
                else {
                    response = await api.post(`order/${id}`, order);
                }
                alert(`Save order: ${response.data.data.code} successful`);
            } catch (error) {
                console.log(error);
            }
        },
        async deleteOrder(id) {
            try {
                let response = null;
                if (!isNaN(id)) {
                    response = await api.post(`order/deleteOrder/${id}`);
                    router.go();
                }
                alert(`Delete order: ${response.data.data.code} successful`);
            } catch (error) {
                console.log(error);
            }
        },
    }
})

