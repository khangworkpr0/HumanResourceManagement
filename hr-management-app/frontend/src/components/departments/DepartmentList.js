import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/departments');
      setDepartments(response.data.data);
    } catch (error) {
      setError('Failed to fetch departments');
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await axios.delete(`/api/departments/${id}`);
        setDepartments(departments.filter(dept => dept._id !== id));
      } catch (error) {
        alert('Failed to delete department');
        console.error('Error deleting department:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '2rem' }}>
        Loading departments...
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
        <h1>Departments</h1>
        <Link to="/departments/new" className="btn btn-primary">
          Add New Department
        </Link>
      </div>

      {departments.length === 0 ? (
        <div className="card">
          <p className="text-center">No departments found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {departments.map((department) => (
            <div key={department._id} className="card">
              <h3>{department.name}</h3>
              <p style={{ color: '#666', marginBottom: '1rem' }}>{department.description}</p>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Manager:</strong> {department.manager?.name || 'Not assigned'}
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Location:</strong> {department.location}
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Budget:</strong> ${department.budget?.toLocaleString()}
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: department.isActive ? '#d4edda' : '#f8d7da',
                  color: department.isActive ? '#155724' : '#721c24'
                }}>
                  {department.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                  to={`/departments/edit/${department._id}`}
                  className="btn btn-secondary"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(department._id)}
                  className="btn btn-danger"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
