import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useAdminStore = create((set) => ({
    users: [],
    userPosts: [],
    itemStats: null,
    locationStats: [],
    isFetchingUsers: false,
    isFetchingPosts: false,
    isFetchingStats: false,
    isDeletingPost: false,
    isAddingLocation: false,
    isAddingCategory: false,

    getUsers: async (search = '') => {
        try {
            set({ isFetchingUsers: true });
            const url = search
                ? `/admin/users/search?search=${encodeURIComponent(search)}`
                : '/admin/users';
            const res = await axiosInstance.get(url);
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isFetchingUsers: false });
        }
    },

    getUserPosts: async (userId) => {
        try {
            set({ isFetchingPosts: true });
            const res = await axiosInstance.get(`/admin/posts/${userId}`);
            set({ userPosts: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isFetchingPosts: false });
        }
    },

    deletePost: async (id) => {
        try {
            set({ isDeletingPost: true });
            await axiosInstance.delete(`/admin/post/${id}`);
            set((state) => ({ userPosts: state.userPosts.filter((p) => p._id !== id) }));
            toast.success('Post deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isDeletingPost: false });
        }
    },

    getItemStats: async () => {
        try {
            set({ isFetchingStats: true });
            const [statsRes, locRes] = await Promise.all([
                axiosInstance.get('/admin/stats/items'),
                axiosInstance.get('/admin/stats/locations'),
            ]);
            set({ itemStats: statsRes.data, locationStats: locRes.data });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isFetchingStats: false });
        }
    },

    addLocation: async (location) => {
        try {
            set({ isAddingLocation: true });
            await axiosInstance.post('/admin/locations', { location });
            toast.success(`Location "${location}" added`);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            return false;
        } finally {
            set({ isAddingLocation: false });
        }
    },

    addCategory: async (category) => {
        try {
            set({ isAddingCategory: true });
            await axiosInstance.post('/admin/categories', { category });
            toast.success(`Category "${category}" added`);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            return false;
        } finally {
            set({ isAddingCategory: false });
        }
    },
}));
