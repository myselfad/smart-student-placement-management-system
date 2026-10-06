import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-sans">
      {/* Background Image / Overlay - OTT Style */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40" 
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000")',
        }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/60 to-black/20" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-transparent to-black/80" />

      {/* Main Content Area */}
      <main className="relative z-20 w-full max-w-[500px] px-6 sm:px-12 py-16">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
