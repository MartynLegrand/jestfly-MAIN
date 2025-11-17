import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'outline';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  className = '',
  variant = 'default',
  hoverable = true,
  clickable = false,
  onClick
}) => {
  const variantClasses = {
    default: 'bg-white/5 border border-white/10',
    glass: 'bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/20',
    gradient: 'bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20 border border-white/10',
    outline: 'bg-transparent border-2 border-white/20'
  };

  const hoverAnimation = hoverable ? {
    whileHover: { 
      y: -4,
      boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
      borderColor: 'rgba(139, 92, 246, 0.4)'
    },
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 20 
    }
  } : {};

  const clickAnimation = clickable ? {
    whileTap: { scale: 0.98 }
  } : {};

  return (
    <motion.div
      className={`
        rounded-xl p-6 
        ${variantClasses[variant]} 
        ${clickable ? 'cursor-pointer' : ''} 
        ${className}
      `}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      {...hoverAnimation}
      {...clickAnimation}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<{ 
  children: React.ReactNode; 
  className?: string 
}> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ 
  children: React.ReactNode; 
  className?: string 
}> = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-white ${className}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ 
  children: React.ReactNode; 
  className?: string 
}> = ({ children, className = '' }) => (
  <p className={`text-sm text-white/70 mt-1 ${className}`}>
    {children}
  </p>
);

export const CardContent: React.FC<{ 
  children: React.ReactNode; 
  className?: string 
}> = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ 
  children: React.ReactNode; 
  className?: string 
}> = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-white/10 ${className}`}>
    {children}
  </div>
);

export default EnhancedCard;
