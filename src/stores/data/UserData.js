import api from "@/api/api"
import { defineStore } from "pinia";

export const userStore = defineStore("userStore", {
    state: () => ({
        users: null,
    }),

    getters: {
        getUsers: (state) => { return state.users }
    },

    actions: {
        setUsers(users) {
            this.users = users;
        },
        async fetchUsers() {
            try {
                const response = await api.get(`/user/userList`);
                this.setUsers(response.data.data);
            } catch (error) {
                console.log(error);
            }
        }
    }
})

