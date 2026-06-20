'use client';

import React, { useState } from 'react';
import { useWorkspace } from '@/lib/workspace-context';
import { generateAmortizationSchedule, formatCurrency } from '@/lib/math';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

export function AmortizationSchedule() {
  const { state } = useWorkspace();
  const [view, setView] = useState('table');
  const [page, setPage] = useState(0);
  const rowsPerPage = 12;

  const schedule = React.useMemo(() => 
    generateAmortizationSchedule(state.amount, state.rate, state.tenure, state.mode === 'prepayment' ? state.prepayments : []),
    [state.amount, state.rate, state.tenure, state.mode, state.prepayments]
  );

  const totalPages = Math.ceil(schedule.length / rowsPerPage);
  if (page >= totalPages && totalPages > 0) {
    setPage(totalPages - 1);
  }
  
  const paginatedSchedule = schedule.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const breakEvenMonth = schedule.find(row => row.isBreakEven)?.month || null;

  const handleExportCSV = () => {
    const headers = ['Month', 'EMI', 'Principal Paid', 'Interest Paid', 'Prepayment', 'Balance Remaining'];
    const csvContent = [
      headers.join(','),
      ...schedule.map(row => [
        row.month,
        row.emi.toFixed(2),
        row.principalPaid.toFixed(2),
        row.interestPaid.toFixed(2),
        row.prepayment.toFixed(2),
        row.balance.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'amortization-schedule.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Amortization Schedule</h2>
          <p className="text-sm text-muted-foreground">Month-by-month principal & interest breakdown</p>
        </div>
        
        <div className="flex items-center gap-4">
          {breakEvenMonth && (
            <span className="text-xs text-muted-foreground bg-primary/5 px-2 py-1 rounded">
              Break-even at <span className="font-semibold text-primary">month {breakEvenMonth}</span>
            </span>
          )}
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setView('table')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${view === 'table' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Table
            </button>
            <button
              onClick={() => setView('chart')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${view === 'chart' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Chart
            </button>
          </div>
          
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors border border-border"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {view === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium">Month</th>
                <th className="px-4 py-3 font-medium text-right">EMI</th>
                <th className="px-4 py-3 font-medium text-right">Principal</th>
                <th className="px-4 py-3 font-medium text-right">Interest</th>
                <th className="px-4 py-3 font-medium text-right">Prepayment</th>
                <th className="px-4 py-3 font-medium text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSchedule.map((row) => (
                <tr 
                  key={row.month} 
                  className={`border-b border-border/50 last:border-0 ${row.isBreakEven ? 'bg-primary/5' : 'hover:bg-muted/20'}`}
                >
                  <td className="px-4 py-3 font-medium">
                    {row.month}
                    {row.isBreakEven && <span className="ml-2 text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold uppercase">B/E</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{formatCurrency(row.emi)}</td>
                  <td className="px-4 py-3 text-right text-primary">{formatCurrency(row.principalPaid)}</td>
                  <td className="px-4 py-3 text-right text-orange-400">{formatCurrency(row.interestPaid)}</td>
                  <td className="px-4 py-3 text-right text-green-600 dark:text-green-400 font-medium">{row.prepayment > 0 ? formatCurrency(row.prepayment) : '—'}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-2">
              <span className="text-xs text-muted-foreground">
                Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, schedule.length)} of {schedule.length} months
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[400px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={schedule}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => `Month ${label}`}
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              <Bar dataKey="principalPaid" name="Principal" stackId="a" fill="var(--primary)" />
              <Bar dataKey="interestPaid" name="Interest" stackId="a" fill="#fb923c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
