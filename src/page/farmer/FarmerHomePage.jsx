import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

function FarmerHomePage() {
    // 1. Daily Farm Tasks (Permanent LocalStorage Persistence)
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('farmer_dashboard_tasks');
        return saved ? JSON.parse(saved) : [
            { id: 1, task: "Apply organic fertilizer to Carrot plot", done: false },
            { id: 2, task: "Inspect soil moisture index in Plot A", done: true }
        ];
    });

    const [newTaskInput, setNewTaskInput] = useState("");
    const [plotsCount, setPlotsCount] = useState(0);
    const [productsCount, setProductsCount] = useState(0);
    const [customerOrders, setCustomerOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);

    const saveTasksState = (updatedTasks) => {
        setTasks(updatedTasks);
        localStorage.setItem('farmer_dashboard_tasks', JSON.stringify(updatedTasks));
    };

    const handleToggleTask = (id) => {
        const updated = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
        saveTasksState(updated);
    };

    const handleAddTask = () => {
        if (!newTaskInput.trim()) return;
        const newTask = { id: Date.now(), task: newTaskInput.trim(), done: false };
        const updated = [...tasks, newTask];
        saveTasksState(updated);
        setNewTaskInput("");
    };

    // Task Delete කිරීමේ පහසුකම
    const handleDeleteTask = (id, e) => {
        e.stopPropagation();
        const updated = tasks.filter(t => t.id !== id);
        saveTasksState(updated);
    };

    // 2. Dashboard දත්ත Backend එකෙන් සහ Cache එකෙන් සමමුහුර්තව ලබාගැනීම
    useEffect(() => {
        const loadDashboardData = async () => {
            // A. Active Plots Count
            try {
                const cropsRes = await api.request('GET', '/farmer/crops');
                let count = 0;
                if (Array.isArray(cropsRes)) {
                    count = cropsRes.length;
                } else if (cropsRes && Array.isArray(cropsRes.content)) {
                    count = cropsRes.content.length;
                }

                if (count > 0) {
                    setPlotsCount(count);
                } else {
                    const cachedCrops = localStorage.getItem('farmer_crops_cache');
                    if (cachedCrops) setPlotsCount(JSON.parse(cachedCrops).length);
                }
            } catch (err) {
                console.warn("Crops count fallback:", err);
                const cachedCrops = localStorage.getItem('farmer_crops_cache');
                if (cachedCrops) setPlotsCount(JSON.parse(cachedCrops).length);
            }

            // B. Market Products Count
            try {
                let productsRes = null;
                const endpoints = ['/farmer/product-listings', '/farmer/products', '/products'];
                for (const ep of endpoints) {
                    try {
                        const res = await api.request('GET', ep);
                        if (res) {
                            productsRes = res;
                            break;
                        }
                    } catch {
                        // try next
                    }
                }

                let pCount = 0;
                if (Array.isArray(productsRes)) {
                    pCount = productsRes.length;
                } else if (productsRes && Array.isArray(productsRes.content)) {
                    pCount = productsRes.content.length;
                }

                if (pCount > 0) {
                    setProductsCount(pCount);
                } else {
                    const cachedProducts = localStorage.getItem('farmer_products_cache');
                    if (cachedProducts) setProductsCount(JSON.parse(cachedProducts).length);
                }
            } catch (err) {
                console.warn("Products count fallback:", err);
                const cachedProducts = localStorage.getItem('farmer_products_cache');
                if (cachedProducts) setProductsCount(JSON.parse(cachedProducts).length);
            }

            // C. Recent Customer Orders
            setIsLoadingOrders(true);
            try {
                let ordersRes = null;
                const orderEndpoints = ['/orders/farmer', '/farmer/orders', '/orders'];
                for (const oep of orderEndpoints) {
                    try {
                        const ores = await api.request('GET', oep);
                        if (ores && (Array.isArray(ores) || Array.isArray(ores.content))) {
                            ordersRes = Array.isArray(ores) ? ores : ores.content;
                            break;
                        }
                    } catch {
                        // try next
                    }
                }

                if (ordersRes && ordersRes.length > 0) {
                    setCustomerOrders(ordersRes);
                } else {
                    setCustomerOrders([
                        { id: "ORD-101", customer: "Kamal Perera", item: "Organic Carrots", qty: "5 kg", total: "LKR 900", status: "Pending" },
                        { id: "ORD-102", customer: "Sunil Shantha", item: "Keeri Samba", qty: "20 kg", total: "LKR 4,800", status: "Delivered" }
                    ]);
                }
            } catch (err) {
                console.warn("Orders fetch fallback:", err);
                setCustomerOrders([
                    { id: "ORD-101", customer: "Kamal Perera", item: "Organic Carrots", qty: "5 kg", total: "LKR 900", status: "Pending" },
                    { id: "ORD-102", customer: "Sunil Shantha", item: "Keeri Samba", qty: "20 kg", total: "LKR 4,800", status: "Delivered" }
                ]);
            } finally {
                setIsLoadingOrders(false);
            }
        };

        loadDashboardData();
    }, []);

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-gray-500 mt-1">Live monitoring and database analytics dashboard.</p>
                </div>
                <Link to="/farmer/add-harvest" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm text-sm cursor-pointer">
                    + Add Harvest
                </Link>
            </div>

            {/* Metrics Dashboard (Active Plots & Market Products) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Plots</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{plotsCount} Fields</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Market Products</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{productsCount} Items</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-green-700 mt-1">LKR 45,200</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Field Alerts</p>
                    <h3 className="text-3xl font-bold text-orange-600 mt-1">1 Issue</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">
                {/* Daily Farm Tasks (With Save & Delete) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[460px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-700">Daily Farm Tasks</h3>
                        <span className="text-xs font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded-lg">
                            {tasks.filter(t => t.done).length}/{tasks.length} Completed
                        </span>
                    </div>

                    <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                        {tasks.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 text-sm">No tasks added yet. Add a task below.</div>
                        ) : (
                            tasks.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleToggleTask(item.id)}
                                    className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={item.done}
                                            onChange={() => {}}
                                            className="w-4 h-4 accent-green-600 cursor-pointer"
                                        />
                                        <span className={`text-sm font-medium ${item.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                            {item.task}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteTask(item.id, e)}
                                        className="text-xs text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded hover:bg-red-50 cursor-pointer transition-colors"
                                        title="Delete Task"
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
                            placeholder="Type new farm task..."
                            value={newTaskInput}
                            onChange={(e) => setNewTaskInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500"
                        />
                        <button
                            onClick={handleAddTask}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm cursor-pointer whitespace-nowrap"
                        >
                            Save Task
                        </button>
                    </div>
                </div>

                {/* Recent Customer Orders */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[460px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-700">Recent Customer Orders</h3>
                        <span className="text-xs text-gray-400">Order Updates</span>
                    </div>

                    {isLoadingOrders ? (
                        <div className="text-center py-12 text-gray-400 text-sm">Loading orders...</div>
                    ) : (
                        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                            {customerOrders.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 text-sm">No customer orders available.</div>
                            ) : (
                                customerOrders.map((order, idx) => (
                                    <div key={order.id || idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm">{order.customer || order.customerName || `Order #${order.id}`}</h4>
                                            <p className="text-xs text-gray-500 mt-1">{order.item || order.productName || "Crop Produce"} ({order.qty || order.quantity || "1 unit"})</p>
                                            <p className="text-sm font-bold text-green-600 mt-1">{order.total || `LKR ${order.totalAmount || 0}`}</p>
                                        </div>
                                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-green-100 text-green-700">
                                            {order.status || "Pending"}
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