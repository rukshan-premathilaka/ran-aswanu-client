import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Your existing imports
import Login from "@/page/login.jsx";
import Welcome from "@/page/welcome.jsx";
import SignIn from "@/page/signIn.jsx";
import DashboardLayout from "@/layouts/Dashboard.jsx";
import ProductClick from "@/page/ProductClick.jsx";

function App() {
  return (
      <ProductClick />

      /*<Router>
        <Routes>
          {/!* The '/' path is home page *!/}
          <Route path="/" element={<Welcome/>} />

          {/!* Other routes *!/}
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </Router>*/

  );
}

export default App;