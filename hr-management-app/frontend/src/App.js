import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import EmployeeList from './components/employees/EmployeeList';
import EmployeeForm from './components/employees/EmployeeForm';
import DepartmentList from './components/departments/DepartmentList';
import DepartmentForm from './components/departments/DepartmentForm';
import Profile from './components/profile/Profile';
import PrivateRoute from './components/routing/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/employees" element={
                <PrivateRoute>
                  <EmployeeList />
                </PrivateRoute>
              } />
              <Route path="/employees/new" element={
                <PrivateRoute roles={['hr', 'admin']}>
                  <EmployeeForm />
                </PrivateRoute>
              } />
              <Route path="/employees/edit/:id" element={
                <PrivateRoute roles={['hr', 'admin']}>
                  <EmployeeForm />
                </PrivateRoute>
              } />
              <Route path="/departments" element={
                <PrivateRoute>
                  <DepartmentList />
                </PrivateRoute>
              } />
              <Route path="/departments/new" element={
                <PrivateRoute roles={['hr', 'admin']}>
                  <DepartmentForm />
                </PrivateRoute>
              } />
              <Route path="/departments/edit/:id" element={
                <PrivateRoute roles={['hr', 'admin']}>
                  <DepartmentForm />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
