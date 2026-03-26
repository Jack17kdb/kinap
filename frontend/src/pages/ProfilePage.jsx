import React, { useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { useItemStore } from '../store/itemStore.js';
import { MapPin, Tag } from 'lucide-react';

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

const ProfilePage = () => {
  const { items, getItems, isFetchingItems } = useItemStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => { getItems(); }, []);

  const userItems = items?.filter((item) => item.owner?._id === authUser?._id) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}
      className="min-h-screen bg-gray-100 py-2 mt-12"
    >
      <Navbar />
      <div className="relative mx-auto mt-6 max-w-6xl px-4">
        <div className="h-72 w-full overflow-hidden rounded-2xl">
          <img src="/kist.jpg" alt="Cover" className="h-full w-full object-cover brightness-75" />
        </div>
        <div className="relative mx-auto -mt-20 max-w-4xl rounded-2xl bg-white px-8 pb-8 pt-24 shadow-lg">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row text-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-1">{authUser.username}</h1>
              <p className="text-sm text-gray-500">{authUser.email}</p>
              <p className="text-sm text-gray-500">{authUser.studentId}</p>
              {!authUser.isVerified && (
                <span className="inline-block mt-2 rounded-full bg-yellow-100 px-3 py-0.5 text-xs text-yellow-600">
                  Email not verified
                </span>
              )}
            </div>
            <button
              onClick={() => navigate('/profile-edit')}
              className="rounded-full bg-orange-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-orange-600 cursor-pointer"
            >
              Edit Profile
            </button>
          </div>
        </div>
        <div className="absolute left-1/2 top-40 -translate-x-1/2">
          <div className="rounded-full bg-white p-1 shadow-lg">
            <img src={authUser.profilePic || '/default.jpeg'} alt="Profile" className="h-32 w-32 rounded-full object-cover" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 mt-8 pb-10">
        <h2 className="text-xl font-semibold mb-6">My Listings ({userItems.length})</h2>
        {isFetchingItems ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-52 bg-gray-200 rounded-xl animate-pulse" />)}
          </div>
        ) : userItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">📭</p>
            <p className="font-medium text-gray-600">You have no listings yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {userItems.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/item/${item._id}`)}
                className="group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col border border-gray-100"
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
                  <h2 className="text-sm font-bold text-gray-800 line-clamp-1 mb-2 group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h2>
                  <div className="mt-auto space-y-1">
                    <div className="flex items-center text-xs text-gray-500 gap-1">
                      <Tag size={11} className="text-gray-400" />
                      <span>{item.category}</span>
                    </div>
                    {item.location && (
                      <div className="flex items-center text-xs text-gray-500 gap-1">
                        <MapPin size={11} className="text-orange-400" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
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

export default ProfilePage;
