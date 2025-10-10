import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
        api.get('/employees'),
        api.get('/departments')
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

  const handleViewEmployees = () => {
    navigate('/employees');
  };

  const handleViewDepartments = () => {
    navigate('/departments');
  };

  const handleUpdateProfile = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '2rem' }}>
        Đang tải trang chủ...
      </div>
    );
  }

  return (
    <div>
      <h1>Trang Chủ</h1>
      <p>Chào mừng trở lại, {user?.name}!</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginTop: '2rem'
      }}>
        <div className="card">
          <h3>Tổng Nhân Viên</h3>
          <p style={{ fontSize: '2rem', color: '#007bff', margin: '1rem 0' }}>
            {stats.totalEmployees}
          </p>
        </div>

        <div className="card">
          <h3>Nhân Viên Hoạt Động</h3>
          <p style={{ fontSize: '2rem', color: '#28a745', margin: '1rem 0' }}>
            {stats.activeEmployees}
          </p>
        </div>

        <div className="card">
          <h3>Phòng Ban</h3>
          <p style={{ fontSize: '2rem', color: '#ffc107', margin: '1rem 0' }}>
            {stats.totalDepartments}
          </p>
        </div>

        <div className="card">
          <h3>Vai Trò Của Bạn</h3>
          <p style={{ fontSize: '1.5rem', color: '#6c757d', margin: '1rem 0', textTransform: 'capitalize' }}>
            {user?.role}
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Thao Tác Nhanh</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            className="btn btn-primary"
            onClick={handleViewEmployees}
          >
            Xem Nhân Viên
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleViewDepartments}
          >
            Xem Phòng Ban
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleUpdateProfile}
          >
            Cập Nhật Hồ Sơ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
