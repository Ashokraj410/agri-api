import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams, Link, Outlet } from 'react-router-dom';
import { logout } from '../store/authSlice';
import './Dashboard.css';

const Dashboard = () => {
  const { location } = useParams();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!user) return null;

  const locationName = location.charAt(0).toUpperCase() + location.slice(1);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Agri Clinic</h2>
          <p className="location-name">{locationName}</p>
        </div>
        <nav className="sidebar-nav">
          <Link to={`/dashboard/${location}/billing`} className="nav-link">
            📝 Billing
          </Link>
          <Link to={`/dashboard/${location}/stock`} className="nav-link">
            📦 Stock Details
          </Link>
          <Link to={`/dashboard/${location}/farmers`} className="nav-link">
            👨‍🌾 Farmer Details
          </Link>
          <Link to={`/dashboard/${location}/pending-payments`} className="nav-link">
            💰 Pending Payments
          </Link>
          <Link to={`/dashboard/${location}/expenses`} className="nav-link">
            📊 Daily Expenses
          </Link>
        </nav>
        <div className="sidebar-footer">
          <p className="user-info">User: {user.username}</p>
          <p className="user-role">Role: {user.role}</p>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
