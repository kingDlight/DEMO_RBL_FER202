import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-sm font-display text-8xl font-black leading-none text-primary">
        404
      </h1>
      <h2 className="mb-md font-headline-lg text-headline-lg text-on-surface">
        Page not found
      </h2>
      <p className="mb-xl max-w-[576px] text-on-surface-variant">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="rounded-xl border border-outline px-lg py-sm font-label-md text-label-md text-on-surface no-underline transition-colors hover:border-primary hover:text-primary"
      >
        Back to Home
      </Link>
    </section>
  );
};

export default NotFoundPage;
