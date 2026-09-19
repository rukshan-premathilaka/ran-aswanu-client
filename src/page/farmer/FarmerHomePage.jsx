import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { farmerService } from '@/api/farmerService';

function FarmerHomePage() {
    const [tasks, setTasks] = useState([]);
    const [newTaskInput, setNewTaskInput] = useState("");
    const [customerOrders, setCustomerOrders] = useState([]);
    const [stats, setStats] = useState({
        totalPlots: 0,
        totalEarnings: "0",
        activeProducts: 0,
        alertCount: 0
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Backend එකෙන් සියලු දත්ත ලබා ගැනීම
            const [summaryData, tasksData, ordersData] = await Promise.all([
                farmerService.getSummary().catch(() => null),
                farmerService.getTasks().catch(() => []),
                farmerService.getRecentOrders().catch(() => [])
            ]);

            if (summaryData) setStats(summaryData);
            if (tasksData) setTasks(tasksData);
            if (ordersData) setCustomerOrders(ordersData);
        } catch (error) {
            console.error("Dashboard data load error:", error);
        }
    };

    const handleToggleTask = async (id) => {
        try {
            await farmerService.toggleTask(id);
            setTasks(tasks.map(item => item.id === id ? { ...item, done: !item.done } : item));
        } catch (error) {
            alert("Status update failed!");
        }
    };

    const handleAddTask = async () => {
        if (newTaskInput.trim() === "") return;
        try {
            const newTask = await farmerService.createTask({ task: newTaskInput, done: false });
            setTasks([...tasks, newTask]);
            setNewTaskInput("");
        } catch (error) {
            alert("Failed to add task.");
        }
    };

    const handleDeleteTask = async (id) => {
        if(!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await farmerService.deleteTask(id);
            setTasks(tasks.filter(item => item.id !== id));
        } catch (error) {
            alert("Failed to delete task.");
        }
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back, Farmer!</h1>
                    <p className="text-gray-500 mt-1">Live structural monitoring and harvest listing analytics dashboard.</p>
                </div>
                <Link to="/dashboard/add-harvest" className="bg-[#8dc63f] hover:bg-green-600 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm active:scale-95 text-sm">
                    + Add Harvest
                </Link>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Plots</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.totalPlots} Fields</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Market Products</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.activeProducts} Items</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">LKR {stats.totalEarnings}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Field Alerts</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1 text-red-500">{stats.alertCount} Issues</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Tasks Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[480px]">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Daily Farm Tasks</h3>
                    <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                        {tasks.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                                <span onClick={() => handleToggleTask(item.id)} className={`text-sm font-medium cursor-pointer flex-1 ${item.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                    {item.task}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded cursor-pointer ${item.done ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`} onClick={() => handleToggleTask(item.id)}>
                                        {item.done ? 'Done' : 'To Do'}
                                    </span>
                                    <button onClick={() => handleDeleteTask(item.id)} className="text-xs text-red-500 hover:text-red-700 font-bold px-2 py-0.5 border border-red-200 rounded">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                        <input type="text" placeholder="Add a quick farm task..." value={newTaskInput} onChange={(e) => setNewTaskInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTask()} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#8dc63f] bg-gray-50" />
                        <button onClick={handleAddTask} className="bg-[#8dc63f] text-white font-bold px-4 py-2 rounded-xl text-sm transition-all active:scale-95">Add</button>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[480px]">
                    <h3 className="text-lg font-bold text-gray-700">Recent Customer Orders</h3>
                    <p className="text-xs text-gray-500 mb-4 font-medium">Manage items bought by your customers.</p>
                    <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                        {customerOrders.length === 0 ? <p className="text-sm text-gray-400 text-center mt-10">No orders found.</p> : customerOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-gray-800 text-sm">{order.customerName}</h4>
                                        <span className="text-[10px] bg-gray-200 text-gray-600 font-bold px-2 py-0.5 rounded uppercase">{order.id}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 font-medium mt-1">{order.productName} ({order.quantity})</p>
                                    <p className="text-sm font-bold text-[#8dc63f] mt-1">LKR {order.totalPrice}</p>
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${order.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                    {order.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FarmerHomePage;