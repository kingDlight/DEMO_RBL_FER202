import React from 'react';
import { Outlet } from 'react-router-dom';


const HomeLayout: React.FC = () => {
  return (
    <>
      <div className="w-full">
        <Outlet />
      </div>

    </>
  );
};

export default HomeLayout;
