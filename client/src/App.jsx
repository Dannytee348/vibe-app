import { useEffect, useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('Connecting to backend...');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus(data.message);
          setConnected(true);
        }
      })
      .catch(() => {
        setStatus('Could not reach backend on port 5000.');
        setConnected(false);
      });
  }, []);

  const boxStyle = connected
    ? 'p-4 rounded-xl border text-sm font-medium bg-emerald-950/50 border-emerald-800 text-emerald-300'
    : 'p-4 rounded-xl border text-sm font-medium bg-amber-950/50 border-amber-800 text-amber-300';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Full-Stack Vibe Starter
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          React + Vite + Tailwind CSS + Express + MongoDB
        </p>

        <div className={boxStyle}>
          {status}
        </div>
      </div>
    </div>
  );
}
