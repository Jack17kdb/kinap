import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import SearchableDropdown from '../components/SearchableDropdown.jsx';
import { motion } from 'motion/react';
import { useItemStore } from '../store/itemStore.js';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const LostItems = () => {
    const navigate = useNavigate();
    const { items, getItems, isFetchingItems, categories, locations, getCategories, getLocations } = useItemStore();

    const [filters, setFilters] = useState({ search: '', category: '', location: '', date: '' });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => { getCategories(); getLocations(); }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            getItems({ ...filters, status: 'Lost' });
        }, filters.search ? 300 : 0);
        return () => clearTimeout(timer);
    }, [filters]);

    const setFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

    const clearFilters = () => setFilters({ search: '', category: '', location: '', date: '' });

    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-100 py-2">
            <Navbar />
            <div className="mx-auto mt-20 max-w-7xl px-4 pb-10">
                {/* Filter bar */}
                <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
                    {/* Search always visible */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => setFilter('search', e.target.value)}
                                placeholder="Search lost items..."
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-400 transition"
                            />
                            {filters.search && (
                                <button onClick={() => setFilter('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => setShowFilters((s) => !s)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition cursor-pointer ${
                                showFilters || activeFiltersCount > 0
                                    ? 'border-orange-400 text-orange-600 bg-orange-50'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <SlidersHorizontal size={15} />
                            Filters
                            {activeFiltersCount > 0 && (
                                <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                        {activeFiltersCount > 0 && (
                            <button onClick={clearFilters} className="text-sm text-red-500 hover:underline cursor-pointer">
                                Clear all
                            </button>
                        )}
                    </div>

                    {/* Expanded filters */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100"
                        >
                            <SearchableDropdown
                                placeholder="All categories"
                                options={categories}
                                value={filters.category}
                                onChange={(v) => setFilter('category', v)}
                            />
                            <SearchableDropdown
                                placeholder="All locations"
                                options={locations}
                                value={filters.location}
                                onChange={(v) => setFilter('location', v)}
                            />
                            <div>
                                <input
                                    type="date"
                                    value={filters.date}
                                    onChange={(e) => setFilter('date', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-400 transition text-gray-600"
                                />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Results */}
                {isFetchingItems ? (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-44 bg-gray-200" />
                                <div className="p-4 space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                                    <div className="h-2 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-5xl mb-4">😔</p>
                        <p className="font-medium text-gray-600">No lost items found</p>
                        <p className="text-sm mt-1">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {items.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => navigate(`/item/${item._id}`)}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                            >
                                {item.image ? (
                                    <img src={item.image} className="h-44 w-full object-cover" />
                                ) : (
                                    <div className="h-44 bg-gray-100 flex items-center justify-center">
                                        <span className="text-5xl">❓</span>
                                    </div>
                                )}
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <h2 className="text-sm font-semibold line-clamp-1">{item.title}</h2>
                                        <span className="rounded-full bg-red-100 text-red-600 px-2 py-0.5 text-xs shrink-0 ml-2">Lost</span>
                                    </div>
                                    <p className="text-xs text-gray-500">{item.owner?.username} • {item.category}</p>
                                    <p className="text-xs text-orange-500 mt-1 font-medium">{item.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default LostItems;
