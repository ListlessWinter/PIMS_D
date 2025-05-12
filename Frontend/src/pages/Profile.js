import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    // Simulate loading delay (e.g., fetching profile data)
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5s like your animation

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Layout username="Admin" onLogout={handleLogout}>
      <div className='Profile-Content'>
        {loading ? (
          <div className="skeleton-loader">
            <div className='image'></div>
            <div className='UserDeets2'>
              <div className='Name'>
                <div className='textbox'></div>
              </div>
              <div className='Admin-ID'>
                <div className='textbox'></div>
              </div>
            </div>
            <div className='UserDeets'></div>
          </div>
        ) : (
          <>
            <div className='image'></div>
            <div className='UserDeets2'>
              <div className='Name'>Name
                <div className='textbox'></div>
              </div>
              <div className='Admin-ID'>Admin ID
                <div className='textbox'></div>
              </div>
            </div>
            <div className='UserDeets'></div>
          </>
        )}
      </div>
    </Layout>
  );
}