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
  children,
}) => {
  return (
    <section className="mb-3xl rounded-xl px-0 py-lg" style={{ backgroundColor }}>
      <div className="mb-lg flex flex-col gap-xs sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-xs max-w-[672px] text-body-md text-on-surface-variant">
              {subtitle}
            </p>
          )}
        </div>
        <button
          type="button"
          className="self-start font-label-md text-label-md text-primary transition-colors hover:text-primary-fixed sm:self-auto"
        >
          View All
        </button>
      </div>

      {children}
    </section>
  );
};

export default SectionWrapper;
