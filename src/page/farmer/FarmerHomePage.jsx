import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShoppingBag, DollarSign, AlertTriangle, Plus, Calendar, CheckCircle2, Circle, Activity, Clock, Truck, CheckCircle } from 'lucide-react';

function FarmerHomePage() {
    const [tasks, setTasks] = useState([
        { id: 1, task: "Apply organic fertilizer to Papaya plot", done: false },
        { id: 2, task: "Check soil moisture in Carrot field", done: true },
        { id: 3, task: "Update marketplace stock quantities", done: false }
    ]);
    const [newTaskInput, setNewTaskInput] = useState("");

    // NEW WIDGET: Customer Orders Array
    const customerOrders = [
        { id: "ORD-001", customer: "Kamal Perera", item: "Organic Carrots", qty: "5 kg", total: "900 LKR", status: "Pending" },
        { id: "ORD-002", customer: "Nimali Silva", item: "Red Lady Papaya", qty: "10 items", total: "2200 LKR", status: "Shipped" },
        { id: "ORD-003", customer: "Sunil Shantha", item: "Keeri Samba", qty: "20 kg", total: "4800 LKR", status: "Delivered" },
        { id: "ORD-004", customer: "Amara Bandara", item: "Big Onions", qty: "2 kg", total: "640 LKR", status: "Pending" }
    ];

    let totalPlots = 3;
    let totalEarnings = "45,200";
    let activeProducts = 3;
    let alertCount = 1;

    const recentActivities = [
        { id: 1, text: "Carrots plot reached Vegetative growth stage", time: "2 hours ago", type: "crop" },
        { id: 2, text: "New product listing 'Red Lady Papaya' published", time: "5 hours ago", type: "sales" },
        { id: 3, text: "Fungal leaf spot warning triggered for Potatoes", time: "Yesterday", type: "alert" }
    ];

    const handleToggleTask = (id) => {
        let updatedTasks = tasks.map((item) => {
            if (item.id === id) return { ...item, done: !item.done };
            return item;
        });
        setTasks(updatedTasks);
    };

    const handleAddTask = () => {
        if (newTaskInput.trim() === "") return;
        setTasks([...tasks, { id: tasks.length + 1, task: newTaskInput, done: false }]);
        setNewTaskInput("");
    };

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back, Farmer!</h1>
                    <p className="text-gray-500 mt-1">Live structural monitoring and harvest listing analytics dashboard.</p>
                </div>
                <Link to="/dashboard/add-harvest" className="bg-[#8dc63f] hover:bg-green-600 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2 text-sm cursor-pointer">
                    <Plus className="w-4 h-4" /> Add Harvest
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Plots</p><h3 className="text-3xl font-bold text-gray-800 mt-1">{totalPlots} Fields</h3></div>
                    <div className="p-3.5 bg-green-50 text-green-600 rounded-xl"><Leaf className="w-6 h-6" /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Market Products</p><h3 className="text-3xl font-bold text-gray-800 mt-1">{activeProducts} Items</h3></div>
                    <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl"><ShoppingBag className="w-6 h-6" /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p><h3 className="text-3xl font-bold text-gray-800 mt-1">LKR {totalEarnings}</h3></div>
                    <div className="p-3.5 bg-[#D2E9C4]/50 text-green-700 rounded-xl"><DollarSign className="w-6 h-6" /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Field Alerts</p><h3 className="text-3xl font-bold text-gray-800 mt-1">{alertCount} Issues</h3></div>
                    <div className={`p-3.5 rounded-xl ${alertCount > 0 ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'}`}><AlertTriangle className="w-6 h-6" /></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[480px]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2"><Calendar className="w-5 h-5 text-[#8dc63f]" /> Daily Farm Tasks</h3>
                    </div>
                    <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                        {tasks.map((item) => (
                            <div key={item.id} onClick={() => handleToggleTask(item.id)} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                                <span className={`text-sm font-medium transition-all ${item.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.task}</span>
                                {item.done ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> : <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                        <input type="text" placeholder="Add a quick farm task..." value={newTaskInput} onChange={(e) => setNewTaskInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); }} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#8dc63f] bg-gray-50" />
                        <button onClick={handleAddTask} className="bg-[#8dc63f] hover:bg-green-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-sm active:scale-95 cursor-pointer">Add</button>
                    </div>
                </div>

                {/* Right Panel: Recent Customer Orders */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[480px]">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-blue-500" /> Recent Customer Orders
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Manage and track items bought by your customers.</p>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                        {customerOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-gray-800 text-sm">{order.customer}</h4>
                                        <span className="text-[10px] bg-gray-200 text-gray-600 font-bold px-2 py-0.5 rounded uppercase">{order.id}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 font-medium mt-1">{order.item} <span className="text-gray-400">({order.qty})</span></p>
                                    <p className="text-sm font-bold text-[#8dc63f] mt-1">{order.total}</p>
                                </div>

                                {/* Status Badge Display */}
                                <div className="text-right flex flex-col items-end">
                                    <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg ${
                                        order.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                'bg-green-100 text-green-700'
                                    }`}>
                                        {order.status === 'Pending' && <Clock className="w-3 h-3" />}
                                        {order.status === 'Shipped' && <Truck className="w-3 h-3" />}
                                        {order.status === 'Delivered' && <CheckCircle className="w-3 h-3" />}
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2"><Activity className="w-5 h-5 text-purple-500" /> Recent Operations Logs</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recentActivities.map((item) => (
                        <div key={item.id} className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className={`p-2 rounded-lg flex-shrink-0 ${item.type === 'crop' ? 'bg-green-50 text-green-600' : item.type === 'sales' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                {item.type === 'crop' && <Leaf className="w-4 h-4" />}
                                {item.type === 'sales' && <ShoppingBag className="w-4 h-4" />}
                                {item.type === 'alert' && <AlertTriangle className="w-4 h-4" />}
                            </div>
                            <div className="flex-1"><p className="text-sm font-semibold text-gray-700 leading-tight">{item.text}</p><span className="text-xs text-gray-400 font-medium mt-1 inline-block">{item.time}</span></div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default FarmerHomePage;