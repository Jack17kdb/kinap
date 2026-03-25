import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import SearchableDropdown from '../components/SearchableDropdown.jsx';
import { motion } from 'motion/react';
import { useItemStore } from '../store/itemStore.js';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const MAX_IMAGES = 1;

const ReportFound = () => {
    const navigate = useNavigate();
    const { createFoundItem, isCreatingItems, getCategories, getLocations, categories, locations } = useItemStore();

    const [previews, setPreviews] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', images: [], category: '', location: '' });

    useEffect(() => {
        getCategories();
        getLocations();
    }, []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const remaining = MAX_IMAGES - previews.length;
        const allowed = files.slice(0, remaining);
        allowed.forEach((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setPreviews((p) => [...p, { dataUrl: reader.result }]);
                setForm((f) => ({ ...f, images: [...f.images, reader.result] }));
            };
        });
        e.target.value = '';
    };

    const removeImage = (i) => {
        setPreviews((p) => p.filter((_, idx) => idx !== i));
        setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Backend createItem expects single `image` — send first image
        await createFoundItem({ ...form, image: form.images[0] });
        navigate('/found');
    };

    const isValid = form.title.trim() && form.description.trim() && form.category && form.location && form.images.length > 0;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-100 py-2">
            <Navbar />
            <div className="mx-auto mt-24 max-w-2xl px-4 pb-10">
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                    <div className="mb-6">
                        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">Found Item</span>
                        <h1 className="text-2xl font-bold text-gray-800">I Found Something</h1>
                        <p className="text-sm text-gray-500 mt-1">Post what you found so the owner can claim it.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Title <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                placeholder="e.g. Blue backpack with HP sticker"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-orange-400 transition"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Description <span className="text-red-400">*</span></label>
                            <textarea
                                rows={4}
                                placeholder="Describe the item — colour, brand, contents, condition..."
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
                                label="Location Found *"
                                options={locations}
                                value={form.location}
                                onChange={(v) => setForm({ ...form, location: v })}
                                placeholder="Where found?"
                            />
                        </div>

                        {/* Images — required */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Photos <span className="text-red-400">*</span>
                                    <span className="text-gray-400 font-normal ml-1">(required)</span>
                                </label>
                                <span className={`text-xs ${previews.length >= MAX_IMAGES ? 'text-red-400' : 'text-gray-400'}`}>
                                    {previews.length}/{MAX_IMAGES}
                                </span>
                            </div>

                            {previews.length > 0 ? (
                                <div className="grid grid-cols-3 gap-3">
                                    {previews.map((p, i) => (
                                        <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200">
                                            <img src={p.dataUrl} className="h-28 w-full object-cover" />
                                            <button type="button" onClick={() => removeImage(i)}
                                                className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-md">
                                                <X size={12} />
                                            </button>
                                            {i === 0 && (
                                                <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full">Cover</span>
                                            )}
                                        </div>
                                    ))}
                                    {previews.length < MAX_IMAGES && (
                                        <label className="h-28 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition">
                                            <span className="text-2xl text-gray-400">+</span>
                                            <span className="text-xs text-gray-400 mt-1">Add photo</span>
                                            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                                        </label>
                                    )}
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition">
                                    <span className="text-3xl text-gray-400 mb-1">📷</span>
                                    <span className="text-sm text-gray-500">Click to upload photos</span>
                                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                                </label>
                            )}
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isCreatingItems || !isValid}
                                className="rounded-full bg-green-600 px-8 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition cursor-pointer"
                            >
                                {isCreatingItems ? 'Posting...' : 'Post Found Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default ReportFound;
