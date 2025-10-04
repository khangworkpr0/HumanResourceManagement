import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees');
      setEmployees(response.data.data);
    } catch (error) {
      setError('Failed to fetch employees');
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`/api/employees/${id}`);
        setEmployees(employees.filter(emp => emp._id !== id));
      } catch (error) {
        alert('Failed to delete employee');
        console.error('Error deleting employee:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '2rem' }}>
        Loading employees...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Employees</h1>
        <Link to="/employees/new" className="btn btn-primary">
          Add New Employee
        </Link>
      </div>

      {employees.length === 0 ? (
        <div className="card">
          <p className="text-center">No employees found.</p>
        </div>
      ) : (
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Department</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Position</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>{employee.name}</td>
                  <td style={{ padding: '1rem' }}>{employee.email}</td>
                  <td style={{ padding: '1rem' }}>{employee.department}</td>
                  <td style={{ padding: '1rem' }}>{employee.position}</td>
                  <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{employee.role}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: employee.isActive ? '#d4edda' : '#f8d7da',
                      color: employee.isActive ? '#155724' : '#721c24'
                    }}>
                      {employee.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link
                        to={`/employees/edit/${employee._id}`}
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(employee._id)}
                        className="btn btn-danger"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
