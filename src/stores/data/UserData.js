import api from "@/api/api"
import { defineStore } from "pinia";
import router from "@/router";

export const userStore = defineStore("userStore", {
    state: () => ({
        users: null,
        roles: null,
    }),

    getters: {
        getUsers: (state) => state.users,
        getRoles: (state) => state.roles
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
                    response = await api.post(`/user/addUser`, user);
                }
                else {
                    response = await api.post(`/user/${id}`, user);
                }
                alert(`Save ${response.data.data.userName} successful`);
            } catch (error) {
                console.log(error);
            }
        },
        async updateProfile(user, id) {
            try {
                let response = null;
                if (!isNaN(id)) {
                    response = await api.post(`/user/profile/${id}`, user);
                }
                alert(`Save ${response.data.data.userName} successful`);
            } catch (error) {
                console.log(error);
            }
        },
        async deleteUser(id) {
            try {
                let response = null;
                if (!isNaN(id)) {
                    response = await api.post(`/user/deleteUser/${id}`);
                    router.go();
                }
                alert(`Delete ${response.data.data.userName} successful`);
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
                const response = await api.get(`/role/roleList`);
                this.setRoles(response.data.data);
            } catch (error) {
                console.log(error);
            }
        },
        async saveOrUpdateRole(role, id) {
            try {
                let response = null;
                if (isNaN(id)) {
                    response = await api.post(`/role/addRole`, role);
                }
                else {
                    response = await api.post(`/role/${id}`, role);
                }
                alert(`Save ${response.data.data.roleName} successful`);
            } catch (error) {
                console.log(error);
            }
        },
        async deleteRole(id) {
            try {
                let response = null;
                if (!isNaN(id)) {
                    response = await api.post(`/role/deleteRole/${id}`);
                alert(`Delete ${response.data.data.userName} successful`);
                router.go();
                }
            } catch (error) {
                console.log(error);
            }
        },
    }
})

