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
      alert('Passwords do not match');
      return;
    }

    const result = await register(formData);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '2rem' }}>
      <div className="card">
        <h2 className="text-center mb-20">Register</h2>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input
                type="text"
                className="form-input"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                type="email"
                className="form-input"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                className="form-input"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                className="form-input"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="department">Department</label>
              <input
                type="text"
                className="form-input"
                id="department"
                name="department"
                value={department}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="position">Position</label>
              <input
                type="text"
                className="form-input"
                id="position"
                name="position"
                value={position}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone</label>
              <input
                type="tel"
                className="form-input"
                id="phone"
                name="phone"
                value={phone}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="salary">Salary</label>
              <input
                type="number"
                className="form-input"
                id="salary"
                name="salary"
                value={salary}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address">Address</label>
            <textarea
              className="form-input"
              id="address"
              name="address"
              value={address}
              onChange={onChange}
              rows="3"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Register
          </button>
        </form>

        <p className="text-center mt-20">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
