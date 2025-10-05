import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/axios';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    // Thông tin cơ bản
    name: '',
    email: '',
    password: '',
    
    // Thông tin cá nhân
    birthYear: '',
    cccd: '',
    cccdIssueDate: '',
    cccdIssuePlace: '',
    phone: '',
    permanentAddress: '',
    birthPlace: '',
    socialInsuranceNumber: '',
    healthInsuranceNumber: '',
    
    // Thông tin công việc
    department: '',
    position: '',
    educationLevel: '',
    major: '',
    school: '',
    startDate: '',
    officialDate: '',
    contractType: '',
    salary: '',
    allowances: {
      meal: '',
      transport: '',
      additional: '',
      hazardous: ''
    },
    
    // Hồ sơ
    documents: {
      resume: '',
      healthCertificate: '',
      diploma: '',
      professionalCertificate: '',
      practiceScope: ''
    }
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
        // Thông tin cơ bản
        name: employee.name || '',
        email: employee.email || '',
        password: '',
        
        // Thông tin cá nhân
        birthYear: employee.birthYear || '',
        cccd: employee.cccd || '',
        cccdIssueDate: employee.cccdIssueDate ? employee.cccdIssueDate.split('T')[0] : '',
        cccdIssuePlace: employee.cccdIssuePlace || '',
        phone: employee.phone || '',
        permanentAddress: employee.permanentAddress || '',
        birthPlace: employee.birthPlace || '',
        socialInsuranceNumber: employee.socialInsuranceNumber || '',
        healthInsuranceNumber: employee.healthInsuranceNumber || '',
        
        // Thông tin công việc
        department: employee.department || '',
        position: employee.position || '',
        educationLevel: employee.educationLevel || '',
        major: employee.major || '',
        school: employee.school || '',
        startDate: employee.startDate ? employee.startDate.split('T')[0] : '',
        officialDate: employee.officialDate ? employee.officialDate.split('T')[0] : '',
        contractType: employee.contractType || '',
        salary: employee.salary || '',
        allowances: employee.allowances || {
          meal: '',
          transport: '',
          additional: '',
          hazardous: ''
        },
        
        // Hồ sơ
        documents: employee.documents || {
          resume: '',
          healthCertificate: '',
          diploma: '',
          professionalCertificate: '',
          practiceScope: ''
        }
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

  const handleFileUpload = async (e, category) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      await api.post(`/api/employees/${id}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      fetchFiles();
      alert(`Tải ${getCategoryName(category)} lên thành công`);
    } catch (error) {
      alert('Không thể tải file lên');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const getCategoryName = (category) => {
    const categoryNames = {
      'resume': 'Sơ Yếu Lý Lịch',
      'health': 'Giấy Khám Sức Khỏe',
      'diploma': 'Bằng Cấp',
      'certificate': 'Chứng Chỉ Hành Nghề',
      'other': 'Tài Liệu Khác'
    };
    return categoryNames[category] || 'Tài Liệu';
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
    } catch (error) {
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
    <div className="container" style={{ maxWidth: '1200px', marginTop: '2rem' }}>
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

          {/* Thông tin cơ bản */}
          <h3 style={{ color: '#1976d2', marginBottom: '1rem', borderBottom: '2px solid #1976d2', paddingBottom: '0.5rem' }}>
            📋 Thông Tin Cơ Bản
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Họ và Tên *</label>
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
              <label className="form-label" htmlFor="email">Email *</label>
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
              <label className="form-label" htmlFor="password">Mật Khẩu *</label>
              <input
                type="password"
                className="form-input"
                id="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                required
              />
            </div>
          )}

          {/* Thông tin cá nhân */}
          <h3 style={{ color: '#1976d2', marginBottom: '1rem', borderBottom: '2px solid #1976d2', paddingBottom: '0.5rem', marginTop: '2rem' }}>
            👤 Thông Tin Cá Nhân
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="birthYear">Năm Sinh *</label>
              <input
                type="number"
                className="form-input"
                id="birthYear"
                name="birthYear"
                value={formData.birthYear}
                onChange={onChange}
                min="1950"
                max="2010"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cccd">Số CCCD *</label>
              <input
                type="text"
                className="form-input"
                id="cccd"
                name="cccd"
                value={formData.cccd}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="cccdIssueDate">Ngày Cấp CCCD *</label>
              <input
                type="date"
                className="form-input"
                id="cccdIssueDate"
                name="cccdIssueDate"
                value={formData.cccdIssueDate}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cccdIssuePlace">Nơi Cấp CCCD *</label>
              <input
                type="text"
                className="form-input"
                id="cccdIssuePlace"
                name="cccdIssuePlace"
                value={formData.cccdIssuePlace}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Số Điện Thoại *</label>
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
              <label className="form-label" htmlFor="socialInsuranceNumber">Mã Số BHXH</label>
              <input
                type="text"
                className="form-input"
                id="socialInsuranceNumber"
                name="socialInsuranceNumber"
                value={formData.socialInsuranceNumber}
                onChange={onChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="healthInsuranceNumber">Mã Số BHYT</label>
              <input
                type="text"
                className="form-input"
                id="healthInsuranceNumber"
                name="healthInsuranceNumber"
                value={formData.healthInsuranceNumber}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="birthPlace">Nơi Cấp Khai Sinh/Nguyên Quán *</label>
              <input
                type="text"
                className="form-input"
                id="birthPlace"
                name="birthPlace"
                value={formData.birthPlace}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="permanentAddress">Thường Trú *</label>
            <textarea
              className="form-input"
              id="permanentAddress"
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={onChange}
              rows="2"
              required
            />
          </div>

          {/* Thông tin công việc */}
          <h3 style={{ color: '#1976d2', marginBottom: '1rem', borderBottom: '2px solid #1976d2', paddingBottom: '0.5rem', marginTop: '2rem' }}>
            💼 Thông Tin Công Việc
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="department">Bộ Phận *</label>
              <select
                className="form-input"
                id="department"
                name="department"
                value={formData.department}
                onChange={onChange}
                required
              >
                <option value="">Chọn Bộ Phận</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="position">Chức Danh *</label>
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
              <label className="form-label" htmlFor="educationLevel">Trình Độ *</label>
              <select
                className="form-input"
                id="educationLevel"
                name="educationLevel"
                value={formData.educationLevel}
                onChange={onChange}
                required
              >
                <option value="">Chọn Trình Độ</option>
                <option value="Tiểu học">Tiểu học</option>
                <option value="THCS">Trung học cơ sở</option>
                <option value="THPT">Trung học phổ thông</option>
                <option value="Trung cấp">Trung cấp</option>
                <option value="Cao đẳng">Cao đẳng</option>
                <option value="Đại học">Đại học</option>
                <option value="Thạc sĩ">Thạc sĩ</option>
                <option value="Tiến sĩ">Tiến sĩ</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="major">Chuyên Ngành *</label>
              <input
                type="text"
                className="form-input"
                id="major"
                name="major"
                value={formData.major}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="school">Trường Đào Tạo *</label>
            <input
              type="text"
              className="form-input"
              id="school"
              name="school"
              value={formData.school}
              onChange={onChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="startDate">Ngày Nhận Việc *</label>
              <input
                type="date"
                className="form-input"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="officialDate">Ngày Chính Thức *</label>
              <input
                type="date"
                className="form-input"
                id="officialDate"
                name="officialDate"
                value={formData.officialDate}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="contractType">Loại HĐLĐ *</label>
              <select
                className="form-input"
                id="contractType"
                name="contractType"
                value={formData.contractType}
                onChange={onChange}
                required
              >
                <option value="">Chọn Loại HĐLĐ</option>
                <option value="Thử việc">Thử việc</option>
                <option value="Có thời hạn">Có thời hạn</option>
                <option value="Không thời hạn">Không thời hạn</option>
                <option value="Theo mùa vụ">Theo mùa vụ</option>
                <option value="Theo công việc">Theo công việc</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="salary">Mức Lương *</label>
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

          {/* Phụ cấp */}
          <h4 style={{ color: '#666', marginBottom: '1rem', marginTop: '1.5rem' }}>
            💰 Phụ Cấp
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="allowances.meal">Cơm Ca</label>
              <input
                type="number"
                className="form-input"
                id="allowances.meal"
                name="allowances.meal"
                value={formData.allowances.meal}
                onChange={(e) => setFormData({
                  ...formData,
                  allowances: { ...formData.allowances, meal: e.target.value }
                })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="allowances.transport">Xăng</label>
              <input
                type="number"
                className="form-input"
                id="allowances.transport"
                name="allowances.transport"
                value={formData.allowances.transport}
                onChange={(e) => setFormData({
                  ...formData,
                  allowances: { ...formData.allowances, transport: e.target.value }
                })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="allowances.additional">Kiêm Nhiệm</label>
              <input
                type="number"
                className="form-input"
                id="allowances.additional"
                name="allowances.additional"
                value={formData.allowances.additional}
                onChange={(e) => setFormData({
                  ...formData,
                  allowances: { ...formData.allowances, additional: e.target.value }
                })}
              />
          </div>

          <div className="form-group">
              <label className="form-label" htmlFor="allowances.hazardous">Độc Hại</label>
              <input
                type="number"
              className="form-input"
                id="allowances.hazardous"
                name="allowances.hazardous"
                value={formData.allowances.hazardous}
                onChange={(e) => setFormData({
                  ...formData,
                  allowances: { ...formData.allowances, hazardous: e.target.value }
                })}
              />
            </div>
          </div>

          {/* Hồ sơ */}
          <h3 style={{ color: '#1976d2', marginBottom: '1rem', borderBottom: '2px solid #1976d2', paddingBottom: '0.5rem', marginTop: '2rem' }}>
            📁 Hồ Sơ
          </h3>

          {isEdit && (
            <div>
              <h4 style={{ color: '#666', marginBottom: '1rem' }}>📤 Tải Lên Hồ Sơ</h4>
              
              {/* Sơ Yếu Lý Lịch */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">📄 Sơ Yếu Lý Lịch</label>
                <input
                  type="file"
                  className="form-input"
                  id="resumeUpload"
                  onChange={(e) => handleFileUpload(e, 'resume')}
                  disabled={uploading}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>

              {/* Giấy Khám Sức Khỏe */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">🏥 Giấy Khám Sức Khỏe</label>
                <input
                  type="file"
                  className="form-input"
                  id="healthUpload"
                  onChange={(e) => handleFileUpload(e, 'health')}
                  disabled={uploading}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>

              {/* Bằng Cấp */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">🎓 Bằng Cấp</label>
                <input
                  type="file"
                  className="form-input"
                  id="diplomaUpload"
                  onChange={(e) => handleFileUpload(e, 'diploma')}
                  disabled={uploading}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>

              {/* Chứng Chỉ Hành Nghề */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">📜 Chứng Chỉ Hành Nghề</label>
                <input
                  type="file"
                  className="form-input"
                  id="certificateUpload"
                  onChange={(e) => handleFileUpload(e, 'certificate')}
                  disabled={uploading}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>

              {/* Tài Liệu Khác */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">📁 Tài Liệu Khác</label>
                <input
                  type="file"
                  className="form-input"
                  id="otherUpload"
                  onChange={(e) => handleFileUpload(e, 'other')}
                  disabled={uploading}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
                />
              </div>

              {uploading && <p style={{ color: '#666', fontSize: '0.9rem' }}>Đang tải lên...</p>}
            </div>
          )}

          {/* Files List */}
          {isEdit && files.length > 0 && (
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
                        {(file.fileSize / 1024).toFixed(1)} KB • {getCategoryName(file.category)} • 
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

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
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