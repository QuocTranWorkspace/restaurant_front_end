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
        getCategories: (state) => state.categories.filter((data) => data.status)
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
        async saveOrUpdateProduct(product, id) {
            try {
                let response = null;
                if (isNaN(id)) {
                    response = await api.post(`/admin/product/addProduct`, product);
                }
                else {
                    response = await api.post(`/admin/product/${id}`, product);
                }
                alert(`Save product: ${response.data.data.productName} successful`);
            } catch (error) {
                console.log(error);
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
            // Check if we already have a valid URL in cache
            if (!productId) {
                console.error('Invalid productId provided to fetchProductImageUrl');
                return null;
            }
            const now = Date.now();
            if (
                this.imageUrlCache[productId] && 
                (!this.imageUrlExpiration[productId] || this.imageUrlExpiration[productId] > now)
            ) {
                return this.imageUrlCache[productId];
            }
            
            try {
                const response = await api.get(`/product/${productId}/image`);
                if (!response || !response.data || !response.data.url) {
                    console.error(`Invalid response structure for product ${productId}`, response);
                    return null;
                }
                const imageUrl = response.data.url;
                
                // Store in cache
                this.imageUrlCache[productId] = imageUrl;
                
                // Set expiration time (e.g., 1 hour from now)
                // Adjust this based on your Backblaze B2 pre-signed URL expiration setting
                this.imageUrlExpiration[productId] = now + (60 * 60 * 1000);
                
                return imageUrl;
            } catch (error) {
                console.error(`Failed to fetch image URL for product ${productId}:`, error);
                return null;
            }
        },
        
        // Add a method to prefetch multiple image URLs at once
        async prefetchProductImageUrls(productIds) {
            const now = Date.now();
            const idsToFetch = productIds.filter(id => 
                !this.imageUrlCache[id] || 
                (this.imageUrlExpiration[id] && this.imageUrlExpiration[id] <= now)
            );
            
            if (idsToFetch.length === 0) return;
            
            try {
                // If you implement a batch endpoint on your backend:
                // const response = await api.get('/product/batch-images', {
                //     params: { ids: idsToFetch.join(',') }
                // });
                // const urlMap = response.data;
                
                // For now, fetch URLs individually
                await Promise.all(idsToFetch.map(id => this.fetchProductImageUrl(id)));
            } catch (error) {
                console.error('Failed to prefetch image URLs:', error);
            }
        },
        
        // Reset image URL cache (useful when logging out or clearing data)
        clearImageUrlCache() {
            this.imageUrlCache = {};
            this.imageUrlExpiration = {};
        }
    }
})

