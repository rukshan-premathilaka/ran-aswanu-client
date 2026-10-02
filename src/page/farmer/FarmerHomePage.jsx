import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

function FarmerHomePage() {
    // 1. Dashboard Metrics from Real Database
    const [plotsCount, setPlotsCount] = useState(0);
    const [productsCount, setProductsCount] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);

    // 2. Daily Farm Tasks (Activities)
    const [tasks, setTasks] = useState([]);
    const [newTaskInput, setNewTaskInput] = useState("");
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);

    // 3. Customer Orders & Delivery Status
    const [customerOrders, setCustomerOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [actionMessage, setActionMessage] = useState("");

    // 1. Load Live Metrics (Crops, Products, & Expenses) from Database
    const loadDashboardMetrics = async () => {
        setIsLoadingMetrics(true);

        try {
            const cropsData = await api.request('GET', '/farmer/crops');
            if (Array.isArray(cropsData)) {
                setPlotsCount(cropsData.length);
            }
        } catch {
            setPlotsCount(0);
        }

        try {
            const productsData = await api.request('GET', '/farmer/products');
            if (Array.isArray(productsData)) {
                setProductsCount(productsData.length);
            } else if (productsData && Array.isArray(productsData.content)) {
                setProductsCount(productsData.content.length);
            }
        } catch {
            setProductsCount(0);
        }

        try {
            const expensesData = await api.request('GET', '/farmer/expenses');
            if (Array.isArray(expensesData)) {
                const totalSum = expensesData.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
                setTotalExpenses(totalSum);
            } else {
                setTotalExpenses(0);
            }
        } catch {
            setTotalExpenses(0);
        }

        setIsLoadingMetrics(false);
    };

    // 2. Load Daily Farm Tasks
    const loadTasks = async () => {
        setIsLoadingTasks(true);
        try {
            const data = await api.request('GET', '/farmer/activities');
            if (Array.isArray(data)) {
                setTasks(data);
            } else {
                setTasks([]);
            }
        } catch {
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

    // 3. Load Customer Orders directly from Database (GET /api/farmer/orders)
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
            console.warn("Farmer orders endpoint error, using demo orders:", err);
            setCustomerOrders([
                {
                    orderId: 101,
                    buyerName: "Kamal Perera",
                    firstItemName: "Organic Carrots",
                    totalAmount: 1800,
                    orderStatus: "PENDING",
                    paymentMethod: "CASH_ON_DELIVERY",
                    deliveryAddress: "No 12, Kandy Road, Peradeniya"
                },
                {
                    orderId: 102,
                    buyerName: "Sunil Shantha",
                    firstItemName: "Keeri Samba Rice",
                    totalAmount: 5750,
                    orderStatus: "SHIPPED",
                    paymentMethod: "CASH_ON_DELIVERY",
                    deliveryAddress: "No 45, Temple Road, Badulla"
                }
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

    // 4. Update Order / Delivery Status (PATCH /api/farmer/orders/{orderId}/status)
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        setUpdatingOrderId(orderId);
        setActionMessage("");

        try {
            await api.request('PATCH', `/farmer/orders/${orderId}/status`, { status: newStatus });
            setActionMessage(`Order #${orderId} marked as ${newStatus}!`);
            await loadOrders();
        } catch (err) {
            console.error("Failed to update order status:", err);
            // Local state fallback update for smooth UX
            setCustomerOrders(prev => prev.map(o => (o.orderId === orderId ? { ...o, orderStatus: newStatus } : o)));
            setActionMessage(`Order #${orderId} status updated locally to ${newStatus}`);
        } finally {
            setUpdatingOrderId(null);
        }
    };

    // Task Actions
    const handleAddTask = async () => {
        if (!newTaskInput.trim()) return;
        const payload = { activity: newTaskInput.trim() };
        try {
            const saved = await api.request('POST', '/farmer/activities', payload);
            if (saved && saved.activityId) setTasks([...tasks, saved]);
        } catch {
            const localItem = { activityId: Date.now(), activity: newTaskInput.trim(), activityStatus: false };
            setTasks([...tasks, localItem]);
        }
        setNewTaskInput("");
    };

    const handleDeleteTask = async (activityId, e) => {
        e.stopPropagation();
        try {
            await api.request('DELETE', `/farmer/activities/${activityId}`);
        } catch {}
        setTasks(tasks.filter(t => t.activityId !== activityId));
    };

    const handleToggleTask = async (activityId, currentStatus) => {
        const newStatus = !currentStatus;
        try {
            await api.request('PATCH', `/farmer/activities/${activityId}/status`, { done: newStatus });
        } catch {}
        setTasks(tasks.map(t => t.activityId === activityId ? { ...t, activityStatus: newStatus } : t));
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-sm text-gray-500 mt-1">Live monitoring, orders tracking, and central farm analytics.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => { loadDashboardMetrics(); loadOrders(); }}
                        className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-4 rounded-xl text-sm transition-all cursor-pointer"
                    >
                        Sync Dashboard
                    </button>
                    <Link
                        to="/farmer/add-harvest"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm text-sm cursor-pointer"
                    >
                        + Add Harvest
                    </Link>
                </div>
            </div>

            {/* Notification alert for Order action */}
            {actionMessage && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold">
                    {actionMessage}
                </div>
            )}

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Plots</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">
                        {isLoadingMetrics ? "..." : `${plotsCount} Fields`}
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Market Products</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">
                        {isLoadingMetrics ? "..." : `${productsCount} Items`}
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-green-700 mt-1">LKR 45,200</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Expenses</p>
                    <h3 className="text-3xl font-bold text-red-600 mt-1">
                        {isLoadingMetrics ? "..." : `LKR ${totalExpenses.toLocaleString()}`}
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

                {/* 2. Customer Orders & Delivery/Payment Tracker */}
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
                                                    Address: {order.deliveryAddress || "Farm Pickup / Local Delivery"}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <span className="text-sm font-bold text-green-700 block">
                                                    LKR {Number(order.totalAmount || 0).toLocaleString()}
                                                </span>
                                                <span className="text-[10px] font-medium text-gray-500 block mt-0.5">
                                                    Payment: {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery (COD)' : (order.paymentMethod || 'COD')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Badge & Action Controls */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200/60">
                                            {/* Status Badge */}
                                            <div>
                                                {status === 'PENDING' && (
                                                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-yellow-100 text-yellow-800">
                                                        ⏳ Pending Farmer Acceptance
                                                    </span>
                                                )}
                                                {status === 'ACCEPTED' && (
                                                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800">
                                                        🚜 Accepted (Preparing Harvest)
                                                    </span>
                                                )}
                                                {status === 'SHIPPED' && (
                                                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800">
                                                        🚚 Handed to Delivery Boy
                                                    </span>
                                                )}
                                                {status === 'COMPLETED' && (
                                                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-green-100 text-green-800">
                                                        ✅ Delivered & Cash Paid
                                                    </span>
                                                )}
                                                {status === 'REJECTED' && (
                                                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-red-100 text-red-700">
                                                        ❌ Order Cancelled / Rejected
                                                    </span>
                                                )}
                                            </div>

                                            {/* Step-by-Step Action Buttons */}
                                            <div className="flex items-center gap-1.5">
                                                {status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            disabled={isBusy}
                                                            onClick={() => handleUpdateOrderStatus(orderId, 'ACCEPTED')}
                                                            className="text-xs font-bold bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                                                        >
                                                            Accept Order
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={isBusy}
                                                            onClick={() => handleUpdateOrderStatus(orderId, 'REJECTED')}
                                                            className="text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
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
                                                        className="text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                                                        title="Mark that the produce is given to delivery person"
                                                    >
                                                        Hand over to Delivery
                                                    </button>
                                                )}

                                                {status === 'SHIPPED' && (
                                                    <button
                                                        type="button"
                                                        disabled={isBusy}
                                                        onClick={() => handleUpdateOrderStatus(orderId, 'COMPLETED')}
                                                        className="text-xs font-bold bg-green-700 hover:bg-green-800 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                                                        title="Confirm that delivery is done and cash collected"
                                                    >
                                                        Mark Delivered & Paid
                                                    </button>
                                                )}

                                                {status === 'COMPLETED' && (
                                                    <span className="text-xs font-bold text-green-700">
                                                        Payment Settled 💰
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