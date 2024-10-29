import api from "@/api/api"
import { defineStore } from "pinia";

export const userStore = defineStore("userStore", {
    state: () => ({
        users: null,
        roles: null,
    }),

    getters: {
        getUsers: (state) => { return state.users },
        getRoles: (state) => { return state.roles }
    },

    actions: {
        setUsers(users) {
            this.users = users;
        },
        setRoles(roles) {
            this.roles = roles;
        },
        async fetchUsers() {
            try {
                const response = await api.get(`/user/userList`);
                this.setUsers(response.data.data);
            } catch (error) {
                console.log(error);
            }
        },
        async fetchRoles() {
            try {
                const response = await api.get(`user/roleList`);
                this.setRoles(response.data.data);
            } catch (error) {
                console.log(error);
            }
        }
    }
})

