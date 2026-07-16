import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Your existing imports
import Login from "@/page/login.jsx";
import Welcome from "@/page/welcome.jsx";
import SignIn from "@/page/signIn.jsx";
import ProductClick from "@/page/ProductClick.jsx";
import ChatPage from "@/chatPage/ChatPage.jsx";
import MatchingDeliveriesPage from "@/chatPage/MatchingDeliveriesPage.jsx";
import DeliveryRequestPage from "@/chatPage/DeliveryRequestPage.jsx";
import DeliveryTrackingPage from "@/chatPage/DeliveryTrackingPage.jsx";


function App() {
  return (

      <Router>
        <Routes>
          {/* The '/' path is home page */}
          <Route path="/" element={<Welcome />} />

          {/* Other routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
            <Route path="/productclick" element={<ProductClick />} />
            <Route path="/Chat" element={<ChatPage />} />
            <Route path="/MatchineDeliveries" element={<MatchingDeliveriesPage/>} />
            <Route path="/DeliveryRequest" element={<DeliveryRequestPage />} />
            <Route path="/DeliveryTracking" element={<DeliveryTrackingPage/>} />



        </Routes>
      </Router>
  );
}

export default App;