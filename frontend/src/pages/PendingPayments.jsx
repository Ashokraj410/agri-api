import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import './Pages.css';

const PendingPayments = () => {
  const { location } = useParams();
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const response = await axiosInstance.get(`/pending-payments/${location}`);
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const markAsPaid = async (paymentId) => {
    try {
      await axiosInstance.put(`/pending-payments/${location}`, { id: paymentId });
      fetchPayments();
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Pending Payments - {location.charAt(0).toUpperCase() + location.slice(1)}</h1>
      </div>

      <div className="table-container">
        <h2>Outstanding Payments</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Bill ID</th>
              <th>Farmer Name</th>
              <th>Phone</th>
              <th>Village</th>
              <th>Pending Amount</th>
              <th>Bill Date</th>
              <th>Paid Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.bill_id}</td>
                <td>{payment.farmer_name}</td>
                <td>{payment.phone_number}</td>
                <td>{payment.village}</td>
                <td>₹{payment.pending_amount}</td>
                <td>{new Date(payment.bill_date).toLocaleDateString()}</td>
                <td>
                  {payment.paid_date ? (
                    <span className="badge badge-success">
                      {new Date(payment.paid_date).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="badge badge-warning">Unpaid</span>
                  )}
                </td>
                <td>
                  {!payment.paid_date && (
                    <button
                      onClick={() => markAsPaid(payment.id)}
                      className="btn-small btn-success"
                    >
                      Mark as Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingPayments;
