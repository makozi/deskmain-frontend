import React from 'react';
import { clsx } from 'clsx';

const LoadingSpinner = ({
  size = 'md',
  fullScreen = false,
  message,
  className,
}) => {
  const sizeStyles = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4',
  };

  const spinner = (
    <div
      className={clsx(
        'rounded-full border-blue-600 border-t-transparent animate-spin',
        sizeStyles[size],
        className
      )}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {spinner}
        {message && <p className="mt-4 text-gray-600 font-medium">{message}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {spinner}
      {message && <p className="mt-4 text-gray-600 font-medium">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
