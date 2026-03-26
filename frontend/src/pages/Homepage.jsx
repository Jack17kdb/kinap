import React, { useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuthStore } from '../store/authStore.js';
import { useItemStore } from '../store/itemStore.js';

const getCategoryIcon = (cat) => {
    const c = cat?.toLowerCase() || '';
    if (c.includes('key')) return '🔑';
    if (c.includes('id') || c.includes('card')) return '🪪';
    if (c.includes('phone') || c.includes('gadget')) return '📱';
    if (c.includes('book') || c.includes('note')) return '📖';
    if (c.includes('bag') || c.includes('backpack')) return '🎒';
    if (c.includes('wallet') || c.includes('purse')) return '👜';
    if (c.includes('cloth')) return '👕';
    if (c.includes('watch')) return '⌚';
    if (c.includes('glass') || c.includes('spectacle')) return '👓';
    return '📦';
};

const Homepage = () => {
    const { authUser } = useAuthStore();
    const { items, getItems, isFetchingItems } = useItemStore();
    const navigate = useNavigate();

    useEffect(() => { getItems(); }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}
            className="min-h-screen bg-gray-100 py-2"
        >
            <Navbar />
            <div className="mx-auto mt-20 max-w-7xl px-4 pb-10">

                {/* Hero */}
                <div className="grid overflow-hidden rounded-2xl bg-white shadow-lg md:grid-cols-2 mb-12">
                    <div className="h-[320px] md:h-auto">
                        <img src="blockA.jpeg" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center bg-blue-900 px-8 py-10 text-white md:px-12">
                        <h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">Welcome to the Digital Lost&Found Online System</h1>
                        <p className="mb-8 max-w-md text-sm text-blue-100">
                            The campus lost and found platform for Kiambu Polytechnic students.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate('/report-lost')}
                                className="rounded-full bg-orange-500 px-6 py-2 text-sm font-semibold transition hover:bg-orange-600 cursor-pointer"
                            >
                                Lost an item?
                            </button>
                            <button
                                onClick={() => navigate('/report-found')}
                                className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-blue-900 transition hover:bg-gray-100 cursor-pointer"
                            >
                                Found an item?
                            </button>
                        </div>
                        <p className="mt-8 text-xs text-blue-200">
                            Logged in as <span className="font-semibold">{authUser.email}</span>
                        </p>
                    </div>
                </div>

                {/* Recent items */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Recent Posts</h2>
                        <button onClick={() => navigate('/found')} className="text-sm text-orange-500 hover:underline cursor-pointer">
                            View all
                        </button>
                    </div>
                    {isFetchingItems ? (
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-52 bg-gray-200 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">No items posted yet.</div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {items.slice(0, 8).map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => navigate(`/item/${item._id}`)}
                                    className="group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col"
                                >
                                    <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                alt={item.title}
                                            />
                                        ) : (
                                            <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-white">
                                                <span className="text-4xl mb-1 group-hover:scale-110 transition-transform duration-300">
                                                    {getCategoryIcon(item.category)}
                                                </span>
                                                <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest">No Photo</span>
                                            </div>
                                        )}
                                        <div className="absolute top-2 left-2">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow ${
                                                item.status === 'Lost' ? 'bg-red-500 text-white' :
                                                item.status === 'Found' ? 'bg-green-600 text-white' :
                                                'bg-blue-600 text-white'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-3 flex-1 flex flex-col">
                                        <h2 className="text-sm font-bold text-gray-800 line-clamp-1 mb-1 group-hover:text-orange-600 transition-colors">
                                            {item.title}
                                        </h2>
                                        <p className="text-xs text-gray-500 mt-auto">{item.owner?.username} • {item.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Homepage;
