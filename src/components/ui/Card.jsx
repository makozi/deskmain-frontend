import React from 'react';
import { clsx } from 'clsx';

const Card = ({
  children,
  className,
  hoverable = false,
  shadow = 'md',
  ...props
}) => {
  const shadowStyles = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  return (
    <div
      className={clsx(
        'rounded-lg border border-gray-200 bg-white p-6',
        shadowStyles[shadow],
        hoverable && 'transition-all duration-200 cursor-pointer hover:shadow-lg hover:border-gray-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
