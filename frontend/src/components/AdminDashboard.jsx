import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../store/authSlice';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!user) return null;

  const locations = [
    { name: 'Jayankondam', id: 'jayankondam' },
    { name: 'Devamangalam', id: 'devamangalam' },
    { name: 'Ariyalur', id: 'ariyalur' }
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard - Agri Clinic</h1>
        <div className="admin-user-info">
          <span>Welcome, {user.username}</span>
          <button onClick={handleLogout} className="btn-logout-admin">Logout</button>
        </div>
      </div>
      <div className="locations-grid">
        {locations.map((location) => (
          <div key={location.id} className="location-card">
            <h2>{location.name} Clinic</h2>
            <div className="location-links">
              <Link to={`/dashboard/${location.id}/billing`} className="location-link">
                📝 Billing
              </Link>
              <Link to={`/dashboard/${location.id}/stock`} className="location-link">
                📦 Stock Details
              </Link>
              <Link to={`/dashboard/${location.id}/farmers`} className="location-link">
                👨‍🌾 Farmers
              </Link>
              <Link to={`/dashboard/${location.id}/pending-payments`} className="location-link">
                💰 Pending Payments
              </Link>
              <Link to={`/dashboard/${location.id}/expenses`} className="location-link">
                📊 Daily Expenses
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
