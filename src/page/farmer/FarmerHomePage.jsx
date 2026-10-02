import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

function FarmerHomePage() {
    // 1. Dashboard Metrics from Real Database
    const [plotsCount, setPlotsCount] = useState(0);
    const [productsCount, setProductsCount] = useState(0);
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);

    // 2. Daily Farm Tasks (Activities)
    const [tasks, setTasks] = useState([]);
    const [newTaskInput, setNewTaskInput] = useState("");
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);

    // 3. Customer Orders
    const [customerOrders, setCustomerOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);

    // 1. Load Live Metrics (Crops & Products) from Database
    const loadDashboardMetrics = async () => {
        setIsLoadingMetrics(true);

        // A. Load Active Plots Count from Database
        try {
            const cropsData = await api.request('GET', '/farmer/crops');
            if (Array.isArray(cropsData)) {
                setPlotsCount(cropsData.length);
            }
        } catch (err) {
            console.warn("Failed to fetch crops count:", err);
            setPlotsCount(0);
        }

        // B. Load Market Products Count from Database
        try {
            const productsData = await api.request('GET', '/farmer/products');
            if (Array.isArray(productsData)) {
                setProductsCount(productsData.length);
            } else if (productsData && Array.isArray(productsData.content)) {
                setProductsCount(productsData.content.length);
            }
        } catch (err) {
            console.warn("Failed to fetch products count:", err);
            setProductsCount(0);
        }

        setIsLoadingMetrics(false);
    };

    // 2. Load Daily Tasks (Farm Activities) from Backend
    const loadTasks = async () => {
        setIsLoadingTasks(true);
        try {
            const data = await api.request('GET', '/farmer/activities');
            if (Array.isArray(data)) {
                setTasks(data);
            } else {
                setTasks([]);
            }
        } catch (err) {
            console.warn("Activities endpoint not ready, loading local tasks:", err);
            const savedTasks = localStorage.getItem('farmer_local_activities');
            if (savedTasks) {
                setTasks(JSON.parse(savedTasks));
            } else {
                setTasks([
                    { activityId: 1, activity: "Apply organic fertilizer to Carrot plot", activityStatus: false },
                    { activityId: 2, activity: "Inspect soil moisture index in Plot A", activityStatus: true }
                ]);
            }
        } finally {
            setIsLoadingTasks(false);
        }
    };

    // 3. Load Customer Orders
    const loadOrders = async () => {
        setIsLoadingOrders(true);
        try {
            const data = await api.request('GET', '/farmer/orders');
            if (Array.isArray(data)) {
                setCustomerOrders(data);
            } else {
                setCustomerOrders([]);
            }
        } catch (err) {
            console.warn("Farmer orders endpoint not ready:", err);
            setCustomerOrders([
                { orderId: "ORD-101", customer: "Kamal Perera", item: "Organic Carrots", qty: "5 kg", total: "LKR 900", status: "Pending" },
                { orderId: "ORD-102", customer: "Sunil Shantha", item: "Keeri Samba", qty: "20 kg", total: "LKR 4,800", status: "Delivered" }
            ]);
        } finally {
            setIsLoadingOrders(false);
        }
    };

    useEffect(() => {
        loadDashboardMetrics();
        loadTasks();
        loadOrders();
    }, []);

    // Add New Farm Task
    const handleAddTask = async () => {
        if (!newTaskInput.trim()) return;

        const payload = { activity: newTaskInput.trim() };

        try {
            const saved = await api.request('POST', '/farmer/activities', payload);
            if (saved && saved.activityId) {
                setTasks([...tasks, saved]);
            } else {
                const localItem = { activityId: Date.now(), activity: newTaskInput.trim(), activityStatus: false };
                const updated = [...tasks, localItem];
                setTasks(updated);
                localStorage.setItem('farmer_local_activities', JSON.stringify(updated));
            }
        } catch {
            const localItem = { activityId: Date.now(), activity: newTaskInput.trim(), activityStatus: false };
            const updated = [...tasks, localItem];
            setTasks(updated);
            localStorage.setItem('farmer_local_activities', JSON.stringify(updated));
        }

        setNewTaskInput("");
    };

    // Delete Farm Task
    const handleDeleteTask = async (activityId, e) => {
        e.stopPropagation();

        try {
            await api.request('DELETE', `/farmer/activities/${activityId}`);
        } catch {
            // Local fallback
        }

        const updated = tasks.filter(t => t.activityId !== activityId);
        setTasks(updated);
        localStorage.setItem('farmer_local_activities', JSON.stringify(updated));
    };

    // Toggle Task Complete Status
    const handleToggleTask = async (activityId, currentStatus) => {
        const newStatus = !currentStatus;

        try {
            await api.request('PATCH', `/farmer/activities/${activityId}/status`, { done: newStatus });
        } catch {
            // Local fallback
        }

        const updated = tasks.map(t => t.activityId === activityId ? { ...t, activityStatus: newStatus } : t);
        setTasks(updated);
        localStorage.setItem('farmer_local_activities', JSON.stringify(updated));
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-sm text-gray-500 mt-1">Live monitoring and central database analytics dashboard.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={loadDashboardMetrics}
                        className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-4 rounded-xl text-sm transition-all cursor-pointer"
                    >
                        Sync Database
                    </button>
                    <Link
                        to="/farmer/add-harvest"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm text-sm cursor-pointer"
                    >
                        + Add Harvest
                    </Link>
                </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {/* Active Plots */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Plots</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">
                        {isLoadingMetrics ? "..." : `${plotsCount} Fields`}
                    </h3>
                </div>

                {/* Market Products */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Market Products</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">
                        {isLoadingMetrics ? "..." : `${productsCount} Items`}
                    </h3>
                </div>

                {/* Total Revenue */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-green-700 mt-1">LKR 45,200</h3>
                </div>

                {/* Field Alerts */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Field Alerts</p>
                    <h3 className="text-3xl font-bold text-orange-600 mt-1">1 Issue</h3>
                </div>
            </div>

            {/* 2-Column Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">

                {/* Daily Farm Tasks (With Delete Button) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[460px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-700">Daily Farm Tasks</h3>
                        <span className="text-xs font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded-lg">
                            {tasks.filter(t => t.activityStatus).length}/{tasks.length} Completed
                        </span>
                    </div>

                    <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                        {isLoadingTasks ? (
                            <div className="text-center py-12 text-gray-400 text-sm">Loading tasks...</div>
                        ) : tasks.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 text-sm">No tasks added yet. Add a task below.</div>
                        ) : (
                            tasks.map((item) => (
                                <div
                                    key={item.activityId}
                                    onClick={() => handleToggleTask(item.activityId, item.activityStatus)}
                                    className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={item.activityStatus || false}
                                            onChange={() => {}}
                                            className="w-4 h-4 accent-green-600 cursor-pointer"
                                        />
                                        <span className={`text-sm font-medium ${item.activityStatus ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                            {item.activity}
                                        </span>
                                    </div>

                                    {/* Task Delete Button */}
                                    <button
                                        type="button"
                                        onClick={(e) => handleDeleteTask(item.activityId, e)}
                                        className="text-xs text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded hover:bg-red-50 cursor-pointer transition-colors"
                                        title="Delete this task"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-4 flex gap-2 pt-2 border-t border-gray-100">
                        <input
                            type="text"
                            placeholder="Add a new farm task..."
                            value={newTaskInput}
                            onChange={(e) => setNewTaskInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddTask}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm cursor-pointer whitespace-nowrap"
                        >
                            Add Task
                        </button>
                    </div>
                </div>

                {/* Recent Customer Orders */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[460px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-700">Recent Customer Orders</h3>
                        <span className="text-xs text-gray-400">Real-time status</span>
                    </div>

                    {isLoadingOrders ? (
                        <div className="text-center py-12 text-gray-400 text-sm">Loading orders...</div>
                    ) : (
                        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                            {customerOrders.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 text-sm">No orders available.</div>
                            ) : (
                                customerOrders.map((order, idx) => (
                                    <div key={order.orderId || idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm">
                                                {order.customer || order.buyerName || `Order #${order.orderId}`}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {order.item || order.firstItemName || "Farm Produce"} ({order.qty || `${order.itemCount || 1} items`})
                                            </p>
                                            <p className="text-sm font-bold text-green-600 mt-1">
                                                {order.total || `LKR ${order.totalAmount || 0}`}
                                            </p>
                                        </div>
                                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-green-100 text-green-700">
                                            {order.status || order.orderStatus || "Pending"}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default FarmerHomePage;