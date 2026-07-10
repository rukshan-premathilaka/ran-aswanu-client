import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Your existing imports
import Login from "@/page/login.jsx";
import Welcome from "@/page/welcome.jsx";
import SignIn from "@/page/signIn.jsx";
import DashboardLayout from "@/layouts/Dashboard.jsx";
import ResetPasswordPage from "@/page/ResetPassword.jsx";

function App() {
  return (
      /*<DashboardLayout/>*/

      <Router>
        <Routes>
          {/* The '/' path is home page */}
          <Route path="/" element={<Welcome/>} />

          {/* Other routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />

          {/* Reset Password Routes */}
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </Router>

  );
}

export default App;