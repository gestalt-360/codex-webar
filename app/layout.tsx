import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WebAR Studio',
  description: 'Crie experiências WebAR com image tracking'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
