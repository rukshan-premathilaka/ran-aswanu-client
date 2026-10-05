import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import logoImg from '../assets/farmerImg/logo.png';
import { useAdminMe } from '@/component/admin/AdminContext.js';

//white sidebar + scrolling main
const AdminLayout = () => {
    const navigate = useNavigate();
    const me = useAdminMe();

    const navItems = [
        { path: '/admin', label: 'Dashboard', end: true },
        { path: '/admin/users', label: 'Users' },
        { path: '/admin/products', label: 'Products' },
        { path: '/admin/support', label: 'Support Messages' },
        { path: '/admin/statistics', label: 'Statistics' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('my_app_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_roles');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const linkClass = ({ isActive }) =>
        `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            isActive
                ? 'bg-green-100/70 text-green-900 font-bold shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
        }`;

    return (
        <div className="relative flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
            {/* Left sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 flex-shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-8 pl-2">
                        <img src={logoImg} alt="Ran Aswanna Logo" className="w-8 h-8 object-contain" />
                        <h1 className="text-2xl font-bold text-green-600 tracking-tight">Ran Aswanna</h1>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <NavLink key={item.path} to={item.path} end={item.end} className={linkClass}>
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="space-y-1 border-t border-gray-100 pt-4">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 transition-all hover:bg-red-50 hover:text-red-700 cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Right side: header + page */}
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-3 md:px-8">
                    <p className="text-sm font-semibold text-gray-500">Admin Panel</p>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-800">{me?.username || 'Admin'}</p>
                            <p className="text-xs text-gray-400">Administrator</p>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800">
                            {(me?.username || 'A').charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
