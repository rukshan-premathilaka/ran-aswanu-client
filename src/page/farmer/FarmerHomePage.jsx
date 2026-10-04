import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

function FarmerHomePage() {
    // 1. Dashboard Metrics
    const [metrics, setMetrics] = useState({ plots: null, products: null, expenses: null });
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);

    // 2. Daily Farm Tasks
    const [tasks, setTasks] = useState([]);
    const [newTaskInput, setNewTaskInput] = useState("");
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);
    const [tasksError, setTasksError] = useState("");

    // 3. Customer Orders
    const [customerOrders, setCustomerOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [ordersError, setOrdersError] = useState("");
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [actionMessage, setActionMessage] = useState({ type: "", text: "" });

    // 1. Load Live Metrics (Crops, Products, & Expenses)
    const loadDashboardMetrics = async () => {
        setIsLoadingMetrics(true);
        const [cropsRes, productsRes, expensesRes] = await Promise.allSettled([
            api.request('GET', '/farmer/crops'),
            api.request('GET', '/farmer/products'),
            api.request('GET', '/farmer/expenses'),
        ]);

        const extractList = (res) => {
            if (res.status !== 'fulfilled') return null;
            const data = res.value;
            if (Array.isArray(data)) return data;
            if (data && Array.isArray(data.content)) return data.content;
            return null;
        };

        const cropsList = extractList(cropsRes);
        const productsList = extractList(productsRes);
        const expensesList = extractList(expensesRes);

        setMetrics({
            plots: cropsList ? cropsList.length : null,
            products: productsList ? productsList.length : null,
            expenses: expensesList ? expensesList.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) : null
        });

        setIsLoadingMetrics(false);
    };

    // 2. Load Daily Farm Tasks
    const loadTasks = async () => {
        setIsLoadingTasks(true);
        setTasksError("");
        try {
            const data = await api.request('GET', '/farmer/activities');
            setTasks(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load tasks:", err);
            setTasks([]);
            setTasksError("Could not load tasks from database.");
        } finally {
            setIsLoadingTasks(false);
        }
    };

    // 3. Load Customer Orders
    const loadOrders = async () => {
        setIsLoadingOrders(true);
        setOrdersError("");
        try {
            const data = await api.request('GET', '/farmer/orders');
            setCustomerOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load farmer orders:", err);
            setCustomerOrders([]);
            setOrdersError("Could not load customer orders from database.");
        } finally {
            setIsLoadingOrders(false);
        }
    };

    useEffect(() => {
        loadDashboardMetrics();
        loadTasks();
        loadOrders();
    }, []);

    // 4. Update Order Status
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        setUpdatingOrderId(orderId);
        setActionMessage({ type: "", text: "" });

        try {
            await api.request('PATCH', `/farmer/orders/${orderId}/status`, { status: newStatus });
            setActionMessage({ type: "success", text: `Order #${orderId} marked as ${newStatus}!` });
            await loadOrders();
        } catch (err) {
            console.error("Failed to update order status:", err);
            const serverMsg = err.response?.data?.message || err.response?.data?.error || "Please check backend connection.";
            setActionMessage({ type: "error", text: `Failed to update order #${orderId}. ${serverMsg}` });
        } finally {
            setUpdatingOrderId(null);
        }
    };

    // Task Actions
    const handleAddTask = async () => {
        if (!newTaskInput.trim()) return;
        setTasksError("");
        const payload = { activity: newTaskInput.trim() };
        try {
            const saved = await api.request('POST', '/farmer/activities', payload);
            if (saved && saved.activityId) {
                setTasks(prev => [...prev, saved]);
            } else {
                await loadTasks();
            }
            setNewTaskInput("");
        } catch (err) {
            console.error("Failed to add task:", err);
            setTasksError("Failed to add task. Please try again.");
        }
    };

    const handleDeleteTask = async (activityId, e) => {
        e.stopPropagation();
        setTasksError("");
        try {
            await api.request('DELETE', `/farmer/activities/${activityId}`);
            setTasks(prev => prev.filter(t => t.activityId !== activityId));
        } catch (err) {
            console.error("Failed to delete task:", err);
            setTasksError("Failed to delete task from database.");
        }
    };

    const handleToggleTask = async (activityId, currentStatus) => {
        const newStatus = !currentStatus;
        setTasksError("");
        try {
            await api.request('PATCH', `/farmer/activities/${activityId}/status`, { done: newStatus });
            setTasks(prev => prev.map(t => t.activityId === activityId ? { ...t, activityStatus: newStatus } : t));
        } catch (err) {
            console.error("Failed to update task status:", err);
            setTasksError("Failed to update task status.");
        }
    };

    const formatMetric = (val, suffix = "") => {
        if (val === null) return "—";
        return `${val.toLocaleString()} ${suffix}`;
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            {/* Top Bar with Home and Add Harvest Buttons (Sync Dashboard removed) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-sm text-gray-500 mt-1">Live monitoring, orders tracking, and central farm analytics.</p>
                </div>
                <div className="flex gap-3">
                    {/* Home Page Link Button */}
                    <Link
                        to="/home"
                        className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-5 rounded-xl text-sm transition-all cursor-pointer shadow-sm"
                    >
                        Home
                    </Link>
                    <Link
                        to="/farmer/add-harvest"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm text-sm cursor-pointer"
                    >
                        + Add Harvest
                    </Link>
                </div>
            </div>

            {/* Notification alert for Order action */}
            {actionMessage.text && (
                <div className={`mb-6 p-3 rounded-xl text-sm font-semibold border ${
                    actionMessage.type === "success"
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-red-50 border-red-200 text-red-700"
                }`}>
                    {actionMessage.text}
                </div>
            )}

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Plots</p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                        {isLoadingMetrics ? "..." : formatMetric(metrics.plots, "Fields")}
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Market Products</p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                        {isLoadingMetrics ? "..." : formatMetric(metrics.products, "Items")}
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Expenses</p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-red-600 mt-1">
                        {isLoadingMetrics ? "..." : (metrics.expenses !== null ? `LKR ${metrics.expenses.toLocaleString()}` : "—")}
                    </h3>
                </div>
            </div>

            {/* 2-Column Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">

                {/* 1. Daily Farm Tasks */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[520px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-700">Daily Farm Tasks</h3>
                        <span className="text-xs font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded-lg">
                            {tasks.filter(t => t.activityStatus).length}/{tasks.length} Completed
                        </span>
                    </div>

                    {tasksError && (
                        <div className="mb-3 text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                            {tasksError}
                        </div>
                    )}

                    <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                        {isLoadingTasks ? (
                            <div className="text-center py-12 text-gray-400 text-sm">Loading tasks...</div>
                        ) : tasks.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 text-sm">No tasks recorded in database.</div>
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
                                    <button
                                        type="button"
                                        onClick={(e) => handleDeleteTask(item.activityId, e)}
                                        className="text-xs text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded hover:bg-red-50 cursor-pointer transition-colors"
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

                {/* 2. Customer Orders */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[520px]">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-700">Recent Customer Orders</h3>
                            <p className="text-xs text-gray-400">Track delivery handover and cash collection status</p>
                        </div>
                        <button
                            onClick={loadOrders}
                            className="text-xs text-green-700 font-bold hover:underline cursor-pointer"
                        >
                            Refresh
                        </button>
                    </div>

                    {isLoadingOrders ? (
                        <div className="text-center py-12 text-gray-400 text-sm">Loading orders from database...</div>
                    ) : ordersError ? (
                        <div className="text-center py-12 flex flex-col items-center">
                            <p className="text-sm text-red-600 mb-3">{ordersError}</p>
                            <button
                                onClick={loadOrders}
                                className="text-xs font-bold bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                            >
                                Retry
                            </button>
                        </div>
                    ) : customerOrders.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 text-sm">No incoming customer orders found.</div>
                    ) : (
                        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                            {customerOrders.map((order, idx) => {
                                const orderId = order.orderId || idx + 1;
                                const status = (order.orderStatus || order.status || "PENDING").toUpperCase();
                                const isBusy = updatingOrderId === orderId;

                                return (
                                    <div key={orderId} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                                        #{orderId}
                                                    </span>
                                                    <h4 className="font-bold text-gray-800 text-sm">
                                                        {order.buyer?.username || order.buyerName || order.customer || "Buyer"}
                                                    </h4>
                                                </div>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    Item: <span className="font-semibold text-gray-800">{order.firstItemName || order.item || "Farm Produce"}</span>
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    Address: {order.deliveryAddress || "Not provided"}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <span className="text-sm font-bold text-green-700 block">
                                                    LKR {Number(order.totalAmount || 0).toLocaleString()}
                                                </span>
                                                <span className="text-[10px] font-medium text-gray-500 block mt-0.5">
                                                    Payment: {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery (COD)' : (order.paymentMethod || 'Unknown')}
                                                    {order.paymentStatus ? ` · ${order.paymentStatus}` : ''}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Badge & Action Controls */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200/60">
                                            <div>
                                                {status === 'PENDING' && (
                                                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-yellow-100 text-yellow-800">
                                                        Pending Farmer Acceptance
                                                    </span>
                                                )}
                                                {status === 'ACCEPTED' && (
                                                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800">
                                                        Accepted (Preparing Harvest)
                                                    </span>
                                                )}
                                                {status === 'SHIPPED' && (
                                                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800">
                                                        Handed to Delivery
                                                    </span>
                                                )}
                                                {status === 'COMPLETED' && (
                                                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-green-100 text-green-800">
                                                        Delivered & Paid
                                                    </span>
                                                )}
                                                {status === 'REJECTED' && (
                                                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-red-100 text-red-700">
                                                        Order Cancelled / Rejected
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                {status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            disabled={isBusy}
                                                            onClick={() => handleUpdateOrderStatus(orderId, 'ACCEPTED')}
                                                            className="text-xs font-bold bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                                                        >
                                                            Accept Order
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={isBusy}
                                                            onClick={() => handleUpdateOrderStatus(orderId, 'REJECTED')}
                                                            className="text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}

                                                {status === 'ACCEPTED' && (
                                                    <button
                                                        type="button"
                                                        disabled={isBusy}
                                                        onClick={() => handleUpdateOrderStatus(orderId, 'SHIPPED')}
                                                        className="text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                                                    >
                                                        Hand over to Delivery
                                                    </button>
                                                )}

                                                {status === 'SHIPPED' && (
                                                    <button
                                                        type="button"
                                                        disabled={isBusy}
                                                        onClick={() => handleUpdateOrderStatus(orderId, 'COMPLETED')}
                                                        className="text-xs font-bold bg-green-700 hover:bg-green-800 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                                                    >
                                                        Mark Delivered & Paid
                                                    </button>
                                                )}

                                                {status === 'COMPLETED' && (
                                                    <span className="text-xs font-bold text-green-700">
                                                        Payment Settled
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default FarmerHomePage;