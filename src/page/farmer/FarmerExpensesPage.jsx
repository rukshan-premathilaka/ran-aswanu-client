import React, { useState, useEffect } from 'react';
import ApiService from '@/api/ApiService.js';

const api = new ApiService();

function FarmerExpensesPage() {
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Create Form inputs
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Fertilizer");
    const [amount, setAmount] = useState("");
    const [expenseDate, setExpenseDate] = useState("");

    // Inline Editing states
    const [editingExpenseId, setEditingExpenseId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editCategory, setEditCategory] = useState("Fertilizer");
    const [editAmount, setEditAmount] = useState("");
    const [editExpenseDate, setEditExpenseDate] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    // 1. Load all expenses from Database (GET /api/farmer/expenses)
    const loadExpenses = async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const data = await api.request('GET', '/farmer/expenses');
            if (Array.isArray(data)) {
                setExpenses(data);
            } else {
                setExpenses([]);
            }
        } catch (error) {
            console.error("Failed to load expenses:", error);
            const serverMsg = error.response?.data?.error || "Could not load expenses from database.";
            setErrorMessage(serverMsg);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadExpenses();
    }, []);

    // 2. Add New Expense (POST /api/farmer/expenses)
    const handleAddExpense = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (!title.trim()) {
            setErrorMessage("Expense title is required.");
            return;
        }

        if (Number(amount) <= 0) {
            setErrorMessage("Amount must be greater than 0 LKR.");
            return;
        }

        setIsSaving(true);

        const formattedDate = expenseDate
            ? new Date(expenseDate).toISOString()
            : new Date().toISOString();

        const payload = {
            title: title.trim(),
            category: category,
            amount: Math.round(Number(amount)),
            expenseDate: formattedDate
        };

        try {
            await api.request('POST', '/farmer/expenses', payload);
            setSuccessMessage("Farm expense recorded successfully in Database!");
            setTitle("");
            setAmount("");
            setExpenseDate("");
            await loadExpenses();
        } catch (error) {
            console.error("Add expense error:", error);
            const serverMsg = error.response?.data?.error || error.response?.data?.message || "Failed to save expense.";
            setErrorMessage(serverMsg);
        } finally {
            setIsSaving(false);
        }
    };

    // 3. Start Edit Mode
    const handleStartEdit = (item) => {
        setEditingExpenseId(item.expenseId);
        setEditTitle(item.title || "");
        setEditCategory(item.category || "Fertilizer");
        setEditAmount(item.amount || "");
        setEditExpenseDate(item.expenseDate ? item.expenseDate.substring(0, 10) : "");
        setSuccessMessage("");
        setErrorMessage("");
    };

    const handleCancelEdit = () => {
        setEditingExpenseId(null);
    };

    // 4. Save Edited Expense (PUT /api/farmer/expenses/{id})
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (!editTitle.trim()) {
            setErrorMessage("Expense title is required.");
            return;
        }

        if (Number(editAmount) <= 0) {
            setErrorMessage("Amount must be greater than 0 LKR.");
            return;
        }

        setIsUpdating(true);

        const formattedDate = editExpenseDate
            ? new Date(editExpenseDate).toISOString()
            : new Date().toISOString();

        const payload = {
            title: editTitle.trim(),
            category: editCategory,
            amount: Math.round(Number(editAmount)),
            expenseDate: formattedDate
        };

        try {
            await api.request('PUT', `/farmer/expenses/${editingExpenseId}`, payload);
            setSuccessMessage("Expense details updated successfully in Database!");
            setEditingExpenseId(null);
            await loadExpenses();
        } catch (error) {
            console.error("Update expense error:", error);
            const serverMsg = error.response?.data?.error || "Failed to update expense details.";
            setErrorMessage(serverMsg);
        } finally {
            setIsUpdating(false);
        }
    };

    // 5. Delete Expense (DELETE /api/farmer/expenses/{id})
    const handleDeleteExpense = async (expenseId) => {
        if (!window.confirm("Are you sure you want to delete this expense record from Database?")) {
            return;
        }

        setSuccessMessage("");
        setErrorMessage("");

        try {
            await api.request('DELETE', `/farmer/expenses/${expenseId}`);
            setSuccessMessage("Expense record deleted from Database successfully!");
            await loadExpenses();
        } catch (error) {
            console.error("Delete expense error:", error);
            const serverMsg = error.response?.data?.error || "Failed to delete expense record.";
            setErrorMessage(serverMsg);
        }
    };

    // Total expense sum calculation
    const totalExpenseAmount = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    return (
        <div className="w-full h-full font-sans max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Farm Expenses Tracker</h1>
                    <p className="text-sm text-gray-500 mt-1">Track financial investments, edit entries, and monitor expenses.</p>
                </div>
                <button
                    onClick={loadExpenses}
                    className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-xl text-sm transition-all cursor-pointer"
                >
                    Refresh Records
                </button>
            </div>

            {/* Notification Messages */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold">
                    {errorMessage}
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Farm Expenses</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-red-600 mt-1">
                        LKR {totalExpenseAmount.toLocaleString()}
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recorded Entries</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">
                        {expenses.length} Records
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Financial Status</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-green-700 mt-1">
                        Database Live
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Form: Add New Expense */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                        Record New Expense
                    </h3>

                    <form onSubmit={handleAddExpense} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Expense Title</label>
                            <input
                                type="text"
                                required
                                maxLength={50}
                                placeholder="e.g., Organic Urea Fertilizer"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600 cursor-pointer"
                            >
                                <option value="Fertilizer">Fertilizer & Chemicals</option>
                                <option value="Seeds">Seeds & Seedlings</option>
                                <option value="Labor">Hired Farm Labor</option>
                                <option value="Equipment">Tractor & Equipment</option>
                                <option value="Fuel">Fuel & Electricity</option>
                                <option value="Livestock Feed">Livestock Feed & Medicine</option>
                                <option value="Maintenance">Water & Irrigation</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Amount (LKR)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                placeholder="e.g., 4500"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Date of Expense</label>
                            <input
                                type="date"
                                required
                                value={expenseDate}
                                onChange={(e) => setExpenseDate(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-green-600 cursor-pointer"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl shadow-sm text-sm cursor-pointer transition-all active:scale-95 disabled:opacity-50 mt-2"
                        >
                            {isSaving ? "Saving to Database..." : "Save Expense"}
                        </button>
                    </form>
                </div>

                {/* Right List: Expenses with Inline Edit & Delete */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                        Expense Logs ({expenses.length})
                    </h3>

                    {isLoading ? (
                        <div className="text-center py-12 text-gray-400 text-sm">Loading expense history from database...</div>
                    ) : expenses.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 text-sm">
                            No expense entries recorded yet. Add your first expense on the left form.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {expenses.map((item, idx) => {
                                const id = item.expenseId || idx;
                                const isEditing = editingExpenseId === id;

                                return (
                                    <div
                                        key={id}
                                        className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                                    >
                                        {isEditing ? (
                                            /* Inline Edit Form */
                                            <form onSubmit={handleSaveEdit} className="space-y-3">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-600 block mb-1">Title</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            maxLength={50}
                                                            value={editTitle}
                                                            onChange={(e) => setEditTitle(e.target.value)}
                                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-600 block mb-1">Category</label>
                                                        <select
                                                            value={editCategory}
                                                            onChange={(e) => setEditCategory(e.target.value)}
                                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer"
                                                        >
                                                            <option value="Fertilizer">Fertilizer & Chemicals</option>
                                                            <option value="Seeds">Seeds & Seedlings</option>
                                                            <option value="Labor">Hired Farm Labor</option>
                                                            <option value="Equipment">Tractor & Equipment</option>
                                                            <option value="Fuel">Fuel & Electricity</option>
                                                            <option value="Livestock Feed">Livestock Feed & Medicine</option>
                                                            <option value="Maintenance">Water & Irrigation</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-600 block mb-1">Amount (LKR)</label>
                                                        <input
                                                            type="number"
                                                            required
                                                            min="1"
                                                            value={editAmount}
                                                            onChange={(e) => setEditAmount(e.target.value)}
                                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-600 block mb-1">Date</label>
                                                        <input
                                                            type="date"
                                                            required
                                                            value={editExpenseDate}
                                                            onChange={(e) => setEditExpenseDate(e.target.value)}
                                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        type="submit"
                                                        disabled={isUpdating}
                                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-4 rounded-lg text-xs cursor-pointer disabled:opacity-50"
                                                    >
                                                        {isUpdating ? "Saving..." : "Save Updates"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleCancelEdit}
                                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1.5 px-4 rounded-lg text-xs cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            /* Normal View with Edit & Delete Buttons */
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-gray-800 text-base">{item.title}</h4>
                                                        <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Date: {item.expenseDate ? item.expenseDate.substring(0, 10) : "Recorded"}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className="text-base font-bold text-red-600">
                                                        - LKR {Number(item.amount || 0).toLocaleString()}
                                                    </span>

                                                    {/* Edit Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStartEdit(item)}
                                                        className="text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>

                                                    {/* Delete Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteExpense(item.expenseId)}
                                                        className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition-colors cursor-pointer"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        )}
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

export default FarmerExpensesPage;