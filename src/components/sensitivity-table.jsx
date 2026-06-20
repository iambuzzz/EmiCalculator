'use client';

import React from 'react';
import { useWorkspace } from '@/lib/workspace-context';
import { generateSensitivityGrid, formatCurrency } from '@/lib/math';

export function SensitivityTable() {
  const { state } = useWorkspace();
  
  const grid = React.useMemo(() => 
    generateSensitivityGrid(state.amount, state.rate, state.tenure),
    [state.amount, state.rate, state.tenure]
  );

  if (grid.length === 0 || grid[0].length === 0) return null;

  const rates = grid[0].map(cell => cell.rate);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Sensitivity Analysis</h2>
        <p className="text-sm text-muted-foreground">EMI across rate × tenure — current values highlighted</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] text-muted-foreground uppercase bg-muted/50 border-b border-border">
            <tr>
              <th className="px-3 py-2.5 font-medium">Tenure ＼ Rate</th>
              {rates.map((rate, i) => (
                <th key={i} className="px-3 py-2.5 font-medium text-right">{rate.toFixed(1)}%</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                <td className="px-3 py-2.5 font-medium text-muted-foreground whitespace-nowrap">
                  {row[0].tenure >= 12 && row[0].tenure % 12 === 0 ? `${row[0].tenure / 12} yr` : `${row[0].tenure} mo`}
                </td>
                {row.map((cell, j) => (
                  <td 
                    key={j} 
                    className={`px-3 py-2.5 text-right transition-colors ${cell.isCurrent ? 'bg-primary text-primary-foreground font-bold shadow-inner' : ''}`}
                  >
                    {formatCurrency(cell.emi)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
