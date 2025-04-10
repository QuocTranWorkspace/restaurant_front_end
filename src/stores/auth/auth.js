import { defineStore } from "pinia";
import api from "@/api/api";
import router from "@/router";

export const authStore = defineStore("authStore", {
    state: () => ({
        user: null,
        token: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
        isAdmin: () => JSON.parse(sessionStorage.getItem('user'))?.roles.includes('ADMIN') || JSON.parse(sessionStorage.getItem('user'))?.roles.includes('STAFF'),
        getUser: (state) => state.user
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
            sessionStorage.removeItem('cart')
            router.go();
        },
        async isUsernameAvaiable(username) {
            try {
                const response = await api.get(`auth/validateUsername/${username}`);
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

                // Add to your auth store or utilities
                const isTokenExpired = (token) => {
                    if (!token) return true;
                    
                    try {
                    // Extract payload from JWT
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const payload = JSON.parse(window.atob(base64));
                    
                    // Check expiration (exp is in seconds, convert to milliseconds)
                    return payload.exp * 1000 < Date.now();
                    } catch (e) {
                    console.error("Error parsing JWT token:", e);
                    return true; // If we can't parse it, consider it expired
                    }
                };

                console.log(isTokenExpired(token))

                console.log('Full URL:', `${import.meta.env.VITE_BASE_API_URL}/admin/product/addProduct`);
                console.log('Token:', sessionStorage.getItem('jwt'));       

                if (this.user['roles'][0] === 'ADMIN') {
                    router.push('/admin');
                }
                else {
                    router.go();
                }
            } catch (error) {
                alert('Username or password incorrect');
            }
        },
        async register(credentials) {
            try {
            await api.post(`/auth/register`, credentials);
            } catch (error) {
                console.error('Login failed: ', error);
            }
        },
    },
})  