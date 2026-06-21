'use client';

import React, { useEffect } from 'react';
import { useWorkspace } from '@/lib/workspace-context';
import { calculateEMI, formatCurrency } from '@/lib/math';
import { Plus, X } from 'lucide-react';
import { CalculatorInputs } from './calculator-inputs';
import { CalculatorSummary } from './calculator-summary';

export function CompareMode() {
  const { state, updateState } = useWorkspace();

  useEffect(() => {
    if (state.scenarios.length === 0) {
      updateState({
        scenarios: [
          { id: '1', name: 'Scenario A', amount: state.amount, rate: state.rate, tenure: state.tenure },
          { id: '2', name: 'Scenario B', amount: state.amount, rate: state.rate + 1, tenure: state.tenure }
        ]
      });
    }
  }, []);

  const scenariosWithTotals = state.scenarios.map(sc => {
    const emi = calculateEMI(sc.amount, sc.rate, sc.tenure);
    const totalPayable = emi * sc.tenure;
    const totalInterest = totalPayable - sc.amount;
    return { ...sc, emi, totalPayable, totalInterest };
  });

  let bestScenarioId = null;
  if (scenariosWithTotals.length > 0) {
    const minPayable = Math.min(...scenariosWithTotals.map(s => s.totalPayable));
    const bestScenarios = scenariosWithTotals.filter(s => s.totalPayable === minPayable);
    if (bestScenarios.length === 1) {
      bestScenarioId = bestScenarios[0].id;
    }
  }

  const updateScenario = (id, updates) => {
    const newScenarios = state.scenarios.map(sc => sc.id === id ? { ...sc, ...updates } : sc);
    updateState({ scenarios: newScenarios });
  };

  const removeScenario = (id) => {
    updateState({ scenarios: state.scenarios.filter(sc => sc.id !== id) });
  };

  const addScenario = () => {
    if (state.scenarios.length >= 3) return;
    const newId = Math.random().toString(36).substring(7);
    const last = state.scenarios[state.scenarios.length - 1];
    updateState({
      scenarios: [
        ...state.scenarios,
        { id: newId, name: `Scenario ${String.fromCharCode(65 + state.scenarios.length)}`, amount: last.amount, rate: last.rate, tenure: last.tenure }
      ]
    });
  };

  if (state.scenarios.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Compare Scenarios</h2>
          <p className="text-sm text-muted-foreground">Configure up to 3 scenarios — the lowest total cost is highlighted.</p>
        </div>
        <button
          onClick={addScenario}
          disabled={state.scenarios.length >= 3}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors border border-border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Scenario
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {scenariosWithTotals.map((sc) => {
          const isBest = sc.id === bestScenarioId;
          
          return (
            <div 
              key={sc.id} 
              className={`relative rounded-xl border flex flex-col ${
                isBest ? 'border-green-500/50 bg-green-500/5 dark:bg-green-500/10 shadow-sm' : 'border-border bg-background'
              }`}
            >
              {isBest && (
                <div className="absolute -top-3 left-4 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                  Best Value
                </div>
              )}
              
              <div className="p-4 border-b border-border/50 flex justify-between items-center">
                <input
                  type="text"
                  value={sc.name}
                  onChange={(e) => updateScenario(sc.id, { name: e.target.value })}
                  className="bg-transparent border-none p-0 text-sm font-semibold focus:ring-0 w-32 outline-none"
                />
                {state.scenarios.length > 1 && (
                  <button onClick={() => removeScenario(sc.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="p-4 flex-1">
                <CalculatorInputs 
                  amount={sc.amount} 
                  rate={sc.rate} 
                  tenure={sc.tenure}
                  onAmountChange={(val) => updateScenario(sc.id, { amount: val })}
                  onRateChange={(val) => updateScenario(sc.id, { rate: val })}
                  onTenureChange={(val) => updateScenario(sc.id, { tenure: val })}
                />
              </div>

              <div className="p-4 border-t border-border/50 bg-muted/20 space-y-3 rounded-b-xl">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Monthly EMI</span>
                  <span className="font-bold text-primary">{formatCurrency(sc.emi)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Interest</span>
                  <span className="font-medium text-foreground">{formatCurrency(sc.totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Payable</span>
                  <span className={`font-bold ${isBest ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
                    {formatCurrency(sc.totalPayable)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
