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
        async fetchUserOrders(id) {
            try {
                const response = await api.get(`/order/orderList/${id}`);
                return response.data.data;
            } catch (error) {
                console.log(error);
            }
        },
        async fetchOrderByCode(id) {
            try {
                const response = await api.get(`/order/detail/${id}`);
                return response.data.data;
            } catch (error) {
                console.log(error);
            }
        },
        async fetchOrder(id) {
            try {
                const response = await api.get(`/order/${id}`);
                return response.data.data;
            } catch (error) {
                console.log(error);
            }
        },
        async saveOrUpdateOrder(order, id) {
            try {
                let response = null;
                if (isNaN(id)) {
                    response = await api.post(`/order/addOrder`, order);
                }
                else {
                    response = await api.post(`/order/${id}`, order);
                }
                console.log(response.data.data === null)
                if (response.data.data !== null) {
                    alert(`Save order: ${response.data.data.code} successful`);
                } else {
                    alert(`Save order failed, user does not exist`);
                }
            } catch (error) {
                console.log(error);
            }
        },
        async deleteOrder(id) {
            try {
                let response = null;
                if (!isNaN(id)) {
                    response = await api.post(`/order/deleteOrder/${id}`);
                alert(`Delete order: ${response.data.data.code} successful`);
                    router.go();
                }
            } catch (error) {
                console.log(error);
            }
        },
    }
})

