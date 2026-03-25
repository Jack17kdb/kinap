import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { useAdminStore } from '../../store/adminStore.js';
import { useItemStore } from '../../store/itemStore.js';
import { Plus, Tag } from 'lucide-react';

const AdminCategories = () => {
    const { addCategory, isAddingCategory } = useAdminStore();
    const { categories, getCategories } = useItemStore();
    const [input, setInput] = useState('');

    useEffect(() => { getCategories(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const ok = await addCategory(input.trim());
        if (ok) { setInput(''); getCategories(); }
    };

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                <p className="text-sm text-gray-500">Manage item categories available to students</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h2 className="font-semibold text-gray-700 mb-4">Add New Category</h2>
                <form onSubmit={handleAdd} className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g. Electronics, Documents, Clothing"
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-orange-400 transition"
                    />
                    <button
                        type="submit"
                        disabled={isAddingCategory || !input.trim()}
                        className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 transition cursor-pointer"
                    >
                        <Plus size={16} />
                        {isAddingCategory ? 'Adding...' : 'Add'}
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-600">{categories.length} categories</p>
                </div>
                {categories.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">No categories added yet</div>
                ) : (
                    <ul className="divide-y divide-gray-50">
                        {categories.map((c) => (
                            <li key={c._id} className="flex items-center gap-3 px-4 py-3">
                                <Tag size={16} className="text-orange-400 shrink-0" />
                                <span className="text-sm text-gray-700">{c.name}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminCategories;
