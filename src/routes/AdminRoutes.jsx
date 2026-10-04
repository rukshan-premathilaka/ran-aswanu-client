import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AdminGuard from '@/component/admin/AdminGuard.jsx';
import AdminLayout from '@/layouts/AdminLayout.jsx';
import AdminDashboardPage from '@/page/admin/AdminDashboardPage.jsx';
import AdminUsersPage from '@/page/admin/AdminUsersPage.jsx';
import AdminUserDetailPage from '@/page/admin/AdminUserDetailPage.jsx';
import AdminProductsPage from '@/page/admin/AdminProductsPage.jsx';
import AdminProductDetailPage from '@/page/admin/AdminProductDetailPage.jsx';
import AdminSupportPage from '@/page/admin/AdminSupportPage.jsx';
import AdminSupportDetailPage from '@/page/admin/AdminSupportDetailPage.jsx';
import AdminStatisticsPage from '@/page/admin/AdminStatisticsPage.jsx';

// Same pattern as FarmerRoutes.jsx. Everything is behind the admin guard.
function AdminRoutes() {
    return (
        <Routes>
            <Route
                element={
                    <AdminGuard>
                        <AdminLayout />
                    </AdminGuard>
                }
            >
                <Route index element={<AdminDashboardPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="users/:userId" element={<AdminUserDetailPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="products/:listId" element={<AdminProductDetailPage />} />
                <Route path="support" element={<AdminSupportPage />} />
                <Route path="support/:messageId" element={<AdminSupportDetailPage />} />
                <Route path="statistics" element={<AdminStatisticsPage />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
        </Routes>
    );
}

export default AdminRoutes;
