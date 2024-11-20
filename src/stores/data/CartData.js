import api from "@/api/api"
import { defineStore } from "pinia";

export const cartStore = defineStore("cartStore", {
    state: () => ({
        cart: [],
    }),

    getters: {
        getCart: (state) => { return state.cart }
    },

    actions: {
        initState() {
            const cart = sessionStorage.getItem('cart');
            if (cart === null || cart === undefined) {
                sessionStorage.setItem('cart', []);
            }
            else {
                if (cart !== "") {
                    this.cart = JSON.parse(cart)
                }
            }
        },
        addToCart(cartId, quantity) {
            const existingCartItem = this.cart.find(cartItem => cartItem.id === cartId);
            if (existingCartItem) {
                existingCartItem.quantity += quantity;
            } else {
                this.cart.push({ id: cartId, quantity: quantity });
            }
            sessionStorage.setItem('cart', JSON.stringify(this.cart));
        },
        updateQuantity(id, quantity) {
            const cartItemIndex = this.cart.findIndex(cartItem => cartItem.id === id);
            if (cartItemIndex !== -1) {
                const cartItem = this.cart[cartItemIndex];
                cartItem.quantity += quantity;

                if (cartItem.quantity <= 0) {
                    this.cart.splice(cartItemIndex, 1);
                }
            }
            this.cart.sort((a, b) => a.id - b.id);
            sessionStorage.setItem('cart', JSON.stringify(this.cart));
        },
        async saveOrUpdateOrder(order) {
            try {
                let response = await api.post(`/order/checkout`, order);
                return response.data.data;
            } catch (error) {
                console.log(error);
            }
        },
    }
})