import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import FarmerDashboard from '@/layouts/FarmerDashboard.jsx';
import FarmerHomePage from '@/page/farmer/FarmerHomePage.jsx';
import FarmerAddHarvestPage from '@/page/farmer/FarmerAddHarvestPage.jsx';
import FarmerManageHarvestPage from '@/page/farmer/FarmerManageHarvestPage.jsx';
import FarmerCropManagementPage from '@/page/farmer/FarmerCropManagementPage.jsx';
import CalendarPage from '@/page/farmer/FarmerCalenderPage.jsx';
import FarmerWeatherPage from '@/page/farmer/FarmerWeatherPage.jsx';
import FarmerSettingsPage from '@/page/farmer/FarmerSettingsPage.jsx';
import FarmerHelpSupportPage from '@/page/farmer/FarmerHelpSupportPage.jsx';

function FarmerRoutes() {
    return (
        <Routes>
            <Route element={<FarmerDashboard />}>
                <Route index element={<Navigate to="home" replace />} />
                <Route path="home" element={<FarmerHomePage />} />
                <Route path="add-harvest" element={<FarmerAddHarvestPage />} />
                <Route path="manage-harvest" element={<FarmerManageHarvestPage />} />
                <Route path="crop-management" element={<FarmerCropManagementPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="weather" element={<FarmerWeatherPage />} />
                <Route path="settings" element={<FarmerSettingsPage />} />
                <Route path="help" element={<FarmerHelpSupportPage />} />
            </Route>
        </Routes>
    );
}

export default FarmerRoutes;