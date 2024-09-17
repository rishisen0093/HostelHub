import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Attendance from './Attendance';
import Complaints from './Complaints';
import GatePass from './GatePass';
import Feedback from './Feedback';
import SideBar from '../components/Sidebar/SideBar';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }

    return (
        <div>
        <SideBar>
        <Routes>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/feedback' element={<Feedback/>}/>
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/gate-pass" element={<GatePass/>} />

        </Routes>
        </SideBar>
        </div>

    )
}

export default Home
