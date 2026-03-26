import React, { useEffect } from 'react';
import AdminLayout from './AdminLayout.jsx';
import { useAdminStore } from '../../store/adminStore.js';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar
} from 'recharts';
import { Package, AlertCircle, CheckCircle2, TrendingUp, MapPin, ArrowUpRight } from 'lucide-react';

const COLORS = { Lost: '#ef4444', Found: '#22c55e', Recovered: '#3b82f6' };

const StatCard = ({ label, value, icon: Icon, color, bgColor, trend }) => (
    <div className={`rounded-2xl p-5 ${bgColor} border border-white/60 shadow-sm flex flex-col gap-3`}>
        <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
            {trend != null && (
                <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                    <ArrowUpRight size={12} />
                    {trend}
                </div>
            )}
        </div>
        <div>
            <p className="text-3xl font-black text-gray-800 tracking-tight">{value ?? '—'}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5 uppercase tracking-wide">{label}</p>
        </div>
    </div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-100 shadow-lg rounded-xl px-4 py-3 text-sm">
                <p className="font-semibold text-gray-700 mb-1">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.fill || p.color }} className="font-medium">
                        {p.value} item{p.value !== 1 ? 's' : ''}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const AdminDashboard = () => {
    const { getItemStats, itemStats, locationStats, isFetchingStats } = useAdminStore();

    useEffect(() => { getItemStats(); }, []);

    const total = itemStats?.total || 0;
    const lost = itemStats?.lost || 0;
    const found = itemStats?.found || 0;
    const recoveryRate = total > 0 ? Math.round((found / total) * 100) : 0;

    const pieData = [
        { name: 'Lost', value: lost, fill: COLORS.Lost },
        { name: 'Found', value: found, fill: COLORS.Found },
    ].filter(d => d.value > 0);

    const barData = locationStats.slice(0, 8).map((l) => ({
        name: l._id?.length > 12 ? l._id.slice(0, 12) + '…' : (l._id || 'Unknown'),
        fullName: l._id || 'Unknown',
        Lost: l.count,
    }));

    return (
        <AdminLayout>
            {/* Page header */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-800 tracking-tight">Dashboard</h1>
                <p className="text-sm text-gray-400 mt-0.5">Live overview of Kinap activity</p>
            </div>

            {isFetchingStats ? (
                <div className="flex items-center justify-center py-32">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Stat cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            label="Total Items"
                            value={total}
                            icon={Package}
                            color="bg-blue-500"
                            bgColor="bg-blue-50"
                        />
                        <StatCard
                            label="Lost"
                            value={lost}
                            icon={AlertCircle}
                            color="bg-red-500"
                            bgColor="bg-red-50"
                        />
                        <StatCard
                            label="Found"
                            value={found}
                            icon={CheckCircle2}
                            color="bg-green-500"
                            bgColor="bg-green-50"
                        />
                        <StatCard
                            label="Recovery Rate"
                            value={`${recoveryRate}%`}
                            icon={TrendingUp}
                            color="bg-orange-500"
                            bgColor="bg-orange-50"
                        />
                    </div>

                    {/* Charts row */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                        {/* Pie — 2 cols */}
                        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="font-bold text-gray-800">Lost vs Found</h2>
                                    <p className="text-xs text-gray-400 mt-0.5">Distribution of all items</p>
                                </div>
                            </div>
                            {pieData.length === 0 ? (
                                <div className="flex items-center justify-center h-52 text-gray-400 text-sm flex-col gap-2">
                                    <Package size={32} className="opacity-30" />
                                    <p>No data yet</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={85}
                                            paddingAngle={3}
                                            dataKey="value"
                                            strokeWidth={0}
                                        >
                                            {pieData.map((entry, i) => (
                                                <Cell key={i} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend
                                            iconType="circle"
                                            iconSize={8}
                                            formatter={(value) => (
                                                <span className="text-xs font-medium text-gray-600">{value}</span>
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Bar — 3 cols */}
                        <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <MapPin size={14} className="text-orange-500" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-800">Hotspot Locations</h2>
                                    <p className="text-xs text-gray-400">Top places items go missing</p>
                                </div>
                            </div>
                            {barData.length === 0 ? (
                                <div className="flex items-center justify-center h-52 text-gray-400 text-sm flex-col gap-2">
                                    <MapPin size={32} className="opacity-30" />
                                    <p>No location data yet</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart
                                        data={barData}
                                        margin={{ top: 5, right: 5, left: -25, bottom: 45 }}
                                        barSize={28}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 11, fill: '#9ca3af' }}
                                            angle={-35}
                                            textAnchor="end"
                                            interval={0}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 11, fill: '#9ca3af' }}
                                            allowDecimals={false}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fff7ed' }} />
                                        <Bar dataKey="Lost" fill="#f97316" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Summary strip */}
                    <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-5 text-white flex flex-wrap items-center gap-6">
                        <div>
                            <p className="text-blue-300 text-xs font-medium uppercase tracking-wide">System Status</p>
                            <p className="text-lg font-bold mt-0.5">Kinap is running normally</p>
                        </div>
                        <div className="flex gap-6 ml-auto">
                            <div className="text-center">
                                <p className="text-2xl font-black">{total}</p>
                                <p className="text-blue-300 text-xs">Total Posts</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black">{recoveryRate}%</p>
                                <p className="text-blue-300 text-xs">Recovery Rate</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black">{locationStats.length}</p>
                                <p className="text-blue-300 text-xs">Active Locations</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminDashboard;
