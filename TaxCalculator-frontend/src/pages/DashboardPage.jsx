import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import AdminDashboard from '../components/admin/AdminDashboard.jsx';
import UserDashboard from '../components/user/UserDashboard.jsx';

const DashboardPage = () => {
    const { user } = useAuth();

    const isAdmin = user && user.roles && user.roles.includes('ROLE_ADMIN');

    return (
        <div className="dashboard-page">
            {isAdmin ? <AdminDashboard /> : <UserDashboard />}
        </div>
    );
};

export default DashboardPage;