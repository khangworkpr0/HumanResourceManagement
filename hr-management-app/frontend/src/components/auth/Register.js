import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    position: '',
    phone: '',
    address: '',
    salary: ''
  });
  const { register, isAuthenticated, error, clearErrors } = useAuth();
  const navigate = useNavigate();

  const {
    name,
    email,
    password,
    confirmPassword,
    department,
    position,
    phone,
    address,
    salary
  } = formData;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp');
      return;
    }

    const result = await register(formData);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '700px' }}>
        <h2 className="auth-title">Tạo Tài Khoản</h2>
        <p className="auth-subtitle">Tham gia hệ thống quản lý nhân sự ngay hôm nay</p>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Họ và Tên</label>
              <input
                type="text"
                className="form-input"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Địa Chỉ Email</label>
              <input
                type="email"
                className="form-input"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="password">Mật Khẩu</label>
              <input
                type="password"
                className="form-input"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Create a password"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Xác Nhận Mật Khẩu</label>
              <input
                type="password"
                className="form-input"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="department">Phòng Ban</label>
              <input
                type="text"
                className="form-input"
                id="department"
                name="department"
                value={department}
                onChange={onChange}
                placeholder="e.g., Engineering, Marketing"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="position">Chức Vụ</label>
              <input
                type="text"
                className="form-input"
                id="position"
                name="position"
                value={position}
                onChange={onChange}
                placeholder="e.g., Software Developer, Manager"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Số Điện Thoại</label>
              <input
                type="tel"
                className="form-input"
                id="phone"
                name="phone"
                value={phone}
                onChange={onChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="salary">Lương</label>
              <input
                type="number"
                className="form-input"
                id="salary"
                name="salary"
                value={salary}
                onChange={onChange}
                placeholder="Enter your salary"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address">Địa Chỉ</label>
            <textarea
              className="form-input"
              id="address"
              name="address"
              value={address}
              onChange={onChange}
              rows="3"
              placeholder="Enter your address"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Tạo Tài Khoản
          </button>
        </form>

        <p className="text-center mt-20">
          Đã có tài khoản? <Link to="/login" className="auth-link">Đăng nhập tại đây</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
