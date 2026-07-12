import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Your existing imports
import Login from "@/page/login.jsx";
import Welcome from "@/page/welcome.jsx";
import SignIn from "@/page/signIn.jsx";
import ChatPage from "@/page/ChatPage.jsx";
import AuthLayout from "@/layouts/Authlayout.jsx";

function App() {
  return (
      </>
      /*<Router>
        <Routes>
          {/!* The '/' path is home page *!/}
          <Route path="/" element={<Welcome />} />

          {/!* Other routes *!/}
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />


            {/!* The '/' path is home page *!/}
            <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </Router>*/
  );
}

export default App;