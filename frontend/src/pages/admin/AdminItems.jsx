import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { useAdminStore } from '../../store/adminStore.js';
import { useParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

const AdminItems = () => {
    const { userId } = useParams();
    const { userPosts, getUserPosts, deletePost, isFetchingPosts, isDeletingPost } = useAdminStore();

    useEffect(() => {
        if (userId) getUserPosts(userId);
    }, [userId]);

    if (!userId) return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Items</h1>
            <p className="text-sm text-gray-500">Select a user from the Users page to view their posts.</p>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">User Posts</h1>
                <p className="text-sm text-gray-500">{userPosts.length} posts by this user</p>
            </div>

            {isFetchingPosts ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                            <div className="h-36 bg-gray-200" />
                            <div className="p-4 space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-3/4" />
                                <div className="h-2 bg-gray-200 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : userPosts.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-5xl mb-4">📭</p>
                    <p>No posts yet</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {userPosts.map((item) => (
                        <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                            {item.image ? (
                                <img src={item.image} className="h-36 w-full object-cover" />
                            ) : (
                                <div className="h-36 bg-gray-100 flex items-center justify-center">
                                    <span className="text-4xl">❓</span>
                                </div>
                            )}
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-sm font-semibold line-clamp-1">{item.title}</h3>
                                    <span className={`text-xs rounded-full px-2 py-0.5 ${
                                        item.status === 'Lost' ? 'bg-red-100 text-red-600' :
                                        item.status === 'Found' ? 'bg-green-100 text-green-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>{item.status}</span>
                                </div>
                                <p className="text-xs text-gray-500">{item.category} • {item.location}</p>
                                <button
                                    onClick={() => deletePost(item._id)}
                                    disabled={isDeletingPost}
                                    className="mt-3 flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition cursor-pointer disabled:opacity-50"
                                >
                                    <Trash2 size={13} /> Delete post
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminItems;
