import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X } from 'lucide-react';
import { useReviewStore } from '../store/reviewStore.js';

const RecoveredModal = ({ onClose }) => {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [content, setContent] = useState('');
    const { postReview, isPostingReview } = useReviewStore();

    const handleSubmit = async () => {
        if (!rating || !content.trim()) return;
        const ok = await postReview({ rating, content });
        if (ok) onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl"
                >
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-gray-800">🎉 Item Recovered!</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                            <X size={20} />
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                        Great news! Would you like to leave a quick review about your experience with Kinap? It only takes a second and really helps us.
                    </p>

                    {/* Star rating */}
                    <div className="flex gap-2 mb-4 justify-center">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onMouseEnter={() => setHovered(s)}
                                onMouseLeave={() => setHovered(0)}
                                onClick={() => setRating(s)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    size={32}
                                    className={`transition ${
                                        (hovered || rating) >= s
                                            ? 'text-orange-400 fill-orange-400'
                                            : 'text-gray-300'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>

                    <textarea
                        rows={3}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your experience..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-orange-400 transition resize-none mb-4"
                    />

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-full border border-gray-300 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
                        >
                            Skip
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!rating || !content.trim() || isPostingReview}
                            className="flex-1 rounded-full bg-orange-500 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 transition"
                        >
                            {isPostingReview ? 'Posting...' : 'Submit Review'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RecoveredModal;
