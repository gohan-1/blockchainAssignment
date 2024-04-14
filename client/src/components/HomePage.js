import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to Our Platform</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
          <div className="space-y-1">
            <div className="text-xl font-medium text-black">Admin</div>
            <Link to="/admin" className="btn text-lg bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Go to Dashboard
            </Link>
          </div>
        </div>

        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
          <div className="space-y-1">
            <div className="text-xl font-medium text-black">Investor</div>
            <Link to="/investor" className="btn text-lg bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              View Investments
            </Link>
            
          </div>
        </div>

        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
          <div className="space-y-1">
            <div className="text-xl font-medium text-black">Commissioner</div>
            <Link to="/com" className="btn text-lg bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
              Manage Regulations
            </Link>
          </div>
        </div>

        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
          <div className="space-y-1">
            <div className="text-xl font-medium text-black">Customer</div>
            <Link to="/customer" className="btn text-lg bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;




