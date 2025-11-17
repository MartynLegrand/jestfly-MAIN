import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      required,
      leftIcon,
      rightIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const hasSuccess = !!success;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-medium mb-2 text-white ${
              required ? 'required' : ''
            }`}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-4 py-3 
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || hasError || hasSuccess ? 'pr-10' : ''}
              bg-white/5 
              border 
              ${hasError ? 'border-red-500' : hasSuccess ? 'border-green-500' : 'border-white/20'}
              rounded-lg 
              text-white 
              placeholder:text-white/40
              focus:outline-none 
              focus:ring-2 
              ${hasError ? 'focus:ring-red-500/50' : hasSuccess ? 'focus:ring-green-500/50' : 'focus:ring-purple-500/50'}
              transition-all duration-200
              hover:border-white/30
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />

          {rightIcon && !hasError && !hasSuccess && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
              {rightIcon}
            </div>
          )}

          {hasError && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              <AlertCircle size={20} aria-hidden="true" />
            </div>
          )}

          {hasSuccess && !hasError && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
              <CheckCircle size={20} aria-hidden="true" />
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-400 flex items-center gap-1"
            role="alert"
          >
            <AlertCircle size={14} />
            {error}
          </p>
        )}

        {success && !error && (
          <p
            id={`${inputId}-success`}
            className="mt-1 text-sm text-green-400 flex items-center gap-1"
          >
            <CheckCircle size={14} />
            {success}
          </p>
        )}

        {helperText && !error && !success && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-white/50">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
