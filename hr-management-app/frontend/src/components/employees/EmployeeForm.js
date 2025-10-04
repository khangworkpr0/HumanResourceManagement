import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    position: '',
    phone: '',
    address: '',
    salary: '',
    role: 'employee',
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments();
    if (isEdit) {
      fetchEmployee();
    }
  }, [id, isEdit]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/departments');
      setDepartments(response.data.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`/api/employees/${id}`);
      const employee = response.data.data;
      setFormData({
        name: employee.name,
        email: employee.email,
        password: '',
        department: employee.department,
        position: employee.position,
        phone: employee.phone,
        address: employee.address,
        salary: employee.salary,
        role: employee.role,
        isActive: employee.isActive
      });
    } catch (error) {
      console.error('Error fetching employee:', error);
      navigate('/employees');
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = { ...formData };
      if (isEdit && !submitData.password) {
        delete submitData.password;
      }

      if (isEdit) {
        await axios.put(`/api/employees/${id}`, submitData);
      } else {
        await axios.post('/api/employees', submitData);
      }

      navigate('/employees');
    } catch (error) {
      alert('Failed to save employee');
      console.error('Error saving employee:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', marginTop: '2rem' }}>
      <div className="card">
        <h2>{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>

        <form onSubmit={onSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input
                type="text"
                className="form-input"
                id="name"
                name="name"
                value={formData.name}
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
                value={formData.email}
                onChange={onChange}
                required
              />
            </div>
          </div>

          {!isEdit && (
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                className="form-input"
                id="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                required={!isEdit}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="department">Department</label>
              <select
                className="form-input"
                id="department"
                name="department"
                value={formData.department}
                onChange={onChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="position">Position</label>
              <input
                type="text"
                className="form-input"
                id="position"
                name="position"
                value={formData.position}
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
                value={formData.phone}
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
                value={formData.salary}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="role">Role</label>
              <select
                className="form-input"
                id="role"
                name="role"
                value={formData.role}
                onChange={onChange}
                required
              >
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="isActive">Status</label>
              <select
                className="form-input"
                id="isActive"
                name="isActive"
                value={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                required
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address">Address</label>
            <textarea
              className="form-input"
              id="address"
              name="address"
              value={formData.address}
              onChange={onChange}
              rows="3"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Employee' : 'Add Employee')}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/employees')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
