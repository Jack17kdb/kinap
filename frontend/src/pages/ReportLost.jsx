import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import SearchableDropdown from '../components/SearchableDropdown.jsx';
import { motion } from 'motion/react';
import { useItemStore } from '../store/itemStore.js';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const ReportLost = () => {
    const navigate = useNavigate();
    const { createLostItem, isCreatingItems, getCategories, getLocations, categories, locations } = useItemStore();

    const [preview, setPreview] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', image: '', category: '', location: '' });

    useEffect(() => {
        getCategories();
        getLocations();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreview(reader.result);
            setForm((f) => ({ ...f, image: reader.result }));
        };
    };

    const removeImage = () => {
        setPreview(null);
        setForm((f) => ({ ...f, image: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createLostItem(form);
        navigate('/lost');
    };

    const isValid = form.title.trim() && form.description.trim() && form.category && form.location;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-100 py-2">
            <Navbar />
            <div className="mx-auto mt-24 max-w-2xl px-4 pb-10">
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                    <div className="mb-6">
                        <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">Lost Item</span>
                        <h1 className="text-2xl font-bold text-gray-800">I Lost Something</h1>
                        <p className="text-sm text-gray-500 mt-1">Report it here — a photo helps but is not required.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Title <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. My student ID card"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-orange-400 transition"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Description <span className="text-red-400">*</span></label>
                            <textarea
                                rows={4}
                                placeholder="Describe it — colour, brand, where you last had it, any identifying marks..."
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-orange-400 transition resize-none"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <SearchableDropdown
                                label="Category *"
                                options={categories}
                                value={form.category}
                                onChange={(v) => setForm({ ...form, category: v })}
                                placeholder="Select category"
                            />
                            <SearchableDropdown
                                label="Last Seen Location *"
                                options={locations}
                                value={form.location}
                                onChange={(v) => setForm({ ...form, location: v })}
                                placeholder="Where did you lose it?"
                            />
                        </div>

                        {/* Image optional */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Photo <span className="text-gray-400 font-normal">(optional — helps if you have one)</span>
                            </label>
                            {preview ? (
                                <div className="relative inline-block group">
                                    <img src={preview} className="h-36 w-36 object-cover rounded-xl border border-gray-200" />
                                    <button type="button" onClick={removeImage}
                                        className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-md">
                                        <X size={12} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition">
                                    <span className="text-3xl text-gray-400 mb-1">📷</span>
                                    <span className="text-sm text-gray-500">Add a photo if you have one</span>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            )}
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isCreatingItems || !isValid}
                                className="rounded-full bg-red-500 px-8 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 transition cursor-pointer"
                            >
                                {isCreatingItems ? 'Reporting...' : 'Report Lost Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default ReportLost;
