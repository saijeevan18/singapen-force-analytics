'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Activity, 
  Map, 
  BarChart3, 
  Bot, 
  Sun, 
  Moon, 
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

export type TabType = 'dashboard' | 'incidents' | 'command' | 'map' | 'analytics' | 'ai';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen
}: SidebarProps) {
  const [darkMode, setDarkMode] = React.useState(false);

  // Initialize theme
  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Tactical Home', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'incidents', label: 'Incident Desk', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'command', label: 'Live Operations', icon: <Activity className="w-4 h-4" /> },
    { id: 'map', label: 'Heatmap Sector', icon: <Map className="w-4 h-4" /> },
    { id: 'analytics', label: 'Command Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'ai', label: 'Tactical Copilot', icon: <Bot className="w-4 h-4" /> },
  ] as const;

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* Main Sidebar Panel */}
      <aside className={`fixed inset-y-0 left-0 z-45 w-64 bg-slate-900 dark:bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 transform lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:h-full`}>
        
        {/* Top Branding Section */}
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-black text-white tracking-wide uppercase">SingaPen</h1>
                <p className="text-[10px] font-bold text-slate-400">Force Analytics</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links list */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Settings & Theme Switch */}
        <div className="p-4 border-t border-slate-800 space-y-4">
          {/* Dark Mode toggle button */}
          <div className="flex items-center justify-between bg-slate-800/40 rounded-xl p-2 border border-slate-800/60">
            <span className="text-[10px] font-bold text-slate-400 pl-2">System Theme</span>
            
            <button
              onClick={toggleTheme}
              className="p-2 bg-slate-800 dark:bg-slate-900 hover:bg-slate-700 hover:text-white text-slate-400 rounded-lg transition-colors flex items-center justify-center"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-yellow-500" /> : <Moon className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>

          {/* User Profile Info */}
          <div className="flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-xs">
              JD
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">Officer Jeeva</div>
              <div className="text-[10px] text-slate-500 truncate">Central Command Desk</div>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}
