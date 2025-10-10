import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/axios';

const DepartmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: '',
    location: '',
    budget: '',
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    fetchManagers();
    if (isEdit) {
      fetchDepartment();
    }
  }, [id, isEdit]);

  const fetchManagers = async () => {
    try {
      const response = await api.get('/employees');
      setManagers(response.data.data.filter(emp => emp.role === 'hr' || emp.role === 'admin'));
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const fetchDepartment = async () => {
    try {
      const response = await api.get(`/departments/${id}`);
      const department = response.data.data;
      setFormData({
        name: department.name,
        description: department.description,
        manager: department.manager?._id || '',
        location: department.location,
        budget: department.budget,
        isActive: department.isActive
      });
    } catch (error) {
      console.error('Error fetching department:', error);
      navigate('/departments');
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await api.put(`/departments/${id}`, formData);
      } else {
        await api.post('/departments', formData);
      }

      navigate('/departments');
    } catch (error) {
      alert('Failed to save department');
      console.error('Error saving department:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '2rem' }}>
      <div className="card">
        <h2>{isEdit ? 'Sửa Phòng Ban' : 'Thêm Phòng Ban Mới'}</h2>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Tên Phòng Ban</label>
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
            <label className="form-label" htmlFor="description">Mô Tả</label>
            <textarea
              className="form-input"
              id="description"
              name="description"
              value={formData.description}
              onChange={onChange}
              rows="3"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="manager">Trưởng Phòng</label>
              <select
                className="form-input"
                id="manager"
                name="manager"
                value={formData.manager}
                onChange={onChange}
                required
              >
                <option value="">Chọn Trưởng Phòng</option>
                {managers.map(manager => (
                  <option key={manager._id} value={manager._id}>
                    {manager.name} - {manager.position}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">Địa Điểm</label>
              <input
                type="text"
                className="form-input"
                id="location"
                name="location"
                value={formData.location}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="budget">Ngân Sách</label>
              <input
                type="number"
                className="form-input"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={onChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="isActive">Trạng Thái</label>
              <select
                className="form-input"
                id="isActive"
                name="isActive"
                value={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                required
              >
                <option value={true}>Hoạt Động</option>
                <option value={false}>Không Hoạt Động</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : (isEdit ? 'Cập Nhật Phòng Ban' : 'Thêm Phòng Ban')}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/departments')}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;
