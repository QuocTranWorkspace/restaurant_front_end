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
                // Verify authentication before proceeding
                const token = sessionStorage.getItem('jwt');
                if (!token) {
                    alert("You are not logged in. Please log in to continue.");
                    router.push('/login');
                    return null;
                }
                
                // Create FormData
                const formData = new FormData();
                
                // Add category ID if provided
                if (categoryId) {
                    formData.append("category", categoryId.toString());
                }
                
                // Add avatar file if provided
                if (avatarFile) {
                    formData.append("avatar", avatarFile);
                }
                
                // Create a clean product object
                const cleanProduct = { ...product };
                // Ensure we don't have nested category object
                delete cleanProduct.category;
                
                // Add the product data
                formData.append("product", JSON.stringify(cleanProduct));
                
                let response;
                if (id === null || id === undefined || isNaN(parseInt(id))) {
                    response = await api.post(`/admin/product/addProduct`, formData);
                } else {
                    response = await api.post(`/admin/product/${id}`, formData);
                }
                
                alert(`Save product: ${response.data.data.productName} successful`);
                return response.data.data;
            } catch (error) {
                // Don't show raw error to user
                console.error("Error saving product:", error);
                
                if (error.response) {
                    // Handle specific error cases
                    switch (error.response.status) {
                        case 400:
                            alert("Invalid product data. Please check all fields and try again.");
                            break;
                        case 403:
                            alert("You don't have permission to add or modify products.");
                            break;
                        case 413:
                            alert("The image file is too large. Please use a smaller image.");
                            break;
                        default:
                            alert("An error occurred while saving the product. Please try again later.");
                    }
                } else {
                    alert("Unable to connect to the server. Please check your internet connection.");
                }
                
                return null;
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
            // Validate input
            if (!productId) {
                console.error('Invalid productId provided to fetchProductImageUrl');
                return null;
            }
            
            // Initialize cache if needed
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
                // The endpoint is correct based on your backend code
                const response = await api.get(`/product/${productId}/image`);
                
                // If we reach here, the request was successful
                // Extract the URL from the response
                const imageUrl = response.data.url;
                
                // Store in cache
                this.imageUrlCache[productId] = imageUrl;
                this.imageUrlExpiration[productId] = now + (60 * 60 * 1000); // 1 hour
                
                return imageUrl;
            } catch (error) {
                // Check specifically for 404 errors - this is EXPECTED for products without images
                if (error.response && error.response.status === 404) {
                    // Don't log this as an error - it's normal behavior
                    console.log(`Product ${productId} has no image - using fallback`);
                    
                    // Cache the "no image" result to avoid repeated requests
                    this.imageUrlCache[productId] = null;
                    this.imageUrlExpiration[productId] = now + (60 * 60 * 1000); // 1 hour
                    
                    return null;
                }
                
                // For other errors, log them normally
                console.error(`Error fetching image URL for product ${productId}:`, error);
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

