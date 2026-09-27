import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BotDigit AI Council — AI Project Operating System',
  description:
    'Give your project an AI team. Persistent multi-agent debate, evidence graph, project outlook, and autonomous execution.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070a12] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
