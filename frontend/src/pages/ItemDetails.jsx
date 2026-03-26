import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../components/Navbar.jsx';
import RecoveredModal from '../components/RecoveredModal.jsx';
import MatchesModal from '../components/MatchesModal.jsx';
import { useItemStore } from '../store/itemStore.js';
import { useAuthStore } from '../store/authStore.js';
import { useChatStore } from '../store/chatStore.js';
import { FiTrash2 } from 'react-icons/fi';
import { ChevronLeft, ChevronRight, Sparkles, CheckCircle } from 'lucide-react';

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setSelectedUser } = useChatStore();
    const { authUser } = useAuthStore();
    const {
        item, getItemById, isFetchingItemDetails,
        updateItemStatus, deleteItem, isUpdatingStatus, isDeletingItems,
        getPotentialMatches, matches, isFetchingMatches,
    } = useItemStore();

    const [activeImg, setActiveImg] = useState(0);
    const [showRecoveredModal, setShowRecoveredModal] = useState(false);
    const [showMatchesModal, setShowMatchesModal] = useState(false);

    useEffect(() => { getItemById(id); }, [id]);
    useEffect(() => { setActiveImg(0); }, [item?._id]);

    const handleContact = () => {
        setSelectedUser({ _id: item.owner._id, username: item.owner.username, profilePic: item.owner.profilePic });
        navigate('/chat');
    };

    const handleMarkRecovered = async () => {
        await updateItemStatus(item._id, 'Recovered');
        setShowRecoveredModal(true);
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this item?')) return;
        await deleteItem(item._id);
        navigate(-1);
    };

    const handleShowMatches = async () => {
        await getPotentialMatches(id);
        setShowMatchesModal(true);
    };

    if (isFetchingItemDetails) return (
        <div className="min-h-screen bg-gray-100"><Navbar />
            <div className="mt-32 text-center text-gray-500">Loading...</div>
        </div>
    );

    if (!item) return (
        <div className="min-h-screen bg-gray-100"><Navbar />
            <div className="mt-32 text-center text-gray-500">Item not found</div>
        </div>
    );

    const isOwner = authUser?._id === item.owner?._id;
    const isRecovered = item.status === 'Recovered';

    const images = item.images?.length > 0 ? item.images : item.image ? [item.image] : [];

    const statusColor = {
        Lost: 'bg-red-100 text-red-600',
        Found: 'bg-green-100 text-green-600',
        Recovered: 'bg-blue-100 text-blue-600',
    }[item.status] || 'bg-gray-100 text-gray-600';

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            className="min-h-screen bg-gray-100 py-2"
        >
            <Navbar />
            <div className="mx-auto mt-20 max-w-5xl px-4 pb-10">
                <div className="grid gap-8 rounded-2xl bg-white p-8 shadow-lg md:grid-cols-2">

                    {/* Gallery */}
                    <div className="flex flex-col gap-3">
                        <div className="relative overflow-hidden rounded-xl bg-gray-100 h-80">
                            {images.length > 0 ? (
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activeImg}
                                        src={images[activeImg]}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-full w-full object-cover"
                                    />
                                </AnimatePresence>
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-white">
                                    <span className="text-7xl mb-2">
                                        {(() => {
                                            const c = item.category?.toLowerCase() || '';
                                            if (c.includes('key')) return '🔑';
                                            if (c.includes('id') || c.includes('card')) return '🪪';
                                            if (c.includes('phone') || c.includes('gadget')) return '📱';
                                            if (c.includes('book') || c.includes('note')) return '📖';
                                            if (c.includes('bag') || c.includes('backpack')) return '🎒';
                                            if (c.includes('wallet') || c.includes('purse')) return '👜';
                                            if (c.includes('cloth')) return '👕';
                                            if (c.includes('watch')) return '⌚';
                                            if (c.includes('glass')) return '👓';
                                            return '📦';
                                        })()}
                                    </span>
                                    <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">No Photo Attached</span>
                                </div>
                            )}
                            {images.length > 1 && (
                                <>
                                    <button onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition">
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition">
                                        <ChevronRight size={18} />
                                    </button>
                                    <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                                        {activeImg + 1}/{images.length}
                                    </span>
                                </>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {images.map((img, i) => (
                                    <button key={i} onClick={() => setActiveImg(i)}
                                        className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${i === activeImg ? 'border-orange-500' : 'border-transparent hover:border-gray-300'}`}>
                                        <img src={img} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <h1 className="text-2xl font-semibold">{item.title}</h1>
                                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}>
                                    {item.status}
                                </span>
                            </div>

                            <p className="mb-2 text-sm text-gray-500">
                                Posted by{' '}
                                <span onClick={() => item.owner && navigate(`/user/${item.owner._id}`)}
                                    className="cursor-pointer font-medium text-blue-600 hover:underline">
                                    {item.owner?.username}
                                </span>
                            </p>

                            <p className="mb-4 text-sm leading-relaxed text-gray-700">{item.description}</p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{item.category}</span>
                                {item.location && (
                                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-600">📍 {item.location}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {isOwner ? (
                                <>
                                    {!isRecovered && (
                                        <button
                                            onClick={handleMarkRecovered}
                                            disabled={isUpdatingStatus}
                                            className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition"
                                        >
                                            <CheckCircle size={16} />
                                            {isUpdatingStatus ? 'Updating...' : 'Mark as Recovered'}
                                        </button>
                                    )}

                                    {/* Matches button — only for lost/found, not recovered */}
                                    {!isRecovered && (
                                        <button
                                            onClick={handleShowMatches}
                                            className="flex items-center gap-2 rounded-full border border-orange-400 text-orange-600 px-5 py-2 text-sm font-medium hover:bg-orange-50 cursor-pointer transition"
                                        >
                                            <Sparkles size={16} />
                                            Show Matches
                                        </button>
                                    )}

                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeletingItems}
                                        className="flex items-center gap-2 rounded-full bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 cursor-pointer transition"
                                    >
                                        <FiTrash2 size={16} />
                                        {isDeletingItems ? 'Deleting...' : 'Delete'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleContact}
                                        className="rounded-full bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600 cursor-pointer transition"
                                    >
                                        Contact {item.owner?.username}
                                    </button>
                                    {!isRecovered && (
                                        <button
                                            onClick={handleShowMatches}
                                            className="flex items-center gap-2 rounded-full border border-orange-400 text-orange-600 px-5 py-2 text-sm font-medium hover:bg-orange-50 cursor-pointer transition"
                                        >
                                            <Sparkles size={16} />
                                            Show Matches
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showRecoveredModal && <RecoveredModal onClose={() => setShowRecoveredModal(false)} />}
            {showMatchesModal && (
                <MatchesModal
                    matches={matches}
                    isFetching={isFetchingMatches}
                    onClose={() => setShowMatchesModal(false)}
                />
            )}
        </motion.div>
    );
};

export default ItemDetails;
