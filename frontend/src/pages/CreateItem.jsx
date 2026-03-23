import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { motion } from 'motion/react';
import { useItemStore } from '../store/itemStore.js';
import { useNavigate } from 'react-router-dom';

const categories = ['IDs', 'Keys', 'Wallets', 'Gadgets', 'Bags'];

const CreateItem = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [userData, setUserData] = useState({
    title: '',
    description: '',
    image: null,
    category: '',
  });
  const { createItem, isCreatingItems } = useItemStore();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setUserData((prev) => ({ ...prev, image: reader.result }));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createItem(userData);
    setUserData({ title: '', description: '', image: null, category: '' });
    setImagePreview(null);
    navigate('/lostandfound');
  };

  const isValid = userData.title.trim() && userData.category && userData.image;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-gray-100 py-2"
    >
      <Navbar />

      <div className="mx-auto mt-28 max-w-2xl px-4">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="mb-2 text-2xl font-semibold">Post a Lost & Found Item</h1>
          <p className="text-sm text-gray-500 mb-8">
            Found something on campus? Lost something? Post it here so it can be returned.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                placeholder="e.g. Blue backpack, Student ID card"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-orange-400 transition"
                value={userData.title}
                onChange={(e) => setUserData({ ...userData, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows="4"
                placeholder="Where was it lost or found? Any identifying details?"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-orange-400 transition resize-none"
                value={userData.description}
                onChange={(e) => setUserData({ ...userData, description: e.target.value })}
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setUserData({ ...userData, category: cat })}
                    className={`rounded-full px-4 py-1.5 text-sm border transition cursor-pointer ${
                      userData.category === cat
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 cursor-pointer text-sm text-gray-500"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  className="mt-4 mx-auto h-48 w-48 rounded-xl object-cover shadow-md"
                />
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isCreatingItems || !isValid}
                className="rounded-full bg-orange-500 px-8 py-2 text-sm font-medium text-white hover:bg-orange-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isCreatingItems ? 'Posting...' : 'Post Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateItem;
