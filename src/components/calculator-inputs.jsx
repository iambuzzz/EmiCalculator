'use client';

import React from 'react';
import { useWorkspace } from '@/lib/workspace-context';

export function CalculatorInputs({ 
  amount, rate, tenure, onAmountChange, onRateChange, onTenureChange 
}) {
  const { state, updateState } = useWorkspace();

  const isControlled = amount !== undefined && onAmountChange !== undefined;
  
  const currentAmount = isControlled ? amount : state.amount;
  const currentRate = isControlled ? rate : state.rate;
  const currentTenure = isControlled ? tenure : state.tenure;

  const handleAmountChange = (val) => isControlled ? onAmountChange(val) : updateState({ amount: val });
  const handleRateChange = (val) => isControlled ? onRateChange(val) : updateState({ rate: val });
  const handleTenureChange = (val) => isControlled ? onTenureChange(val) : updateState({ tenure: val });

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col h-full">
      <div className="mb-6 lg:mb-10">
        <h2 className="text-lg font-semibold text-foreground">Loan Details</h2>
        <p className="text-sm text-muted-foreground">Adjust and watch every tab update</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-foreground">Loan Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
              <input
                type="number"
                value={currentAmount || ''}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                className="w-32 pl-7 pr-3 py-1.5 text-right bg-muted border-none rounded-lg text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>
          <input
            type="range"
            min="10000"
            max="5000000"
            step="10000"
            value={currentAmount}
            onChange={(e) => handleAmountChange(Number(e.target.value))}
            className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>₹10k</span>
            <span>₹50.00L</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-foreground">Interest Rate (p.a.)</label>
            <div className="relative">
              <input
                type="number"
                value={currentRate || ''}
                step="0.1"
                onChange={(e) => handleRateChange(Number(e.target.value))}
                className="w-24 pl-3 pr-7 py-1.5 text-right bg-muted border-none rounded-lg text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">%</span>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="36"
            step="0.1"
            value={currentRate}
            onChange={(e) => handleRateChange(Number(e.target.value))}
            className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>1%</span>
            <span>36%</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-foreground">Tenure</label>
            <div className="relative">
              <input
                type="number"
                value={currentTenure || ''}
                onChange={(e) => handleTenureChange(Number(e.target.value))}
                className="w-24 pl-3 pr-8 py-1.5 text-right bg-muted border-none rounded-lg text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">mo</span>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="84"
            step="1"
            value={currentTenure}
            onChange={(e) => handleTenureChange(Number(e.target.value))}
            className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>1 mo</span>
            <span>7 yr</span>
          </div>
        </div>
      </div>
    </div>
  );
}
