import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import {
    LayoutDashboard, Users, FileText, MapPin, Tag,
    Menu, X, LogOut, ChevronRight
} from 'lucide-react';

const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/items', label: 'Items', icon: FileText },
    { to: '/admin/locations', label: 'Locations', icon: MapPin },
    { to: '/admin/categories', label: 'Categories', icon: Tag },
];

const AdminLayout = ({ children }) => {
    const [open, setOpen] = useState(false);
    const { authUser, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden">
            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Drawer */}
            <aside className={`
                fixed top-0 left-0 h-screen w-64 bg-blue-900 text-white z-40 flex flex-col
                transform transition-transform duration-300
                ${open ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:flex md:h-screen md:shrink-0
            `}>
                {/* Logo */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-blue-800 shrink-0">
                    <div>
                        <h1 className="text-lg font-bold">Kinap Admin</h1>
                        <p className="text-xs text-blue-300">{authUser?.email}</p>
                    </div>
                    <button onClick={() => setOpen(false)} className="md:hidden text-blue-300 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {links.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                                    isActive
                                        ? 'bg-orange-500 text-white'
                                        : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="px-3 py-4 border-t border-blue-800 shrink-0">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-blue-200 hover:bg-blue-800 hover:text-white transition w-full"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top bar (mobile) */}
                <header className="md:hidden bg-white shadow-sm px-4 py-3 flex items-center gap-3 sticky top-0 z-20 shrink-0">
                    <button onClick={() => setOpen(true)} className="text-gray-600 hover:text-gray-800">
                        <Menu size={22} />
                    </button>
                    <h1 className="font-bold text-gray-800">Kinap Admin</h1>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
