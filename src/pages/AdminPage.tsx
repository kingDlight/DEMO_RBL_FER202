import React, { useEffect } from 'react';
import AdminTable from '../components/AdminTable';

const AdminPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Auralis - Admin Dashboard';
    return () => {
      document.title = 'Auralis Music';
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg px-container-margin-mobile pb-36 pt-[112px] text-on-surface md:px-container-margin-desktop">
      <AdminTable />
    </div>
  );
};

export default AdminPage;
