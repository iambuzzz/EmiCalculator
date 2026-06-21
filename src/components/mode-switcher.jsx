'use client';

import React from 'react';
import { useWorkspace } from '@/lib/workspace-context';
import { Calculator, SplitSquareHorizontal, PiggyBank } from 'lucide-react';

export function ModeSwitcher() {
  const { state, updateState } = useWorkspace();

  return (
    <div className="flex justify-center sm:justify-start">
      <div className="inline-flex bg-card border border-border p-1 rounded-xl shadow-sm">
        <button
          onClick={() => updateState({ mode: 'single' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            state.mode === 'single' 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span className="hidden sm:inline">Single</span>
        </button>
        <button
          onClick={() => updateState({ mode: 'compare' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            state.mode === 'compare' 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <SplitSquareHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Compare</span>
        </button>
        <button
          onClick={() => updateState({ mode: 'prepayment' })}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            state.mode === 'prepayment' 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <PiggyBank className="w-4 h-4" />
          <span className="hidden sm:inline">Prepayment</span>
        </button>
      </div>
    </div>
  );
}
