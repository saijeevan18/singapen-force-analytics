'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Incident } from '@/data/incidents';
import { Send, Bot, User, HelpCircle, ShieldAlert, Sparkles, FileSpreadsheet, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
  incidentCards?: Incident[];
  isReport?: boolean;
}

interface AIAssistantProps {
  incidents: Incident[];
  onOpenIncident: (incident: Incident) => void;
}

export default function AIAssistant({ incidents, onOpenIncident }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am SFA Tactical Command Assistant. I can analyze active incidents, summarize dispatch queues, or compile report drafts.\n\nType **help** to see all available voice & terminal commands.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking and typing response
    setTimeout(() => {
      const response = processCommand(userText.toLowerCase());
      setMessages(prev => [...prev, {
        id: `msg-reply-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date(),
        incidentCards: response.incidentCards,
        isReport: response.isReport
      }]);
      setIsTyping(false);
    }, 1200);
  };

  const processCommand = (cmd: string): { text: string; incidentCards?: Incident[]; isReport?: boolean } => {
    const cleanCmd = cmd.trim();

    if (cleanCmd === 'help') {
      return {
        text: `Here are the operational commands I support:
        
• **show incidents** : Summarizes current tactical statistics in the field.
• **critical incidents** : Retrieves the top 5 active critical priority incidents.
• **generate report** : Compiles a downloadable daily incident summary.
• **clear** : Resets this secure console session.
        
You can also type a region name (e.g. *Chennai*, *Coimbatore*) to retrieve alerts for that zone.`
      };
    }

    if (cleanCmd === 'clear') {
      setTimeout(() => setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: "Secure console session reset. Ready for input.",
          timestamp: new Date()
        }
      ]), 100);
      return { text: "Clearing history..." };
    }

    if (cleanCmd === 'show incidents' || cleanCmd.includes('stats') || cleanCmd.includes('summary')) {
      const total = incidents.length;
      const active = incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length;
      const resolved = incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;
      const critical = incidents.filter(i => i.priority === 'Critical' && i.status !== 'Resolved' && i.status !== 'Closed').length;
      
      return {
        text: `📊 **SingaPen Force Tactical Summary:**
        
• **Total Logged:** ${total} incidents
• **Active Operations:** ${active} pending dispatches
• **Resolved/Closed:** ${resolved} incidents completed
• **Critical Alerts:** ${critical} high-priority situations active.
        
Situation Status: **STABLE** (Average response time is approximately 22 minutes).`
      };
    }

    if (cleanCmd === 'critical incidents' || cleanCmd.includes('critical') || cleanCmd.includes('alert')) {
      const criticals = incidents
        .filter(i => i.priority === 'Critical' && i.status !== 'Resolved' && i.status !== 'Closed')
        .slice(0, 5);

      if (criticals.length === 0) {
        return {
          text: "✅ Great news! There are currently no active **Critical** incidents flagged in the region."
        };
      }

      return {
        text: `🚨 **Identified ${criticals.length} Active Critical Incidents:**
Click on a card below to load details into the secondary console drawer:`,
        incidentCards: criticals
      };
    }

    if (cleanCmd === 'generate report' || cleanCmd.includes('report') || cleanCmd.includes('export')) {
      return {
        text: `📄 **Tactical Operations Report compiled.**
        
• **Document:** SFA_Daily_Report_${new Date().toISOString().split('T')[0]}.pdf
• **File Size:** 1.4 MB
• **Classification:** Confidential (Command level only)
        
Your secure download link has been generated below:`,
        isReport: true
      };
    }

    // Check if user entered a region name
    const matchedRegion = incidents.find(
      i => i.region.toLowerCase() === cleanCmd || cleanCmd.includes(i.region.toLowerCase())
    )?.region;

    if (matchedRegion) {
      const regionIncs = incidents.filter(
        i => i.region === matchedRegion && i.status !== 'Resolved' && i.status !== 'Closed'
      );
      const criticalCount = regionIncs.filter(i => i.priority === 'Critical').length;
      
      return {
        text: `📍 **Zone Report: ${matchedRegion}**
        
• **Active Incidents:** ${regionIncs.length} cases currently active.
• **Critical Risks:** ${criticalCount} critical alerts.
        
${regionIncs.length > 0 
  ? `Retrieving top alerts for ${matchedRegion}:` 
  : "No active incidents found in this sector. Area is secure."}`,
        incidentCards: regionIncs.slice(0, 3)
      };
    }

    // Fallback response
    return {
      text: `Sorry, I did not recognize the command: "${cleanCmd}".
      
Type **help** to view the list of available keywords or check active regions.`
    };
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 dark:bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Bot className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-sm font-bold text-white">SFA Command AI</h3>
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
            </div>
            <p className="text-[10px] text-slate-400">Secure Dispatch Copilot</p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'welcome',
                sender: 'ai',
                text: "Console session reset. Ready for input.",
                timestamp: new Date()
              }
            ]);
          }}
          className="p-1.5 text-slate-400 hover:text-white transition-colors hover:bg-slate-800 rounded-lg"
          title="Clear Chat Console"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Message Log */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-900/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2.5 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' 
                  ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-3">
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>

                {/* Render Incident Cards if attached */}
                {msg.incidentCards && msg.incidentCards.length > 0 && (
                  <div className="grid grid-cols-1 gap-2.5 mt-2">
                    {msg.incidentCards.map((inc) => (
                      <div
                        key={inc.id}
                        onClick={() => onOpenIncident(inc)}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 p-3 rounded-xl shadow-xs transition-all cursor-pointer flex justify-between items-center group text-left"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-[10px] font-mono font-bold text-slate-400">{inc.id}</span>
                            <span className={`text-[9px] font-semibold px-1 rounded ${
                              inc.priority === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400' :
                              inc.priority === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400' :
                              'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                            }`}>
                              {inc.priority}
                            </span>
                          </div>
                          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-200 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {inc.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            📍 {inc.region} • {inc.category}
                          </p>
                        </div>
                        <ShieldAlert className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors ml-2" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Render PDF Report download box */}
                {msg.isReport && (
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 border border-slate-700 p-4 rounded-xl shadow-md flex items-center justify-between text-left mt-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <FileSpreadsheet className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Daily Operations Digest</h4>
                        <p className="text-[10px] text-slate-400">SFA_Daily_Report_{new Date().toISOString().split('T')[0]}.pdf (1.4MB)</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert("Simulated Download Started: Daily Incident Report PDF compiled.")}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm shadow-blue-500/20"
                    >
                      Download
                    </button>
                  </div>
                )}

                <span className="block text-[9px] text-slate-400 dark:text-slate-500 mt-1 pl-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Typing bubble */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 px-4 py-3 rounded-2xl rounded-tl-none flex items-center space-x-1 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="bg-white dark:bg-slate-950 p-4 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type a command (e.g. "help", "show incidents", "critical")...'
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:text-white"
          />
          <div className="absolute right-3 top-2.5 text-slate-400 hover:text-blue-500 transition-colors cursor-pointer" title="Available keywords" onClick={() => setInput('help')}>
            <HelpCircle className="w-4 h-4" />
          </div>
        </div>

        <button
          type="submit"
          className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm shadow-blue-500/20 flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
