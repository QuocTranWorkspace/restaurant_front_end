import api from "@/api/api"
import { defineStore } from "pinia";
import router from "../../router";

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
        async fetchUser(id) {
            try {
                const response = await api.get(`/user/${id}`);
                return response.data.data;
            } catch (error) {
                console.log(error)
            }
        },
        async fetchUsers() {
            try {
                const response = await api.get(`/user/userList`);
                this.setUsers(response.data.data);
            } catch (error) {
                console.log(error);
            }
        },
        async saveOrUpdateUser(user, id) {
            try {
                let response = null;
                if (isNaN(id)) {
                    response = await api.post(`user/addUser`, user);
                }
                else {
                    response = await api.post(`user/${id}`, user);
                }
                alert(`Save ${response.data.data.userName} successful`);
            } catch (error) {
                console.log(error);
            }
        },
        async fetchRole(id) {
            try {
                const response = await api.get(`/role/${id}`);
                return response.data.data;
            } catch (error) {
                console.log(error)
            }
        },
        async fetchRoles() {
            try {
                const response = await api.get(`role/roleList`);
                this.setRoles(response.data.data);
            } catch (error) {
                console.log(error);
            }
        },
        async saveOrUpdateRole(role, id) {
            try {
                let response = null;
                if (isNaN(id)) {
                    response = await api.post(`role/addRole`, role);
                }
                else {
                    response = await api.post(`role/${id}`, role);
                }
                alert(`Save ${response.data.data.roleName} successful`);
            } catch (error) {
                console.log(error);
            }
        }
    }
})

