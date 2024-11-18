import { defineStore } from "pinia";
import api from "@/api/api";
import router from "@/router";

export const authStore = defineStore("authStore", {
    state: () => ({
        user: null,
        token: null
    }),

    getters: {
        isAuthenticated: (state) => { !!state.user },
        isAdmin: (state) => { state.user?.role === 'ADMIN' },
        getUser: (state) => { state.user = JSON.parse(sessionStorage.getItem('user')); return state.user }
    },

    actions: {
        setUser(user) {
            this.user = user;
            sessionStorage.setItem('user', JSON.stringify(user));
        },
        setToken(token) {
            this.token = token;
            sessionStorage.setItem('jwt', token);
        },
        logout() {
            this.user = null;
            this.token = null;
            sessionStorage.removeItem('jwt');
            sessionStorage.removeItem('user');
            router.go();
        },
        async isUsernameAvaiable(username) {
            try {
                const response = await api.get(`auth/validateUsername/${username}`);
                console.log(response.data.data)
                return response.data.data;
            } 
            catch (error) {
                console.error('Username is not valid: ', error);
            } 
        },
        async login(credentials) {
            try {
                /*
                    Login workflow:
                    - Get the credentials from the login form
                    - Send the "Login" request with the credentials
                    * In back-end:
                        ** Generate token with the credentials
                        ** Validate the credentials from database and authenticate it
                        ** Send the token to front-end
                    - Get the token and save it to the local Storage
                    - Get the loged in user and save to the local storage
                    - Validate the roles and redirect to the determined url
                 */
                const response = await api.post(`/auth/login`, credentials);
        
                const token = response.data.data;

                this.setToken(token);
                        
                const userResponse = await api.get(`/auth/userAuthenticated`);
                const user = userResponse.data;
                this.setUser(user); 
        
                if (this.user['roles'][0] === 'ADMIN') {
                    router.push('/admin');
                }
                else {
                    router.push('/home');
                    router.go();
                }
            } catch (error) {
                console.error('Login failed: ', error);
            }
        },
        async register(credentials) {
            try {
            const response = await api.post(`/auth/register`, credentials);
            const userInfo = response.data.data;
            } catch (error) {
                console.error('Login failed: ', error);
            }
        },
    },
})  