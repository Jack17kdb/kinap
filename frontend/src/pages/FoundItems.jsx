import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import SearchableDropdown from '../components/SearchableDropdown.jsx';
import { motion } from 'motion/react';
import { useItemStore } from '../store/itemStore.js';
import { Search, SlidersHorizontal, X, MapPin, Tag, CheckCircle } from 'lucide-react';

const FoundItems = () => {
    const navigate = useNavigate();
    const { foundItems, getFoundItems, isFetchingFoundItems, categories, locations, getCategories, getLocations } = useItemStore();
    const [filters, setFilters] = useState({ search: '', category: '', location: '', date: '' });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => { getCategories(); getLocations(); }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            getFoundItems({...filters, status: "Found"});
        }, filters.search ? 300 : 0);
        return () => clearTimeout(timer);
    }, [filters]);

    const setFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val }));
    const clearFilters = () => setFilters({ search: '', category: '', location: '', date: '' });
    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-50 py-2">
            <Navbar />
            <div className="mx-auto mt-20 max-w-7xl px-4 pb-10">
                
                {/* Search & Filter Header */}
                <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 border border-gray-100">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[280px]">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => setFilter('search', e.target.value)}
                                placeholder="Search through found items..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition cursor-pointer ${
                                showFilters || activeFiltersCount > 0 ? 'border-green-400 text-green-600 bg-green-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <SlidersHorizontal size={16} />
                            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                        </button>
                    </div>

                    {showFilters && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 mt-4 border-t border-gray-50">
                            <SearchableDropdown placeholder="Category" options={categories} value={filters.category} onChange={(v) => setFilter('category', v)} />
                            <SearchableDropdown placeholder="Location" options={locations} value={filters.location} onChange={(v) => setFilter('location', v)} />
                            <input type="date" value={filters.date} onChange={(e) => setFilter('date', e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-400" />
                        </motion.div>
                    )}
                </div>

                {/* Main Grid */}
                {isFetchingFoundItems ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[...Array(8)].map((_, i) => <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />)}
                    </div>
                ) : foundItems.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-lg font-bold text-gray-800">No found items yet</h3>
                        <p className="text-gray-500 text-sm">Everything seems to be with its rightful owner for now!</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {foundItems.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => navigate(`/item/${item._id}`)}
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                            >
                                {/* Media Section */}
                                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                                    <img 
                                        src={item.image} 
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                        alt={item.title} 
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-green-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg flex items-center gap-1">
                                            <CheckCircle size={10} /> Found
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <h2 className="text-base font-bold text-gray-800 line-clamp-1 mb-1 group-hover:text-green-600 transition-colors">
                                        {item.title}
                                    </h2>
                                    <p className="text-xs text-gray-500 mb-4 line-clamp-2 italic">
                                        "{item.description || 'Item found and safely stored...'}"
                                    </p>
                                    
                                    <div className="mt-auto space-y-2">
                                        <div className="flex items-center text-xs text-gray-600">
                                            <MapPin size={14} className="text-green-500 mr-2 shrink-0" />
                                            <span className="truncate">{item.location}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-600">
                                            <Tag size={14} className="text-gray-400 mr-2 shrink-0" />
                                            <span>{item.category}</span>
                                        </div>
                                        <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                                            <span className="text-[10px] font-medium text-gray-400 uppercase">Found by {item.owner?.username || 'Anonymous'}</span>
                                            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-xs font-bold text-green-600 border border-green-100">
                                                {item.owner?.username?.charAt(0) || '?'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default FoundItems;
