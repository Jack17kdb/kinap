import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
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

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const navigate = useNavigate();
  const { items, searchItems, isFetchingItems } = useItemStore();

  useEffect(() => { if (query) searchItems(query); }, [query]);

  return (
    <div className="min-h-screen bg-gray-100 py-2">
      <Navbar />
      <div className="mx-auto mt-20 max-w-7xl px-4 pb-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Search Results</h1>
          <p className="mt-1 text-sm text-gray-500">
            Showing results for <span className="font-medium text-orange-500">"{query}"</span>
          </p>
        </div>

        {isFetchingItems ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-52 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">🔍</p>
            <p className="font-medium text-gray-600">No items matched your search.</p>
            <p className="text-sm mt-1">Try different keywords.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/item/${item._id}`)}
                className="group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col border border-gray-100"
              >
                <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                  <p className="text-xs text-gray-500 mb-2">
                    <span
                      onClick={(e) => { e.stopPropagation(); navigate(`/user/${item.owner?._id}`); }}
                      className="cursor-pointer font-medium text-blue-600 hover:underline"
                    >
                      {item.owner?.username}
                    </span>
                  </p>
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
    </div>
  );
};

export default SearchPage;
