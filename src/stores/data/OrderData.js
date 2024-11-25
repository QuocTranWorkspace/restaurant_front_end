import api from "@/api/api"
import { defineStore } from "pinia";
import router from "@/router";

export const ordersStore = defineStore("orderStore", {
    state: () => ({
        orders: null,
    }),

    getters: {
        getOrders: (state) => state.orders.filter((data) => data.status)
    },

    actions: {
        setOrders(orders) {
            this.orders = orders.filter((data) => data.status)
        },
        async fetchOrders() {
            try {
                const response = await api.get(`/admin/order/orderList`);
                this.setOrders(response.data.data);
            } catch (error) {
                console.log(error);
            }
        },
        async fetchUserOrders(id) {
            try {
                const response = await api.get(`/order/orderList/${id}`);
                return response.data.data.filter((data) => data.status);
            } catch (error) {
                console.log(error);
            }
        },
        async fetchOrderByCode(id) {
            try {
                const response = await api.get(`/admin/order/detail/${id}`);
                console.log(response.data.data)
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
                    response = await api.post(`/admin/order/addOrder`, order);
                }
                else {
                    response = await api.post(`/admin/order/${id}`, order);
                }
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
                    response = await api.post(`/admin/order/deleteOrder/${id}`);
                alert(`Delete order: ${response.data.data.code} successful`);
                    router.go();
                }
            } catch (error) {
                console.log(error);
            }
        },
    }
})

