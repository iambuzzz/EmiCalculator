'use client';

import React from 'react';
import { useWorkspace } from '@/lib/workspace-context';
import { Moon, Sun, MonitorSmartphone } from 'lucide-react';

export function Header() {
  const { tabId, activeTabsCount, state, updateState, isLeader } = useWorkspace();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-inner">
            <span className="text-primary-foreground font-bold text-lg">E</span>
          </div>
          <div>
            <h1 className="font-bold text-foreground leading-tight">EMI Workspace</h1>
            <p className="text-[10px] text-muted-foreground font-medium">Loan calculator - synced across tabs</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full border border-border/50">
            <span suppressHydrationWarning className="text-xs font-semibold text-muted-foreground">
              {tabId}
            </span>
            {isLeader && (
              <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm">
                Leader
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary rounded-full border border-primary/10">
            <MonitorSmartphone className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">
              {activeTabsCount} {activeTabsCount === 1 ? 'tab' : 'tabs'}
            </span>
          </div>

          <button
            onClick={() => updateState({ theme: state.theme === 'dark' ? 'light' : 'dark' })}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-border"
          >
            {state.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
        
      </div>
    </header>
  );
}
