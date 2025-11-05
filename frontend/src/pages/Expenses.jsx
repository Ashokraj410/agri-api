import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import './Pages.css';

const Expenses = () => {
  const { location } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    opening_amount: '',
    total_sales: '',
    company_payments: [{ company_name: '', amount: '', description: '' }],
    other_expenses: [{ description: '', amount: '' }]
  });

  useEffect(() => {
    fetchExpenses();
  }, [location]);

  const fetchExpenses = async () => {
    try {
      const response = await axiosInstance.get(`/expenses/${location}`);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const addCompanyPayment = () => {
    setFormData({
      ...formData,
      company_payments: [...formData.company_payments, { company_name: '', amount: '', description: '' }]
    });
  };

  const addOtherExpense = () => {
    setFormData({
      ...formData,
      other_expenses: [...formData.other_expenses, { description: '', amount: '' }]
    });
  };

  const handleCompanyPaymentChange = (index, field, value) => {
    const newPayments = [...formData.company_payments];
    newPayments[index][field] = value;
    setFormData({ ...formData, company_payments: newPayments });
  };

  const handleOtherExpenseChange = (index, field, value) => {
    const newExpenses = [...formData.other_expenses];
    newExpenses[index][field] = value;
    setFormData({ ...formData, other_expenses: newExpenses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/expenses/${location}`, formData);
      setShowForm(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        opening_amount: '',
        total_sales: '',
        company_payments: [{ company_name: '', amount: '', description: '' }],
        other_expenses: [{ description: '', amount: '' }]
      });
      fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Daily Expenses - {location.charAt(0).toUpperCase() + location.slice(1)}</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Expense Entry'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Add Daily Expense</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Opening Amount</label>
                <input
                  type="number"
                  value={formData.opening_amount}
                  onChange={(e) => setFormData({ ...formData, opening_amount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Sales</label>
                <input
                  type="number"
                  value={formData.total_sales}
                  onChange={(e) => setFormData({ ...formData, total_sales: e.target.value })}
                  required
                />
              </div>
            </div>

            <h3>Company Payments (Product Purchase)</h3>
            {formData.company_payments.map((payment, index) => (
              <div key={index} className="form-row">
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={payment.company_name}
                    onChange={(e) => handleCompanyPaymentChange(index, 'company_name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    value={payment.amount}
                    onChange={(e) => handleCompanyPaymentChange(index, 'amount', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={payment.description}
                    onChange={(e) => handleCompanyPaymentChange(index, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button type="button" onClick={addCompanyPayment} className="btn-secondary">
              + Add Company Payment
            </button>

            <h3>Other Expenses</h3>
            {formData.other_expenses.map((expense, index) => (
              <div key={index} className="form-row">
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={expense.description}
                    onChange={(e) => handleOtherExpenseChange(index, 'description', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => handleOtherExpenseChange(index, 'amount', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button type="button" onClick={addOtherExpense} className="btn-secondary">
              + Add Other Expense
            </button>

            <button type="submit" className="btn-primary">Add Expense Entry</button>
          </form>
        </div>
      )}

      <div className="table-container">
        <h2>Expense History</h2>
        <div className="expense-cards">
          {expenses.map((expense) => (
            <div key={expense.id} className="expense-card">
              <h3>{new Date(expense.date).toLocaleDateString()}</h3>
              <div className="expense-row">
                <span>Opening Amount:</span>
                <span>₹{expense.opening_amount}</span>
              </div>
              <div className="expense-row">
                <span>Total Sales:</span>
                <span className="text-success">₹{expense.total_sales}</span>
              </div>
              {expense.company_payments && expense.company_payments.length > 0 && (
                <div>
                  <h4>Company Payments</h4>
                  {expense.company_payments.map((payment, idx) => (
                    <div key={idx} className="expense-detail">
                      <span>{payment.company_name} - {payment.description}</span>
                      <span className="text-danger">₹{payment.amount}</span>
                    </div>
                  ))}
                </div>
              )}
              {expense.other_expenses && expense.other_expenses.length > 0 && (
                <div>
                  <h4>Other Expenses</h4>
                  {expense.other_expenses.map((exp, idx) => (
                    <div key={idx} className="expense-detail">
                      <span>{exp.description}</span>
                      <span className="text-danger">₹{exp.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
