import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute.jsx";
import DeliveryRequestPage from "@/page/delivery/DeliveryRequestPage.jsx";
import MatchingDeliveriesPage from "@/page/delivery/MatchingDeliveriesPage.jsx";
import DeliveryTrackingPage from "@/page/delivery/DeliveryTrackingPage.jsx";
import DeliveryVehiclePage from "@/page/delivery/DeliveryVehiclePage.jsx";

export default function DeliveryRoutes() {
    return (
        <Routes>
            <Route index element={<MatchingDeliveriesPage />} />
            <Route path="request" element={<DeliveryRequestPage />} />
            <Route path="matches" element={<MatchingDeliveriesPage />} />
            <Route path="incoming" element={
                <ProtectedRoute requiredRole="TRANSPORT"><MatchingDeliveriesPage /></ProtectedRoute>
            } />
            <Route path="tracking" element={<DeliveryTrackingPage />} />
            <Route path="vehicles" element={
                <ProtectedRoute requiredRole="TRANSPORT"><DeliveryVehiclePage /></ProtectedRoute>
            } />
            <Route path="*" element={<MatchingDeliveriesPage />} />
        </Routes>
    );
}
