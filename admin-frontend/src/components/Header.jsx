import React from 'react';

const Header = () => {
    return (
        <header className="bg-white shadow-md p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                {/* User profile and notifications will go here */}
                <div>User</div>
            </div>
        </header>
    );
};

export default Header;
