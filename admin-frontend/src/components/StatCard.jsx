import React from 'react';

const StatCard = ({ title, value, icon }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-blue-500 text-white p-3 rounded-full">
                {icon}
            </div>
            <div className="ml-4">
                <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                <p className="text-2xl font-semibold">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
