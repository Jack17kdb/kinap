import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar.jsx';
import { useItemStore } from '../store/itemStore.js';
import { useAuthStore } from '../store/authStore.js';
import { useChatStore } from '../store/chatStore.js';
import { FiRefreshCw, FiTrash2 } from 'react-icons/fi';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const {
    item,
    getItemById,
    isFetchingItemDetails,
    updateItemStatus,
    deleteItem,
    isUpdatingStatus,
    isDeletingItems,
  } = useItemStore();

  useEffect(() => { getItemById(id); }, [id]);

  const handleContact = () => {
    setSelectedUser({
      _id: item.owner._id,
      username: item.owner.username,
      profilePic: item.owner.profilePic,
    });
    navigate('/chat');
  };

  const handleStatusToggle = async () => {
    const newStatus = item.status === 'Available' ? 'Unavailable' : 'Available';
    await updateItemStatus(item._id, newStatus);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this item?')) return;
    await deleteItem(item._id);
    navigate(-1);
  };

  if (isFetchingItemDetails) {
    return (
      <div className="min-h-screen bg-gray-100 py-2">
        <Navbar />
        <div className="mt-32 text-center text-gray-500">Loading item details...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-100 py-2">
        <Navbar />
        <div className="mt-32 text-center text-gray-500">Item not found</div>
      </div>
    );
  }

  const isOwner = authUser?._id === item.owner?._id;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
      className="min-h-screen bg-gray-100 py-2"
    >
      <Navbar />

      <div className="mx-auto mt-20 max-w-5xl px-4">
        <div className="grid gap-8 rounded-2xl bg-white p-8 shadow-lg md:grid-cols-2">

          {/* Image */}
          <img src={item.image} className="h-80 w-full rounded-xl object-cover" />

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Title + status badge */}
              <div className="mb-3 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{item.title}</h1>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  item.status === 'Available'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {item.status}
                </span>
              </div>

              {/* Owner */}
              <p className="mb-2 text-sm text-gray-500">
                Posted by{' '}
                <span
                  onClick={() => item.owner && navigate(`/user/${item.owner._id}`)}
                  className="cursor-pointer font-medium text-blue-600 hover:underline"
                >
                  {item.owner?.username}
                </span>
              </p>

              {/* Description */}
              <p className="mb-6 text-sm leading-relaxed text-gray-700">{item.description}</p>

              {/* Category */}
              <div className="mb-6">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {isOwner ? (
                <>
                  <button
                    onClick={handleStatusToggle}
                    disabled={isUpdatingStatus}
                    className="flex items-center gap-2 rounded-full border px-5 py-2 text-sm hover:bg-gray-100 disabled:opacity-50 cursor-pointer transition"
                  >
                    <FiRefreshCw size={16} />
                    {isUpdatingStatus
                      ? 'Updating...'
                      : item.status === 'Available'
                        ? 'Mark Unavailable'
                        : 'Mark Available'
                    }
                  </button>

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
                <button
                  onClick={handleContact}
                  className="rounded-full bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600 cursor-pointer transition"
                >
                  Contact {item.owner?.username}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemDetails;
