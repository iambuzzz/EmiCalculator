'use client';

import React from 'react';
import { useWorkspace } from '@/lib/workspace-context';
import { calculateEMI, formatCurrency } from '@/lib/math';

export function CalculatorSummary({ emiOverride, totalInterestOverride, totalPayableOverride }) {
  const { state } = useWorkspace();
  
  const isControlled = emiOverride !== undefined;

  const emi = isControlled ? emiOverride : calculateEMI(state.amount, state.rate, state.tenure);
  const totalPayable = isControlled ? totalPayableOverride : emi * state.tenure;
  const totalInterest = isControlled ? totalInterestOverride : totalPayable - state.amount;

  const principalPercent = totalPayable > 0 ? (isControlled ? ((totalPayable - totalInterest) / totalPayable) : (state.amount / totalPayable)) * 100 : 0;
  const interestPercent = totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">
      <h2 className="text-lg font-semibold text-foreground mb-6">Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Monthly EMI</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(emi)}</p>
        </div>
        <div className="p-4 bg-muted/50 rounded-xl border border-border">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Interest</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalInterest)}</p>
        </div>
        <div className="p-4 bg-muted/50 rounded-xl border border-border">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Payable</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPayable)}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs font-medium text-muted-foreground mb-3">
          <span>Principal vs Interest</span>
          <span>{principalPercent.toFixed(1)}% / {interestPercent.toFixed(1)}%</span>
        </div>
        <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out" 
            style={{ width: `${principalPercent}%` }}
          />
          <div 
            className="h-full bg-orange-400 dark:bg-orange-500 transition-all duration-500 ease-out" 
            style={{ width: `${interestPercent}%` }}
          />
        </div>
        <div className="flex gap-6 mt-4 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span>Principal {formatCurrency(isControlled ? totalPayable - totalInterest : state.amount)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-400 dark:bg-orange-500" />
            <span>Interest {formatCurrency(totalInterest)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
