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
            if (this.cart.length === 0) {
                this.cart.push({"id": cartId, "quantity": quantity});
            } else {
                for (let cartItem of this.cart) {
                    if (cartItem.id === cartId) {
                        cartItem = {"id": cartId, "quantity": cartItem.quantity++};
                    } else {
                        this.cart.push({"id": cartId, "quantity": quantity});
                    }
                }
            }
            sessionStorage.setItem('cart', JSON.stringify(this.cart));
        },
        updateQuantity(id, quantity) {
            for (let cartItem of this.cart) {
                console.log(cartItem.id, id)
                if (cartItem.id === id) {
                    let tempCartItem = { "id": id, "quantity": cartItem.quantity + quantity };
                    console.log(tempCartItem.quantity);
                    if (tempCartItem.quantity <= 0) {
                        this.cart.splice(this.cart.indexOf(cartItem), 1);
                    } else {
                        this.cart[this.cart.indexOf(cartItem)] = tempCartItem;
                    }
                }
            }
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