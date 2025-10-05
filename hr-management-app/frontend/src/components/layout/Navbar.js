import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#343a40',
      color: 'white',
      padding: '1rem 0',
      marginBottom: '2rem'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Quản Lý Nhân Sự
        </Link>

        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                Trang Chủ
              </Link>
              <Link to="/employees" style={{ color: 'white', textDecoration: 'none' }}>
                Nhân Viên
              </Link>
              <Link to="/departments" style={{ color: 'white', textDecoration: 'none' }}>
                Phòng Ban
              </Link>
              <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>
                Hồ Sơ
              </Link>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid white',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Đăng Xuất
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Đăng Nhập
            </Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
              Đăng Ký
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
