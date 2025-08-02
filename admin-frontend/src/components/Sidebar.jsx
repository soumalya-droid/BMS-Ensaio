import React from 'react';
import { Link } from 'react-router-dom';

const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Supply Chain', path: '/supply-chain' },
    { name: 'Manufacturing', path: '/manufacturing' },
    { name: 'Rental Platform', path: '/rentals' },
    { name: 'Account Management', path: '/accounting' },
    { name: 'Settings', path: '/settings' },
];

const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-800 text-white flex flex-col">
            <div className="h-16 flex items-center justify-center text-2xl font-bold">
                ERP Admin
            </div>
            <nav className="flex-1 px-2 py-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className="block px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
