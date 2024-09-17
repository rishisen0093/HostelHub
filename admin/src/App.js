import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useState } from 'react';
import RefrshHandler from './RefrshHandler';
import Attendance from './pages/Attendance';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import GatePass from './pages/GatePass';
import SideBar from './components/Sidebar/SideBar';
import Announcement from './pages/Announcement';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Routes that require authentication */}
        {isAuthenticated ? (
          <>
            <Route
              path="/dashboard"
              element={
                <SideBar>
                  <Dashboard />
                </SideBar>
              }
            />
            <Route
              path="/attendance"
              element={
                <SideBar>
                  <Attendance />
                </SideBar>
              }
            />
            <Route
              path="/complaints"
              element={
                <SideBar>
                  <Complaints />
                </SideBar>
              }
            />
            <Route
              path="/notice"
              element={
                <SideBar>
                  <Announcement />
                </SideBar>
              }
            />
            <Route
              path="/gate-pass"
              element={
                <SideBar>
                  <GatePass />
                </SideBar>
              }
            />
          </>
        ) : null}

        {/* Catch-all route */}
        <Route path="*" element={<>not found</>} />
      </Routes>
    </div>
  );
}

export default App;
