import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

function FarmerHomePage() {
    const [tasks, setTasks] = useState([
        { id: 1, task: "Apply organic fertilizer to Papaya plot", done: false },
        { id: 2, task: "Check soil moisture in Carrot field", done: true }
    ]);
    const [newTaskInput, setNewTaskInput] = useState("");

    const [plotsCount, setPlotsCount] = useState(0);
    const [productsCount, setProductsCount] = useState(0);

    // load real counts from backend
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const cropsData = await api.request('GET', '/farmer/crops');
                if (cropsData && Array.isArray(cropsData)) setPlotsCount(cropsData.length);

                const productsData = await api.request('GET', '/farmer/products');
                if (productsData && Array.isArray(productsData)) setProductsCount(productsData.length);
            } catch (err) {
                console.warn("Backend metrics offline, using defaults:", err);
                setPlotsCount(2);
                setProductsCount(3);
            }
        };

        loadDashboardData();
    }, []);

    const customerOrders = [
        { id: "ORD-001", customer: "Kamal Perera", item: "Organic Carrots", qty: "5 kg", total: "900 LKR", status: "Pending" },
        { id: "ORD-002", customer: "Sunil Shantha", item: "Keeri Samba", qty: "20 kg", total: "4800 LKR", status: "Delivered" }
    ];

    const handleToggleTask = (id) => {
        setTasks(tasks.map(item => item.id === id ? { ...item, done: !item.done } : item));
    };

    const handleAddTask = () => {
        if (!newTaskInput.trim()) return;
        setTasks([...tasks, { id: tasks.length + 1, task: newTaskInput, done: false }]);
        setNewTaskInput("");
    };

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
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[450px]">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Daily Farm Tasks</h3>
                    <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                        {tasks.map((item) => (
                            <div key={item.id} onClick={() => handleToggleTask(item.id)} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer">
                                <span className={`text-sm font-medium ${item.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.task}</span>
                                <input type="checkbox" checked={item.done} readOnly className="w-4 h-4 accent-green-600" />
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                        <input type="text" placeholder="Add task..." value={newTaskInput} onChange={(e) => setNewTaskInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTask()} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm bg-gray-50" />
                        <button onClick={handleAddTask} className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-sm cursor-pointer">Add</button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[450px]">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Recent Customer Orders</h3>
                    <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                        {customerOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">{order.customer}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{order.item} ({order.qty})</p>
                                    <p className="text-sm font-bold text-green-600 mt-1">{order.total}</p>
                                </div>
                                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-green-100 text-green-700">{order.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FarmerHomePage;