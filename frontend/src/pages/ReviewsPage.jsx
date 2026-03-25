import React, { useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import { motion } from 'motion/react';
import { useReviewStore } from '../store/reviewStore.js';
import { Star } from 'lucide-react';
import moment from 'moment';

const StarDisplay = ({ rating }) => (
    <div className="flex gap-0.5">
        {[1,2,3,4,5].map((s) => (
            <Star key={s} size={14} className={s <= rating ? 'text-orange-400 fill-orange-400' : 'text-gray-200 fill-gray-200'} />
        ))}
    </div>
);

const ReviewsPage = () => {
    const { reviews, getReviews, isFetchingReviews } = useReviewStore();

    useEffect(() => { getReviews(); }, []);

    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const dist = [5,4,3,2,1].map((s) => ({
        star: s,
        count: reviews.filter((r) => r.rating === s).length,
        pct: reviews.length ? Math.round((reviews.filter((r) => r.rating === s).length / reviews.length) * 100) : 0
    }));

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-100 py-2">
            <Navbar />
            <div className="mx-auto mt-20 max-w-4xl px-4 pb-10">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Student Reviews</h1>
                <p className="text-sm text-gray-500 mb-8">What students say about Kinap after recovering their items</p>

                {/* Summary */}
                {reviews.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 flex flex-col sm:flex-row gap-8 items-center">
                        <div className="text-center">
                            <p className="text-6xl font-bold text-gray-800">{avgRating}</p>
                            <StarDisplay rating={Math.round(avgRating)} />
                            <p className="text-sm text-gray-500 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex-1 w-full space-y-2">
                            {dist.map(({ star, count, pct }) => (
                                <div key={star} className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 w-6">{star}★</span>
                                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <div className="bg-orange-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="text-xs text-gray-400 w-6">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isFetchingReviews ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                                <div className="h-3 bg-gray-200 rounded w-1/4 mb-3" />
                                <div className="h-2 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-2 bg-gray-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-5xl mb-4">⭐</p>
                        <p className="font-medium text-gray-600">No reviews yet</p>
                        <p className="text-sm mt-1">Reviews appear after students mark items as recovered</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((r) => (
                            <div key={r._id} className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="font-semibold text-gray-800">{r.username}</p>
                                        <StarDisplay rating={r.rating} />
                                    </div>
                                    <p className="text-xs text-gray-400">{moment(r.createdAt).fromNow()}</p>
                                </div>
                                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{r.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ReviewsPage;
