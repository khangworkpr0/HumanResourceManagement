import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    activeEmployees: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [employeesRes, departmentsRes] = await Promise.all([
        axios.get('/api/employees'),
        axios.get('/api/departments')
      ]);

      const activeEmployees = employeesRes.data.data.filter(emp => emp.isActive).length;

      setStats({
        totalEmployees: employeesRes.data.count,
        totalDepartments: departmentsRes.data.count,
        activeEmployees
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '2rem' }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back, {user?.name}!</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginTop: '2rem'
      }}>
        <div className="card">
          <h3>Total Employees</h3>
          <p style={{ fontSize: '2rem', color: '#007bff', margin: '1rem 0' }}>
            {stats.totalEmployees}
          </p>
        </div>

        <div className="card">
          <h3>Active Employees</h3>
          <p style={{ fontSize: '2rem', color: '#28a745', margin: '1rem 0' }}>
            {stats.activeEmployees}
          </p>
        </div>

        <div className="card">
          <h3>Departments</h3>
          <p style={{ fontSize: '2rem', color: '#ffc107', margin: '1rem 0' }}>
            {stats.totalDepartments}
          </p>
        </div>

        <div className="card">
          <h3>Your Role</h3>
          <p style={{ fontSize: '1.5rem', color: '#6c757d', margin: '1rem 0', textTransform: 'capitalize' }}>
            {user?.role}
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button className="btn btn-primary">
            View Employees
          </button>
          <button className="btn btn-secondary">
            View Departments
          </button>
          <button className="btn btn-secondary">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
