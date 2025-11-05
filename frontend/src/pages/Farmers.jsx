import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axios';
import './Pages.css';

const Farmers = () => {
  const { location } = useParams();
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    fetchFarmers();
  }, [location]);

  const fetchFarmers = async () => {
    try {
      const response = await axiosInstance.get(`/farmers/${location}`);
      setFarmers(response.data);
    } catch (error) {
      console.error('Error fetching farmers:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Farmer Details - {location.charAt(0).toUpperCase() + location.slice(1)}</h1>
      </div>

      <div className="table-container">
        <h2>Farmer Records</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Farmer Name</th>
              <th>Phone Number</th>
              <th>Village</th>
              <th>Total Bills</th>
              <th>Total Amount</th>
              <th>Last Visit</th>
            </tr>
          </thead>
          <tbody>
            {farmers.map((farmer) => (
              <tr key={farmer.id}>
                <td>{farmer.id}</td>
                <td>{farmer.farmer_name}</td>
                <td>{farmer.phone_number}</td>
                <td>{farmer.village}</td>
                <td>{farmer.total_bills}</td>
                <td>₹{farmer.total_amount}</td>
                <td>{new Date(farmer.last_visit).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Farmers;
