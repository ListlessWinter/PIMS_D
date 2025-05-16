import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout';
import './Profile.css';
import InventoryList from "../Components/InventoryList";

export default function Profile() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <Layout username={username} onLogout={handleLogout}>
      <div className='Profile-Content'>
        <div className='image'>
          <h2 className="Data_Label">PRESCRIPTIONS</h2>
        </div>
        <div className='Docinfo'>
          <h3 className='FontData'> Hospital Hotlines</h3>
          <h6 className='FontData1' >NURSE STATION 1</h6>
          <h6 className='FontData'># (51) 472-4025</h6>
          <h6 className='FontData1'>NURSE STATION 1</h6>
          <h6 className='FontData'># (51) 472-4025</h6>
          <p className='credits'>© 2025 St. Ignatius Medical Center, Ateneo Avenue, Naga City, 4400 Philippines</p>
        </div>
        <div className='UserDeets'>
          <input
            type="text"
            placeholder="Search by doctor's name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="inventory-search-bar"
          />
          <InventoryList searchQuery={searchQuery} />
        </div>
      </div>
    </Layout>
  );
}