import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, Users, BookOpen, Wallet, Settings, Bell, LogOut } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/academics', label: 'Academics', icon: BookOpen },
  { to: '/fees', label: 'Fees', icon: Wallet },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('school-erp-token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <aside className="fixed left-0 top-0 h-full w-72 bg-slate-900 text-white shadow-xl">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-700">
          <div className="rounded-xl bg-brand-500 p-2">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">ERP</p>
            <h1 className="text-xl font-semibold">Usman Ahmed</h1>
          </div>
        </div>

        <nav className="mt-6 space-y-2 px-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute inset-x-4 bottom-4 rounded-xl border border-slate-700 bg-slate-800 p-4">
          <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
            <span>Notifications</span>
            <Bell className="h-4 w-4" />
          </div>
          <div className="text-xs text-slate-400">3 new updates</div>
          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-72 flex min-h-screen flex-col">
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">School management</p>
              <h2 className="text-2xl font-semibold">School Administration ERP</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700">Academic Year 2025-26</div>
              <Link to="/students" className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white">Add Student</Link>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
