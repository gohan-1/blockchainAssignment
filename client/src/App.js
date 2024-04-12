// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import AdminPage from './components/AdminPage';
import MiddlemanPage from './components/MiddlemanPage';
import CustomerPage from './components/CustomerPage';
import InvestorPage from './components/InvestorPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/middleman" element={<MiddlemanPage />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/investor" element={<InvestorPage />} />

        

        {/* Define other routes here */}
      </Routes>
    </Router>
  );
};

export default App;


  



 


