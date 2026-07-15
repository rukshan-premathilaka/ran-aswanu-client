import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/FarmerDashboard.jsx';
import FarmerHomePage from './page/FarmerHomePage.jsx';
import FarmerAddHarvestPage from './page/FarmerAddHarvestPage.jsx';
import FarmerManageHarvestPage from './page/FarmerManageHarvestPage.jsx';
import FarmerCropManagementPage from './page/FarmerCropManagementPage.jsx';
import CalendarPage from "@/page/FarmerCalenderPage.jsx";
import FarmerWeatherPage from './page/FarmerWeatherPage.jsx';
import FarmerSettingsPage from './page/FarmerSettingsPage.jsx'; // New Import
import FarmerHelpSupportPage from './page/FarmerHelpSupportPage.jsx'; // New Import

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<FarmerHomePage />} />
                    <Route path="add-harvest" element={<FarmerAddHarvestPage />} />
                    <Route path="manage-harvest" element={<FarmerManageHarvestPage />} />
                    <Route path="crop-management" element={<FarmerCropManagementPage />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="weather" element={<FarmerWeatherPage />} />

                    {/* New Routes for Settings and Help */}
                    <Route path="settings" element={<FarmerSettingsPage />} />
                    <Route path="help" element={<FarmerHelpSupportPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;