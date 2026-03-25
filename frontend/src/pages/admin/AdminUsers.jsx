import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { useAdminStore } from '../../store/adminStore.js';
import { useNavigate } from 'react-router-dom';
import { Search, User, CheckCircle, XCircle } from 'lucide-react';

const AdminUsers = () => {
    const { users, getUsers, isFetchingUsers } = useAdminStore();
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => { getUsers(search); }, search ? 300 : 0);
        return () => clearTimeout(timer);
    }, [search]);

    return (
        <AdminLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Users</h1>
                    <p className="text-sm text-gray-500">{users.length} registered users</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by username..."
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-400 transition bg-white"
                />
            </div>

            {isFetchingUsers ? (
                <div className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 animate-pulse flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-200" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-1/4" />
                                <div className="h-2 bg-gray-200 rounded w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3 hidden sm:table-cell">Student ID</th>
                                <th className="px-4 py-3 hidden md:table-cell">Role</th>
                                <th className="px-4 py-3">Verified</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={u.profilePic || '/default.jpeg'}
                                                className="w-9 h-9 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-800">{u.username}</p>
                                                <p className="text-xs text-gray-400">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden sm:table-cell text-gray-600">{u.studentId}</td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                            u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {u.isVerified
                                            ? <CheckCircle size={16} className="text-green-500" />
                                            : <XCircle size={16} className="text-red-400" />
                                        }
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => navigate(`/admin/users/${u._id}`)}
                                            className="text-xs text-orange-500 hover:underline cursor-pointer"
                                        >
                                            View Posts
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && (
                        <div className="text-center py-10 text-gray-400 text-sm">No users found</div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminUsers;
