import React from 'react';

interface ScrollIndicatorProps {
  className?: string;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ className = '' }) => {
  return (
    <div className={'scroll-indicator ' + className} aria-label="Scroll down">
      <span className="sr-only">Scroll para ver mais</span>
    </div>
  );
};

export default ScrollIndicator;
