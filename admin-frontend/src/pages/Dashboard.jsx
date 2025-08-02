import React from 'react';
import StatCard from '../components/StatCard';
import { ShoppingCart, Package, DollarSign } from 'lucide-react';
import Chart from 'react-apexcharts';

const Dashboard = () => {
    // Placeholder data for the chart
    const chartOptions = {
        chart: {
            id: 'daily-orders-chart',
        },
        xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
    };
    const chartSeries = [
        {
            name: 'Orders',
            data: [30, 40, 45, 50, 49, 60, 70],
        },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <StatCard title="Total Orders" value="1,234" icon={<ShoppingCart />} />
                <StatCard title="Total Stock" value="56,789" icon={<Package />} />
                <StatCard title="Total Revenue" value="$123,456" icon={<DollarSign />} />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Daily Orders</h2>
                    <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <ul>
                        <li className="border-b py-2">New order #1234 created.</li>
                        <li className="border-b py-2">Stock updated for SKU #5678.</li>
                        <li className="py-2">User 'admin' logged in.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
