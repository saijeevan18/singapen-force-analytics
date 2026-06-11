'use client';

import React, { useState, useEffect } from 'react';
import { TabType } from './Sidebar';
import { 
  Menu, 
  Clock, 
  BellRing, 
  Volume2, 
  VolumeX, 
  Compass,
  FileCheck
} from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  onOpenMobileNav: () => void;
  activeCriticalCount: number;
}

export default function Header({
  activeTab,
  onOpenMobileNav,
  activeCriticalCount
}: HeaderProps) {
  const [time, setTime] = useState<string>('');
  const [tickerMessage, setTickerMessage] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setTime(date.toLocaleString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cycle alert ticker message
  useEffect(() => {
    const alerts = [
      "NOTICE: Operational readiness level NORMAL. Monitoring all channels.",
      `ALERT: ${activeCriticalCount} high threat situations flagged in current sector. Dispatch units on standby.`,
      "WEATHER: Meteorological division flags heavy rains in coastal districts (Cuddalore/Ramanathapuram).",
      "DISPATCH: Special patrol sector Alpha successfully completed operations at Chennai corridor.",
      "SYSTEM: Offline mock sandbox mode enabled. Telemetry is simulated."
    ];
    let idx = 0;
    setTickerMessage(alerts[0]);

    const tickerTimer = setInterval(() => {
      idx = (idx + 1) % alerts.length;
      setTickerMessage(alerts[idx]);
    }, 8000);

    return () => clearInterval(tickerTimer);
  }, [activeCriticalCount]);

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'HQ Command Panel';
      case 'incidents':
        return 'Tactical Incident Log Desk';
      case 'command':
        return 'Live Operations Dispatch';
      case 'map':
        return 'State Heatmap Sector';
      case 'analytics':
        return 'Telemetry & Analytical Reports';
      case 'ai':
        return 'Secure Command Copilot';
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-20 flex-shrink-0">
      
      {/* Left section: mobile hamburger & breadcrumb */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-blue-600 hidden sm:block" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">HQ /</span>
          <h2 className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">
            {getBreadcrumb()}
          </h2>
        </div>
      </div>

      {/* Middle section: simulated live ticker marquee */}
      <div className="hidden lg:flex items-center flex-1 max-w-lg mx-8 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 px-4 py-1.5 rounded-xl overflow-hidden relative text-left">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2.5 animate-pulse flex-shrink-0"></span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 flex-shrink-0">TICKER:</span>
        <div className="text-[10px] font-medium text-slate-600 dark:text-slate-350 truncate w-full transition-all duration-500">
          {tickerMessage}
        </div>
      </div>

      {/* Right section: tactical tools (clock, bells, volume) */}
      <div className="flex items-center space-x-4">
        {/* Live digital clock */}
        <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 px-3.5 py-1.5 rounded-xl font-mono text-xs text-slate-500 dark:text-slate-300 font-semibold shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>{time || '--:--:--'}</span>
        </div>

        {/* Tactical alerts notification count bell */}
        <div className="relative">
          <button 
            className={`p-2 rounded-xl border transition-all ${
              activeCriticalCount > 0
                ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-400 animate-pulse'
                : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <BellRing className="w-4 h-4" />
          </button>
          {activeCriticalCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-[9px] font-extrabold text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
              {activeCriticalCount}
            </span>
          )}
        </div>

        {/* Audio feedback simulator toggle */}
        <button
          onClick={() => setSoundEnabled(s => !s)}
          className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
          title={soundEnabled ? 'Mute Radio Feed' : 'Unmute Radio Feed'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

    </header>
  );
}
