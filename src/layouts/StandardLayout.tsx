import React from 'react';
import { Outlet } from 'react-router-dom';


const StandardLayout: React.FC = () => {
  return (
    <>
      <div className="mx-auto min-h-screen w-full max-w-[1440px] px-container-margin-mobile pb-32 pt-28 md:px-container-margin-desktop">
        <Outlet />
      </div>

    </>
  );
};

export default StandardLayout;
