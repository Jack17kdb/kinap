import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useReviewStore = create((set) => ({
    reviews: [],
    isFetchingReviews: false,
    isPostingReview: false,

    getReviews: async () => {
        try {
            set({ isFetchingReviews: true });
            const res = await axiosInstance.get('/review/');
            set({ reviews: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isFetchingReviews: false });
        }
    },

    postReview: async (data) => {
        try {
            set({ isPostingReview: true });
            const res = await axiosInstance.post('/review/', data);
            set((state) => ({ reviews: [res.data, ...state.reviews] }));
            toast.success('Review posted, thank you!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            return false;
        } finally {
            set({ isPostingReview: false });
        }
    },
}));
