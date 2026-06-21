'use client';

import React from 'react';
import { useWorkspace } from '@/lib/workspace-context';
import { ModeSwitcher } from './mode-switcher';
import { CalculatorInputs } from './calculator-inputs';
import { CalculatorSummary } from './calculator-summary';
import { AmortizationSchedule } from './amortization-schedule';
import { SensitivityTable } from './sensitivity-table';
import { CompareMode } from './compare-mode';
import { PrepaymentMode } from './prepayment-mode';

export function MainContent() {
  const { state } = useWorkspace();

  return (
    <main className="max-w-7xl mx-auto w-full px-4 py-8 flex-1 space-y-8">
      <ModeSwitcher />

      {state.mode === 'single' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <CalculatorInputs />
            </div>
            <div className="lg:col-span-8 space-y-6">
              <CalculatorSummary />
              <SensitivityTable />
            </div>
          </div>
          <AmortizationSchedule />
        </div>
      )}

      {state.mode === 'compare' && (
        <CompareMode />
      )}

      {state.mode === 'prepayment' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <CalculatorInputs />
            </div>
            <div className="lg:col-span-8">
              <CalculatorSummary />
            </div>
          </div>
          <PrepaymentMode />
        </div>
      )}
      
      <p className="text-center text-xs text-muted-foreground mt-8">
        Open this page in a second tab — inputs, theme, and mode stay in sync via the BroadcastChannel API.
      </p>
    </main>
  );
}
