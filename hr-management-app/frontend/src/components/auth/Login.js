import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { login, isAuthenticated, error, clearErrors } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

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
    const result = await login(formData);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Chào Mừng Trở Lại</h2>
        <p className="auth-subtitle">Đăng nhập vào tài khoản của bạn để tiếp tục</p>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Địa Chỉ Email</label>
            <input
              type="email"
              className="form-input"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Mật Khẩu</label>
            <input
              type="password"
              className="form-input"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Nhập mật khẩu của bạn"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Đăng Nhập
          </button>
        </form>

        <p className="text-center mt-20">
          Chưa có tài khoản? <Link to="/register" className="auth-link">Tạo tài khoản tại đây</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
