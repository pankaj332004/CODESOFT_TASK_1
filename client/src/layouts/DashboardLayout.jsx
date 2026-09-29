import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DashboardSidebar from '../components/DashboardSidebar';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brandbg">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-8 items-start">
          <DashboardSidebar />
          <div className="flex-1 min-w-0 w-full">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
