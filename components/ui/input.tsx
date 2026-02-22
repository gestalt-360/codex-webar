import { InputHTMLAttributes } from 'react';

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`h-10 w-full rounded-md border border-slate-300 px-3 py-2 text-sm ${className}`} {...props} />;
}
