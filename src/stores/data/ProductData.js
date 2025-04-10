import api from "@/api/api"
import { defineStore } from "pinia";
import router from "@/router";

export const productStore = defineStore("productStore", {
    state: () => ({
        products: null,
        categories: null,
    }),

    getters: {
        getProducts: (state) => state.products,
        getCategories: (state) => {
            // Add safeguard against state.categories being null
            return state.categories ? state.categories.filter(data => data.status) : [];
        },
        
        // Add a getter for image URLs
        getProductImageUrl: (state) => (productId) => {
            // Safety check - if productId is falsy, return null immediately
            if (!productId) return null;
            
            // Check if we have a cache entry and make sure we're not accessing properties
            // of undefined objects
            const cache = state.imageUrlCache || {};
            const expiration = state.imageUrlExpiration || {};
            
            const now = Date.now();
            if (
                cache[productId] && 
                (!expiration[productId] || expiration[productId] > now)
            ) {
                return cache[productId];
            }
            
            // Return null if no cached URL (component will show fallback)
            return null;
        }
    },

    actions: {
        setProducts(products) {
            this.products = products.filter((data) => data.status);
        },
        setCategories(categories) {
            this.categories = categories.filter((data) => data.status);
        },
        async fetchProduct(id) {
            try {
                const response = await api.get(`/product/${id}`);
                return response.data.data;
            } catch (error) {
                console.log(error);
            }
        },
        async fetchProducts() {
            try {
                const response = await api.get(`/product/productList`); 
                this.setProducts(response.data.data.filter((data) => data.status));
            } catch (error) {
                console.log(error);
            }
        },
        async fetchFilteredProducts(categoryName) {
            try {
                const response = await api.get(`/product/productList/${categoryName}`);
                this.setProducts(response.data.data.filter((data) => data.status));
            } catch (error) {
                console.log(error);
            }
        },
        async saveOrUpdateProduct(product, id, categoryId, avatarFile = null) {
            try {
                let response = null;
                // Create a FormData object
                const formData = new FormData();
                
                // Add the category ID if provided
                if (categoryId) {
                    formData.append("category", categoryId);
                }
                
                // Add the avatar file if provided
                if (avatarFile) {
                    formData.append("avatar", avatarFile);
                }
                
                // Convert the product object to a JSON string and add it
                formData.append("product", JSON.stringify(product));
                
                if (isNaN(id)) {
                    response = await api.post(`/admin/product/addProduct`, formData);
                } else {
                    response = await api.post(`/admin/product/${id}`, formData);
                }
                
                alert(`Save product: ${response.data.data.productName} successful`);
                return response.data.data;
            } catch (error) {
                console.error("Error saving product:", error);
                alert("Failed to save product. Please check your data and try again.");
                throw error;
            }
        },
        async deleteProduct(id) {
            try {
                let response = null;
                if (!isNaN(id)) {
                    response = await api.post(`/admin/product/deleteProduct/${id}`);
                    alert(`Delete product: ${response.data.data.productName} successful`);
                    router.go();
                }
            } catch (error) {
                console.log(error);
            }
        },
        async fetchCategory(id) {
            try {
                const response = await api.get(`/category/${id}`);
                return response.data.data;
            } catch (error) {
                console.log(error);
            }
        },
        async fetchCategories() {
            try {
                const response = await api.get(`/category/categoryList`);
                this.setCategories(response.data.data.filter((data) => data.status));
            } catch (error) {
                console.log(error);
            }
        },
        async saveOrUpdateCategory(category, id) {
            try {
                let response = null;
                if (isNaN(id)) {
                    response = await api.post(`/admin/category/addCategory`, category);
                }
                else {
                    response = await api.post(`/category/${id}`, category);
                }
                alert(`Save Category: ${response.data.data.categoryname} successful`);
            } catch (error) {
                console.log(error);
            }
        },
        async deleteCategory(id) {
            try {
                let response = null;
                if (!isNaN(id)) {
                    response = await api.post(`/admin/category/deleteCategory/${id}`);
                    alert(`Delete category: ${response.data.data.categoryname} successful`);
                    router.go();
                }
            } catch (error) {
                console.log(error);
            }
        },
        async fetchProductImageUrl(productId) {
            // Crucial safety check - validate input before proceeding
            if (!productId) {
                console.error('Invalid productId provided to fetchProductImageUrl');
                return null;
            }
            
            // Make sure these objects exist - this is critical
            if (!this.imageUrlCache) this.imageUrlCache = {};
            if (!this.imageUrlExpiration) this.imageUrlExpiration = {};
            
            // Check cache first
            const now = Date.now();
            if (
                this.imageUrlCache[productId] && 
                (!this.imageUrlExpiration[productId] || this.imageUrlExpiration[productId] > now)
            ) {
                return this.imageUrlCache[productId];
            }
            
            try {
                const response = await api.get(`/product/${productId}/image`);
                
                // Validate response
                if (!response || !response.data || !response.data.url) {
                    console.error(`Invalid response structure for product ${productId}`);
                    return null;
                }
                
                const imageUrl = response.data.url;
                
                // Safely store in cache
                if (!this.imageUrlCache) this.imageUrlCache = {};
                this.imageUrlCache[productId] = imageUrl;
                
                // Safely set expiration
                if (!this.imageUrlExpiration) this.imageUrlExpiration = {};
                this.imageUrlExpiration[productId] = now + (60 * 60 * 1000);
                
                return imageUrl;
            } catch (error) {
                console.error(`Failed to fetch image URL for product ${productId}:`, error);
                return null;
            }
        },
        
        // For tracking image loading errors
        setImageError(productId, hasError = true) {
            if (!productId) return;
            
            if (!this.imageErrors) this.imageErrors = {};
            this.imageErrors[productId] = hasError;
        },
        
        // Clear all image caches
        clearImageCache() {
            this.imageUrlCache = {};
            this.imageUrlExpiration = {};
            this.imageErrors = {};
        },
    }
})

