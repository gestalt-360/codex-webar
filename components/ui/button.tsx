import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline';
  size?: 'default' | 'lg';
};

export function Button({ variant = 'default', size = 'default', className = '', ...props }: Props) {
  const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition disabled:opacity-50';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-100'
  };
  const sizes = { default: 'h-10 px-4 py-2', lg: 'h-11 px-8' };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
