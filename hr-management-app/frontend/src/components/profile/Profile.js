import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      const userProfile = response.data.data.user;
      setProfile(userProfile);
      setFormData({
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        address: userProfile.address
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/auth/profile', formData);
      setProfile({ ...profile, ...formData });
      setEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      alert('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '2rem' }}>
        Loading profile...
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', marginTop: '2rem' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Profile</h1>
          <button
            onClick={() => setEditing(!editing)}
            className="btn btn-primary"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {editing ? (
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

            <button type="submit" className="btn btn-primary">
              Update Profile
            </button>
          </form>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h3>Personal Information</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Name:</strong> {profile?.name}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Email:</strong> {profile?.email}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Phone:</strong> {profile?.phone}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Address:</strong> {profile?.address}
                </div>
              </div>

              <div>
                <h3>Work Information</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Role:</strong> {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Department:</strong> {profile?.department}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Position:</strong> {profile?.position}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Salary:</strong> ${profile?.salary?.toLocaleString()}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Hire Date:</strong> {new Date(profile?.hireDate).toLocaleDateString()}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Status:</strong>
                  <span style={{
                    marginLeft: '0.5rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: profile?.isActive ? '#d4edda' : '#f8d7da',
                    color: profile?.isActive ? '#155724' : '#721c24'
                  }}>
                    {profile?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
