export function calculateEMI(principal, annualRate, tenureMonths) {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRate === 0) return principal / tenureMonths;

  const r = annualRate / 12 / 100;
  const n = tenureMonths;
  const factor = Math.pow(1 + r, n);
  
  const emi = (principal * r * factor) / (factor - 1);
  return Math.round(emi);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function generateAmortizationSchedule(
  principal, 
  annualRate, 
  tenureMonths,
  prepayments = []
) {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const schedule = [];
  
  let balance = principal;
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;
  let breakEvenMonth = -1;

  const prepaymentsByMonth = prepayments.reduce((acc, prepay) => {
    acc[prepay.month] = (acc[prepay.month] || 0) + prepay.amount;
    return acc;
  }, {});

  for (let month = 1; month <= tenureMonths; month++) {
    let prepaymentForMonth = prepaymentsByMonth[month] || 0;
    
    if (prepaymentForMonth > balance) {
      prepaymentForMonth = balance;
    }
    balance -= prepaymentForMonth;
    cumulativePrincipal += prepaymentForMonth;

    if (balance <= 0) {
      schedule.push({
        month,
        emi: 0,
        principalPaid: 0,
        interestPaid: 0,
        prepayment: prepaymentForMonth,
        balance: 0,
        isBreakEven: breakEvenMonth === -1 && cumulativePrincipal >= cumulativeInterest && cumulativeInterest > 0
      });
      break;
    }

    const interestPaid = (balance * annualRate) / 12 / 100;
    let principalPaid = emi - interestPaid;
    
    if (month === tenureMonths || balance - principalPaid <= 0) {
      principalPaid = balance;
    }
    
    balance -= principalPaid;
    if (balance < 0) balance = 0;

    cumulativePrincipal += principalPaid;
    cumulativeInterest += interestPaid;

    let isBreakEven = false;
    if (breakEvenMonth === -1 && cumulativePrincipal >= cumulativeInterest && cumulativeInterest > 0) {
      breakEvenMonth = month;
      isBreakEven = true;
    }

    schedule.push({
      month,
      emi: principalPaid + interestPaid,
      principalPaid,
      interestPaid,
      prepayment: prepaymentForMonth,
      balance,
      isBreakEven
    });
    
    if (balance <= 0) break;
  }

  return schedule;
}

export function generateSensitivityGrid(principal, currentRate, currentTenure) {
  const rateOffsets = [-3, -2, -1, 0, 1, 2, 3];
  const tenureOffsets = [-24, -12, -6, 0, 6, 12, 24];

  const rates = Array.from(new Set(rateOffsets.map(o => Math.max(1, Math.min(36, currentRate + o))))).sort((a,b) => a - b);
  const tenures = Array.from(new Set(tenureOffsets.map(o => Math.max(1, Math.min(84, currentTenure + o))))).sort((a,b) => a - b);

  const grid = [];

  for (const tenure of tenures) {
    const row = [];
    for (const rate of rates) {
      row.push({
        rate,
        tenure,
        emi: calculateEMI(principal, rate, tenure),
        isCurrent: rate === currentRate && tenure === currentTenure
      });
    }
    grid.push(row);
  }

  return grid;
}
