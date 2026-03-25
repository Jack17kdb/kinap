import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MatchesModal = ({ matches, isFetching, onClose }) => {
    const navigate = useNavigate();

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
                    className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[80vh] flex flex-col"
                >
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800">Potential Matches</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-1 p-4">
                        {isFetching ? (
                            <div className="flex items-center justify-center py-10">
                                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : matches.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                <p className="text-4xl mb-3">🔍</p>
                                <p className="font-medium">No matches found yet</p>
                                <p className="text-sm text-gray-400 mt-1">Check back later as more items are posted</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {matches.map(({ item, matchPercentage, locationMatch }) => (
                                    <div
                                        key={item._id}
                                        onClick={() => { navigate(`/item/${item._id}`); onClose(); }}
                                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition"
                                    >
                                        {item.image ? (
                                            <img src={item.image} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                                <span className="text-2xl">📦</span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-gray-800 line-clamp-1">{item.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                <MapPin size={11} /> {item.location}
                                                {locationMatch && <span className="text-green-500 font-medium ml-1">• Same location</span>}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">by {item.owner?.username}</p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <div className={`flex items-center gap-1 text-sm font-bold ${
                                                matchPercentage >= 70 ? 'text-green-600' :
                                                matchPercentage >= 50 ? 'text-orange-500' : 'text-gray-500'
                                            }`}>
                                                <Percent size={12} />
                                                {matchPercentage}
                                            </div>
                                            <p className="text-[10px] text-gray-400">match</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MatchesModal;
