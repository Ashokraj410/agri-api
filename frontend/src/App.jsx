import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Billing from './pages/Billing';
import Stock from './pages/Stock';
import Farmers from './pages/Farmers';
import PendingPayments from './pages/PendingPayments';
import Expenses from './pages/Expenses';

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard/:location" element={<Dashboard />}>
          <Route path="billing" element={<Billing />} />
          <Route path="stock" element={<Stock />} />
          <Route path="farmers" element={<Farmers />} />
          <Route path="pending-payments" element={<PendingPayments />} />
          <Route path="expenses" element={<Expenses />} />
          <Route index element={<Navigate to="billing" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
