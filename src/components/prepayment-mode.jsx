'use client';

import React, { useState } from 'react';
import { useWorkspace } from '@/lib/workspace-context';
import { generateAmortizationSchedule, formatCurrency } from '@/lib/math';
import { Plus, X } from 'lucide-react';
import { AmortizationSchedule } from './amortization-schedule';

export function PrepaymentMode() {
  const { state, updateState } = useWorkspace();
  const [monthStr, setMonthStr] = useState('');
  const [amountStr, setAmountStr] = useState('');

  const handleAddPrepayment = (e) => {
    e.preventDefault();
    const month = parseInt(monthStr);
    const amount = parseFloat(amountStr);
    
    if (!month || !amount || month < 1 || month > state.tenure || amount <= 0) return;
    
    const newPrepayment = {
      id: Math.random().toString(36).substring(7),
      month,
      amount
    };

    updateState({
      prepayments: [...state.prepayments, newPrepayment].sort((a, b) => a.month - b.month)
    });
    
    setMonthStr('');
    setAmountStr('');
  };

  const removePrepayment = (id) => {
    updateState({
      prepayments: state.prepayments.filter(p => p.id !== id)
    });
  };

  const originalSchedule = React.useMemo(() => 
    generateAmortizationSchedule(state.amount, state.rate, state.tenure, []),
    [state.amount, state.rate, state.tenure]
  );
  
  const newSchedule = React.useMemo(() => 
    generateAmortizationSchedule(state.amount, state.rate, state.tenure, state.prepayments),
    [state.amount, state.rate, state.tenure, state.prepayments]
  );

  const originalInterest = originalSchedule.reduce((sum, row) => sum + row.interestPaid, 0);
  const newInterest = newSchedule.reduce((sum, row) => sum + row.interestPaid, 0);
  const interestSaved = originalInterest - newInterest;
  
  const originalMonths = originalSchedule.length;
  const newMonths = newSchedule.length;
  const monthsSaved = originalMonths - newMonths;

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Prepayment Planner</h2>
          <p className="text-sm text-muted-foreground">Schedule lump-sum payments and see interest saved</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleAddPrepayment} className="flex gap-4 items-end mb-6">
              <div className="flex-1 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Month</label>
                <input
                  type="number"
                  min="1"
                  max={state.tenure}
                  value={monthStr}
                  onChange={(e) => setMonthStr(e.target.value)}
                  placeholder={`1-${state.tenure}`}
                  className="w-full px-3 py-2 bg-muted border-none rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="100000"
                  className="w-full px-3 py-2 bg-muted border-none rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={!monthStr || !amountStr}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </form>

            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {state.prepayments.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8 border border-dashed border-border rounded-lg">
                  No prepayments yet. Add one above to see the impact.
                </div>
              ) : (
                state.prepayments.map((p) => (
                  <div key={p.id} className="flex justify-between items-center p-3 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium bg-background px-2 py-1 rounded shadow-sm">
                        Month {p.month}
                      </span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        +{formatCurrency(p.amount)}
                      </span>
                    </div>
                    <button onClick={() => removePrepayment(p.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-muted/30 rounded-xl border border-border p-6 flex flex-col justify-center space-y-6">
            <div className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Prepayment Impact
            </div>
            
            <div className="flex justify-between items-end border-b border-border/50 pb-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Interest Saved</div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(interestSaved)}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-end pb-2">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Tenure Reduced By</div>
                <div className="text-xl font-bold text-foreground">
                  {monthsSaved > 0 ? (
                    `${monthsSaved >= 12 && monthsSaved % 12 === 0 ? `${monthsSaved / 12} years` : `${monthsSaved} months`}`
                  ) : '—'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50 text-sm">
              <div>
                <span className="text-muted-foreground text-xs block mb-1">Original Tenure</span>
                <span className="font-medium">{originalMonths >= 12 && originalMonths % 12 === 0 ? `${originalMonths / 12} yr` : `${originalMonths} mo`}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block mb-1">New Tenure</span>
                <span className="font-bold text-primary">{newMonths >= 12 && newMonths % 12 === 0 ? `${newMonths / 12} yr` : `${newMonths} mo`}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block mb-1">Original Interest</span>
                <span className="font-medium">{formatCurrency(originalInterest)}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block mb-1">New Interest</span>
                <span className="font-bold text-primary">{formatCurrency(newInterest)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -top-3 left-6 bg-background px-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Adjusted Schedule
        </div>
        <div className="border border-border/50 rounded-2xl pt-2">
           <AmortizationSchedule />
        </div>
      </div>
    </div>
  );
}
