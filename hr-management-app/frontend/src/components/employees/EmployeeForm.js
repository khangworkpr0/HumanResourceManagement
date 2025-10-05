import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/axios';

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
    hireDate: ''
  });

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  useEffect(() => {
    fetchDepartments();
    if (isEdit) {
      fetchEmployee();
      fetchFiles();
    }
  }, [id, isEdit]);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/api/departments');
      setDepartments(response.data.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await api.get(`/api/employees/${id}`);
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
        hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : ''
      });
      
      // Set profile image if exists
      if (employee.profileImage) {
        setProfileImagePreview(employee.profileImage);
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      navigate('/employees');
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await api.get(`/api/employees/${id}/files`);
      setFiles(response.data.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
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
        // Update employee first
        await api.put(`/api/employees/${id}`, submitData);
        
        // Then upload profile image if provided
        if (profileImage) {
          const imageFormData = new FormData();
          imageFormData.append('profileImage', profileImage);
          await api.put(`/api/employees/${id}/profile-image`, imageFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      } else {
        // Create employee first
        const response = await api.post('/api/employees', submitData);
        
        // Then upload profile image if provided
        if (profileImage && response.data.data._id) {
          const imageFormData = new FormData();
          imageFormData.append('profileImage', profileImage);
          await api.put(`/api/employees/${response.data.data._id}/profile-image`, imageFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      }

      navigate('/employees');
    } catch (error) {
      alert('Failed to save employee');
      console.error('Error saving employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'personal_info');
      formData.append('description', 'Employee document');

      await api.post(`/api/employees/${id}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Refresh files list
      fetchFiles();
      alert('Tải file lên thành công');
    } catch (error) {
      alert('Không thể tải file lên');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileDownload = async (fileId) => {
    try {
      const response = await api.get(`/api/employees/files/${fileId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', response.headers['content-disposition']?.split('filename=')[1] || 'file');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download file');
      console.error('Error downloading file:', error);
    }
  };

  const handleFileDelete = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await api.delete(`/api/employees/files/${fileId}`);
        fetchFiles();
        alert('File deleted successfully');
      } catch (error) {
        alert('Failed to delete file');
        console.error('Error deleting file:', error);
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', marginTop: '2rem' }}>
      <div className="card">
        <h2>{isEdit ? 'Sửa Nhân Viên' : 'Thêm Nhân Viên Mới'}</h2>

        <form onSubmit={onSubmit}>
          {/* Profile Image Upload */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Ảnh Khuôn Mặt</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '100px', height: '100px', border: '2px dashed #ddd', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {profileImagePreview ? (
                  <img 
                    src={profileImagePreview} 
                    alt="Profile Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: '#666' }}>
                    <div style={{ fontSize: '2rem' }}>📷</div>
                    <div style={{ fontSize: '0.8rem' }}>Chọn ảnh</div>
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  style={{ marginBottom: '0.5rem' }}
                />
                <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>
                  Chọn ảnh khuôn mặt nhân viên (JPG, PNG, GIF)
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Họ và Tên</label>
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
              <label className="form-label" htmlFor="password">Mật Khẩu</label>
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
              <label className="form-label" htmlFor="department">Phòng Ban</label>
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
              <label className="form-label" htmlFor="position">Chức Vụ</label>
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
              <label className="form-label" htmlFor="phone">Số Điện Thoại</label>
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
              <label className="form-label" htmlFor="salary">Lương</label>
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
              <label className="form-label" htmlFor="hireDate">Ngày Vào Làm</label>
              <input
                type="date"
                className="form-input"
                id="hireDate"
                name="hireDate"
                value={formData.hireDate}
                onChange={onChange}
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
              value={formData.address}
              onChange={onChange}
              rows="3"
              required
            />
          </div>

          {/* File Upload Section - Only show for edit mode */}
          {isEdit && (
            <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '1rem' }}>Tài Liệu Nhân Viên</h3>
              
              {/* File Upload */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" htmlFor="fileUpload">Tải File Lên</label>
                <input
                  type="file"
                  className="form-input"
                  id="fileUpload"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
                />
                {uploading && <p style={{ color: '#666', fontSize: '0.9rem' }}>Đang tải lên...</p>}
              </div>

              {/* Files List */}
              {files.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: '0.5rem' }}>Tài Liệu Đã Tải Lên</h4>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {files.map((file) => (
                      <div key={file._id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '0.5rem',
                        border: '1px solid #eee',
                        borderRadius: '4px',
                        marginBottom: '0.5rem'
                      }}>
                        <div>
                          <strong>{file.originalName}</strong>
                          <br />
                          <small style={{ color: '#666' }}>
                            {(file.fileSize / 1024).toFixed(1)} KB • {file.category} • 
                            {new Date(file.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => handleFileDownload(file._id)}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                          >
                            Tải Xuống
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleFileDelete(file._id)}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : (isEdit ? 'Cập Nhật Nhân Viên' : 'Thêm Nhân Viên')}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/employees')}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
