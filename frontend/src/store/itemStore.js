import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useItemStore = create((set, get) => ({
    items: [],
    lostItems: [],
    foundItems: [],
    item: null,
    matches: [],
    categories: [],
    locations: [],
    isFetchingItems: false,
    isFetchingLostItems: false,
    isFetchingFoundItems: false,
    isCreatingItems: false,
    isDeletingItems: false,
    isFetchingItemDetails: false,
    isUpdatingStatus: false,
    isFetchingMatches: false,
    isFetchingCategories: false,
    isFetchingLocations: false,

    createFoundItem: async (data) => {
        try {
            set({ isCreatingItems: true });
            await axiosInstance.post('/item/create', data);
            toast.success('Item posted successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isCreatingItems: false });
        }
    },

    searchItems: async(query) => {
        try{
            set({ isFetchingItems: true });
            const res = await axiosInstance.get(`/item/search?query=${query}`);
            set({ items: res.data });
        } catch(error){
           toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isFetchingItems: false });
        }
    },

    createLostItem: async (data) => {
        try {
            set({ isCreatingItems: true });
            await axiosInstance.post('/item/lost', data);
            toast.success('Lost item reported successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isCreatingItems: false });
        }
    },

    getItems: async (filters = {}) => {
        try {
            set({ isFetchingItems: true });
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
            const res = await axiosInstance.get(`/item/items?${params.toString()}`);
            set({ items: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isFetchingItems: false });
        }
    },

    getLostItems: async (filters = {}) => {
        try {
            set({ isFetchingLostItems: true });
            const params = new URLSearchParams();
            Object.entries({ ...filters, status: 'Lost' }).forEach(([k, v]) => { if (v) params.append(k, v); });
            const res = await axiosInstance.get(`/item/items?${params.toString()}`);
            set({ lostItems: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isFetchingLostItems: false });
        }
    },

    getFoundItems: async (filters = {}) => {
        try {
            set({ isFetchingFoundItems: true });
            const params = new URLSearchParams();
            Object.entries({ ...filters, status: 'Found' }).forEach(([k, v]) => { if (v) params.append(k, v); });
            const res = await axiosInstance.get(`/item/items?${params.toString()}`);
            set({ foundItems: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isFetchingFoundItems: false });
        }
    },

    getItemById: async (itemId) => {
        try {
            set({ isFetchingItemDetails: true });
            const res = await axiosInstance.get(`/item/${itemId}`);
            set({ item: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isFetchingItemDetails: false });
        }
    },

    updateItemStatus: async (id, status) => {
        try {
            set({ isUpdatingStatus: true });
            await axiosInstance.put(`/item/${id}/status`, { status });
            const fresh = await axiosInstance.get(`/item/${id}`);
            set({ item: fresh.data });
            toast.success('Status updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isUpdatingStatus: false });
        }
    },

    deleteItem: async (id) => {
        try {
            set({ isDeletingItems: true });
            await axiosInstance.delete(`/item/${id}`);
            toast.success('Item deleted successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isDeletingItems: false });
        }
    },

    getPotentialMatches: async (id) => {
        try {
            set({ isFetchingMatches: true });
            const res = await axiosInstance.get(`/item/${id}/matches`);
            set({ matches: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isFetchingMatches: false });
        }
    },

    getCategories: async () => {
        try {
            set({ isFetchingCategories: true });
            const res = await axiosInstance.get('/item/categories');
            set({ categories: res.data });
        } catch (error) {
            console.log('Error fetching categories', error);
        } finally {
            set({ isFetchingCategories: false });
        }
    },

    getLocations: async () => {
        try {
            set({ isFetchingLocations: true });
            const res = await axiosInstance.get('/item/locations');
            set({ locations: res.data });
        } catch (error) {
            console.log('Error fetching locations', error);
        } finally {
            set({ isFetchingLocations: false });
        }
    },
}));
