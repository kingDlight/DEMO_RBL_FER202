import React from 'react';

interface SectionWrapperProps {
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  children: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ 
  title, 
  subtitle, 
  backgroundColor = 'transparent', 
  children 
}) => {
  return (
    <section 
      className="px-[16px] md:px-[32px] mb-[64px] rounded-2xl py-8"
      style={{ backgroundColor }}
    >
      <div className="flex flex-col mb-[24px]">
        <div className="flex justify-between items-end">
          <h2 className="font-headline-lg text-[32px] font-bold text-[#e8dfee]">{title}</h2>
          <a className="font-label-md text-[14px] text-[#d2bbff] hover:text-[#7c3aed] transition-colors cursor-pointer">
            View All
          </a>
        </div>
        {subtitle && (
          <p className="font-body-md text-[#ccc3d8] mt-2">{subtitle}</p>
        )}
      </div>
      
      <div>
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;
