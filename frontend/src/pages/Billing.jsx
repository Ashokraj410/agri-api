import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import './Pages.css';

const Billing = () => {
  const { location } = useParams();
  const [bills, setBills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    farmer_name: '',
    phone_number: '',
    village: '',
    items: [{ product: '', quantity: '', price: '', total: 0 }],
    total_amount: 0,
    paid_amount: 0,
    pending_amount: 0
  });

  const fetchBills = async () => {
    try {
      const response = await axiosInstance.get(`/billing/${location}`);
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  useEffect(() => {
    fetchBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'price') {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const price = parseFloat(newItems[index].price) || 0;
      newItems[index].total = quantity * price;
    }
    
    const totalAmount = newItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const paidAmount = parseFloat(formData.paid_amount) || 0;
    
    setFormData({
      ...formData,
      items: newItems,
      total_amount: totalAmount,
      pending_amount: totalAmount - paidAmount
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: '', quantity: '', price: '', total: 0 }]
    });
  };

  const handlePaidAmountChange = (value) => {
    const paid = parseFloat(value) || 0;
    setFormData({
      ...formData,
      paid_amount: paid,
      pending_amount: formData.total_amount - paid
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/billing/${location}`, formData);
      setShowForm(false);
      setFormData({
        farmer_name: '',
        phone_number: '',
        village: '',
        items: [{ product: '', quantity: '', price: '', total: 0 }],
        total_amount: 0,
        paid_amount: 0,
        pending_amount: 0
      });
      fetchBills();
    } catch (error) {
      console.error('Error creating bill:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Billing - {location.charAt(0).toUpperCase() + location.slice(1)}</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ New Bill'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Create New Bill</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Farmer Name</label>
                <input
                  type="text"
                  value={formData.farmer_name}
                  onChange={(e) => setFormData({ ...formData, farmer_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Village</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  required
                />
              </div>
            </div>

            <h3>Items</h3>
            {formData.items.map((item, index) => (
              <div key={index} className="form-row">
                <div className="form-group">
                  <label>Product</label>
                  <input
                    type="text"
                    value={item.product}
                    onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Total</label>
                  <input type="number" value={item.total} readOnly />
                </div>
              </div>
            ))}
            <button type="button" onClick={addItem} className="btn-secondary">+ Add Item</button>

            <div className="form-row">
              <div className="form-group">
                <label>Total Amount</label>
                <input type="number" value={formData.total_amount} readOnly />
              </div>
              <div className="form-group">
                <label>Paid Amount</label>
                <input
                  type="number"
                  value={formData.paid_amount}
                  onChange={(e) => handlePaidAmountChange(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Pending Amount</label>
                <input type="number" value={formData.pending_amount} readOnly />
              </div>
            </div>

            <button type="submit" className="btn-primary">Create Bill</button>
          </form>
        </div>
      )}

      <div className="table-container">
        <h2>Bills History</h2>
        <table>
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Farmer Name</th>
              <th>Phone</th>
              <th>Village</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Pending</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.id}</td>
                <td>{bill.farmer_name}</td>
                <td>{bill.phone_number}</td>
                <td>{bill.village}</td>
                <td>₹{bill.total_amount}</td>
                <td>₹{bill.paid_amount}</td>
                <td>₹{bill.pending_amount}</td>
                <td>{new Date(bill.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billing;
