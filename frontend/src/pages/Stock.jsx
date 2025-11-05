import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import './Pages.css';

const Stock = () => {
  const { location } = useParams();
  const [stocks, setStocks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product_name: '',
    type: 'in',
    quantity: '',
    unit: 'kg',
    notes: ''
  });

  useEffect(() => {
    fetchStocks();
  }, [location]);

  const fetchStocks = async () => {
    try {
      const response = await axiosInstance.get(`/stock/${location}`);
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/stock/${location}`, formData);
      setShowForm(false);
      setFormData({
        product_name: '',
        type: 'in',
        quantity: '',
        unit: 'kg',
        notes: ''
      });
      fetchStocks();
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Stock Details - {location.charAt(0).toUpperCase() + location.slice(1)}</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Stock Entry'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Add Stock Entry</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="in">Stock In</option>
                  <option value="out">Stock Out</option>
                </select>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="liter">Liter (L)</option>
                  <option value="piece">Piece</option>
                  <option value="bag">Bag</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
              />
            </div>
            <button type="submit" className="btn-primary">Add Entry</button>
          </form>
        </div>
      )}

      <div className="table-container">
        <h2>Stock Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Notes</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.id}>
                <td>{stock.id}</td>
                <td>{stock.product_name}</td>
                <td>
                  <span className={`badge ${stock.type === 'in' ? 'badge-success' : 'badge-danger'}`}>
                    {stock.type === 'in' ? 'Stock In' : 'Stock Out'}
                  </span>
                </td>
                <td>{stock.quantity}</td>
                <td>{stock.unit}</td>
                <td>{stock.notes}</td>
                <td>{new Date(stock.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stock;
