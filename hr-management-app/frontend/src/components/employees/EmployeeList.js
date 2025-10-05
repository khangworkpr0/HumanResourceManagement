import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [searchTerm, departmentFilter, pagination.currentPage]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (departmentFilter) params.append('department', departmentFilter);
      params.append('page', pagination.currentPage);
      params.append('limit', '10');
      
      const response = await api.get(`/api/employees?${params.toString()}`);
      setEmployees(response.data.data);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total,
        hasNextPage: response.data.hasNextPage,
        hasPrevPage: response.data.hasPrevPage
      });
    } catch (error) {
      setError('Failed to fetch employees');
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/api/departments');
      setDepartments(response.data.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/api/employees/${id}`);
        setEmployees(employees.filter(emp => emp._id !== id));
      } catch (error) {
        alert('Failed to delete employee');
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const calculateWorkDuration = (hireDate) => {
    const now = new Date();
    const hire = new Date(hireDate);
    
    // Calculate the difference in years and months
    let years = now.getFullYear() - hire.getFullYear();
    let months = now.getMonth() - hire.getMonth();
    
    // Adjust if the day hasn't occurred yet this month
    if (now.getDate() < hire.getDate()) {
      months--;
    }
    
    // Adjust if months is negative
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // Format the result
    if (years === 0) {
      return `${months} tháng`;
    } else if (months === 0) {
      return `${years} năm`;
    } else {
      return `${years} năm ${months} tháng`;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '2rem' }}>
        Đang tải danh sách nhân viên...
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
        <h1>Nhân Viên</h1>
        <Link to="/employees/new" className="btn btn-primary">
          Thêm Nhân Viên Mới
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label className="form-label" htmlFor="search">Tìm Kiếm Nhân Viên</label>
            <input
              type="text"
              className="form-input"
              id="search"
              placeholder="Tìm theo tên, email, hoặc chức vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label className="form-label" htmlFor="department">Lọc Theo Phòng Ban</label>
            <select
              className="form-input"
              id="department"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">Tất Cả Phòng Ban</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm('');
                setDepartmentFilter('');
              }}
            >
              Xóa Bộ Lọc
            </button>
          </div>
        </div>
      </div>

      {employees.length === 0 ? (
        <div className="card">
          <p className="text-center">Không tìm thấy nhân viên nào.</p>
        </div>
      ) : (
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Tên</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Phòng Ban</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Chức Vụ</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Ngày Vào</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Thời Gian Làm Việc</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>{employee.name}</td>
                  <td style={{ padding: '1rem' }}>{employee.email}</td>
                  <td style={{ padding: '1rem' }}>{employee.department}</td>
                  <td style={{ padding: '1rem' }}>{employee.position}</td>
                  <td style={{ padding: '1rem' }}>{formatDate(employee.hireDate || employee.createdAt)}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2'
                    }}>
                      {calculateWorkDuration(employee.hireDate || employee.createdAt)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleViewEmployee(employee)}
                        className="btn btn-primary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        Xem
                      </button>
                      <Link
                        to={`/employees/edit/${employee._id}`}
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(employee._id)}
                        className="btn btn-danger"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '1rem',
              borderTop: '1px solid #eee'
            }}>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>
                Hiển thị {((pagination.currentPage - 1) * 10) + 1} đến {Math.min(pagination.currentPage * 10, pagination.total)} trong tổng số {pagination.total} nhân viên
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="btn btn-secondary"
                  style={{ 
                    padding: '0.5rem 1rem',
                    opacity: !pagination.hasPrevPage ? 0.5 : 1,
                    cursor: !pagination.hasPrevPage ? 'not-allowed' : 'pointer'
                  }}
                >
                  Trước
                </button>
                
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={page === pagination.currentPage ? 'btn btn-primary' : 'btn btn-secondary'}
                      style={{ 
                        padding: '0.5rem 0.75rem',
                        minWidth: '2.5rem'
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="btn btn-secondary"
                  style={{ 
                    padding: '0.5rem 1rem',
                    opacity: !pagination.hasNextPage ? 0.5 : 1,
                    cursor: !pagination.hasNextPage ? 'not-allowed' : 'pointer'
                  }}
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Employee Detail Modal */}
      {showModal && selectedEmployee && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>

            {/* Employee CV Content */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
              {/* Profile Image */}
              <div style={{ flexShrink: 0 }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '4px solid #e3f2fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5'
                }}>
                  {selectedEmployee.profileImage ? (
                    <img 
                      src={selectedEmployee.profileImage} 
                      alt={selectedEmployee.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ fontSize: '4rem', color: '#ccc' }}>👤</div>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>
                  {selectedEmployee.name}
                </h2>
                <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '1.1rem' }}>
                  {selectedEmployee.position}
                </p>
                <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                  📧 {selectedEmployee.email}
                </p>
                <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                  📞 {selectedEmployee.phone}
                </p>
                <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                  🏢 {selectedEmployee.department}
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <span style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {calculateWorkDuration(selectedEmployee.hireDate || selectedEmployee.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h3 style={{ color: '#1976d2', marginBottom: '1rem' }}>Thông Tin Cá Nhân</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Ngày Vào Làm:</strong><br />
                  <span style={{ color: '#666' }}>
                    {formatDate(selectedEmployee.hireDate || selectedEmployee.createdAt)}
                  </span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Địa Chỉ:</strong><br />
                  <span style={{ color: '#666' }}>
                    {selectedEmployee.address}
                  </span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Lương:</strong><br />
                  <span style={{ color: '#666', fontWeight: 'bold' }}>
                    ${selectedEmployee.salary?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <h3 style={{ color: '#1976d2', marginBottom: '1rem' }}>Thông Tin Công Việc</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Chức Vụ:</strong><br />
                  <span style={{ color: '#666' }}>
                    {selectedEmployee.position}
                  </span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Phòng Ban:</strong><br />
                  <span style={{ color: '#666' }}>
                    {selectedEmployee.department}
                  </span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Vai Trò:</strong><br />
                  <span style={{ 
                    color: '#666', 
                    textTransform: 'capitalize',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: '#f0f0f0'
                  }}>
                    {selectedEmployee.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginTop: '2rem', 
              paddingTop: '1rem', 
              borderTop: '1px solid #eee' 
            }}>
              <Link
                to={`/employees/edit/${selectedEmployee._id}`}
                className="btn btn-primary"
                onClick={closeModal}
              >
                Sửa Thông Tin
              </Link>
              <button
                onClick={closeModal}
                className="btn btn-secondary"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
