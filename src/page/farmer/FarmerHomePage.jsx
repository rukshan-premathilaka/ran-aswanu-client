import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { farmerService } from '@/api/farmerService';

function FarmerHomePage() {
    const [tasks, setTasks] = useState([]);
    const [newTaskInput, setNewTaskInput] = useState('');
    const [customerOrders, setCustomerOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalPlots: 0,
        totalEarnings: '0',
        activeProducts: 0,
        alertCount: 0
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            // Fetch initial dashboard metrics and lists from backend
            const summaryData = await farmerService.getSummary().catch(() => null);
            const tasksData = await farmerService.getTasks().catch(() => []);
            const ordersData = await farmerService.getRecentOrders().catch(() => []);

            if (summaryData) setStats(summaryData);
            if (tasksData) setTasks(tasksData);
            if (ordersData) setCustomerOrders(ordersData);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleTask = async (id) => {
        try {
            await farmerService.toggleTask(id);
            setTasks(prevTasks =>
                prevTasks.map(item =>
                    item.id === id ? { ...item, done: !item.done } : item
                )
            );
        } catch (error) {
            console.error('Failed to toggle task status:', error);
            alert('Status update failed! Please try again.');
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        const trimmedTask = newTaskInput.trim();
        if (!trimmedTask) return;

        try {
            const payload = { task: trimmedTask, done: false };
            const created = await farmerService.createTask(payload);
            setTasks(prevTasks => [...prevTasks, created]);
            setNewTaskInput('');
        } catch (error) {
            console.error('Failed to add task:', error);
            alert('Failed to add task.');
        }
    };

    const handleDeleteTask = async (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this task?');
        if (!isConfirmed) return;

        try {
            await farmerService.deleteTask(id);
            setTasks(prevTasks => prevTasks.filter(item => item.id !== id));
        } catch (error) {
            console.error('Failed to delete task:', error);
            alert('Failed to delete task.');
        }
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto p-4 sm:p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back, Farmer!</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Live monitoring of your active plots, tasks, and recent customer orders.
                    </p>
                </div>
                <Link
                    to="/dashboard/add-harvest"
                    className="bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm active:scale-95 text-sm flex items-center gap-1.5"
                >
                    <Plus className="w-4 h-4" />
                    Add Harvest
                </Link>
            </div>

            {/* Overview Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Plots</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">
                        {loading ? '...' : `${stats.totalPlots} Fields`}
                    </h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Market Products</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">
                        {loading ? '...' : `${stats.activeProducts} Items`}
                    </h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">
                        {loading ? '...' : `LKR ${stats.totalEarnings}`}
                    </h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Field Alerts</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1 text-red-500">
                        {loading ? '...' : `${stats.alertCount} Issues`}
                    </h3>
                </div>
            </div>

            {/* Main Content Grid: Tasks & Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Daily Tasks Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[490px]">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-700">Daily Farm Tasks</h2>
                        <span className="text-xs font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded-lg border border-green-100">
                            {tasks.filter(t => t.done).length}/{tasks.length} Completed
                        </span>
                    </div>

                    <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                        {tasks.length === 0 && !loading ? (
                            <p className="text-sm text-gray-400 text-center mt-16">No daily tasks added yet.</p>
                        ) : (
                            tasks.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-green-50/40 transition-colors"
                                >
                                    <span
                                        onClick={() => handleToggleTask(item.id)}
                                        className={`text-sm font-medium cursor-pointer flex-1 select-none ${
                                            item.done ? 'line-through text-gray-400' : 'text-gray-700'
                                        }`}
                                    >
                                        {item.task}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span
                                            onClick={() => handleToggleTask(item.id)}
                                            className={`text-xs font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-colors select-none ${
                                                item.done
                                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                                    : 'bg-orange-100 text-orange-700 border border-orange-200'
                                            }`}
                                        >
                                            {item.done ? 'Done' : 'To Do'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteTask(item.id)}
                                            className="text-xs text-red-500 hover:text-red-700 font-bold p-1 hover:bg-red-50 rounded-md transition-colors"
                                            title="Delete Task"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Task Input Form (With Dark Green Border) */}
                    <form onSubmit={handleAddTask} className="mt-4 flex gap-2">
                        <input
                            type="text"
                            placeholder="Add a quick farm task..."
                            value={newTaskInput}
                            onChange={(e) => setNewTaskInput(e.target.value)}
                            className="w-full border border-green-700 rounded-xl px-4 py-2.5 text-sm bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/20 transition-all shadow-sm"
                        />
                        <button
                            type="submit"
                            className="bg-green-700 hover:bg-green-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-95 shadow-sm"
                        >
                            Add
                        </button>
                    </form>
                </div>

                {/* Orders Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[490px]">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-700">Recent Customer Orders</h2>
                        <p className="text-xs text-gray-500 font-medium">Manage items bought by your direct buyers.</p>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                        {customerOrders.length === 0 && !loading ? (
                            <p className="text-sm text-gray-400 text-center mt-16">No customer orders found.</p>
                        ) : (
                            customerOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-800 text-sm">{order.customerName}</h3>
                                            <span className="text-[10px] bg-gray-200 text-gray-600 font-bold px-2 py-0.5 rounded uppercase">
                                                {order.id}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 font-medium mt-1">
                                            {order.productName} ({order.quantity})
                                        </p>
                                        <p className="text-sm font-bold text-green-700 mt-1">
                                            LKR {order.totalPrice}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                                            order.status === 'Pending'
                                                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                                : 'bg-green-100 text-green-700 border border-green-200'
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FarmerHomePage;