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
      className="px-3 px-md-4 mb-5 rounded-4 py-4"
      style={{ backgroundColor }}
    >
      <div className="d-flex flex-column mb-4">
        <div className="d-flex justify-content-between align-items-end">
          <h2 className="display-6 fw-bold text-body mb-0">{title}</h2>
          <a className="fs-6 text-primary text-decoration-none fw-semibold" href="#" style={{ cursor: 'pointer' }}>
            View All
          </a>
        </div>
        {subtitle && (
          <p className="text-secondary mt-2 mb-0">{subtitle}</p>
        )}
      </div>
      
      <div>
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;
