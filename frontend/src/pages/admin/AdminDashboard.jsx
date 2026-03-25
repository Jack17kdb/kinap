import React, { useEffect } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { useAdminStore } from '../../store/adminStore.js';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Package, Search, CheckCircle, MapPin } from 'lucide-react';

const COLORS = ['#ef4444', '#22c55e', '#3b82f6'];

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-800">{value ?? '—'}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);

const AdminDashboard = () => {
    const { getItemStats, itemStats, locationStats, isFetchingStats } = useAdminStore();

    useEffect(() => { getItemStats(); }, []);

    const pieData = itemStats ? [
        { name: 'Lost', value: itemStats.lost },
        { name: 'Found', value: itemStats.found },
    ] : [];

    const barData = locationStats.slice(0, 10).map((l) => ({
        name: l._id || 'Unknown',
        count: l.count,
    }));

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-500">Overview of Kinap activity</p>
            </div>

            {isFetchingStats ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {/* Stat cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <StatCard label="Total Items" value={itemStats?.total} icon={Package} color="bg-blue-500" />
                        <StatCard label="Lost" value={itemStats?.lost} icon={Search} color="bg-red-500" />
                        <StatCard label="Found" value={itemStats?.found} icon={CheckCircle} color="bg-green-500" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pie */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="font-semibold text-gray-800 mb-4">Lost vs Found</h2>
                            {pieData.every((d) => d.value === 0) ? (
                                <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data yet</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={4}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {pieData.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Bar — top locations */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <MapPin size={16} className="text-orange-500" />
                                Top Locations for Lost Items
                            </h2>
                            {barData.length === 0 ? (
                                <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data yet</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 11 }}
                                            angle={-35}
                                            textAnchor="end"
                                            interval={0}
                                        />
                                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    );
};

export default AdminDashboard;
