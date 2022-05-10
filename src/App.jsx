import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import React from "react";
import Login from "./pages/Login";
import { auth } from "./firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import Home from "./pages/Home";
import LoadingPage from "./components/LoadingPage";
import UserProvider from "./state/UserProvider";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
//TO DO -> make a global context api to store all the authenticated information
//alogin with users details,etc ..
export default function App() {
  const [user, loading, err] = useAuthState(auth); 
  return (
    <Router>
    
      <UserProvider>
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route
            path="/home"
            element={loading ? <LoadingPage /> : user ? <Home /> : <Navigate to='/login' />}
          />
          <Route path="/login" element={loading ? <LoadingPage/> : !user?<Login /> : <Navigate to='/home'/>} />
          {/* <Route path="/login" element={<Login/>}/> testing purpose */}
          <Route
            path="/profile"
            element={loading ? <LoadingPage /> : user ? <Profile /> : <Navigate to='/login' />}
          />
            <Route
            path="/notification"
            element={loading ? <LoadingPage /> : user ? <Notifications /> : <Navigate to='/login' />}
          />
        </Routes>
      </UserProvider>
    </Router>
  );
}
