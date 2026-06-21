# EMI Workspace

A collaborative Loan EMI Calculator where multiple browser tabs share the same calculator state in real-time without any backend server.

This project was built to simulate real-world patterns used in collaborative financial tools.

## Features

- **Core EMI Calculator**: Real-time synchronized sliders and number inputs for Loan Amount, Interest Rate, and Tenure.
- **Amortization Schedule**: Paginated month-by-month table showing principal, interest, and remaining balance. Highlights the Break-Even month. Includes a toggle to view the schedule as a Stacked Bar Chart.
- **Sensitivity Analysis**: A dynamic 7x7 grid showing how your EMI shifts if the interest rate or tenure changes slightly.
- **Compare Mode**: Evaluate up to 3 loan scenarios side-by-side. The option with the lowest total payable is automatically highlighted.
- **Prepayment Planner**: Schedule lump-sum payments and immediately see the adjusted schedule, tenure reduced, and interest saved.
- **Export to CSV**: Download your calculated amortization schedule instantly with one click.
- **Cross-Tab Synchronization**: Open the app in multiple browser tabs! Changes to inputs, themes, and modes in one tab instantly reflect across all other tabs using the `BroadcastChannel` API.
- **Tab Identity & Presence**: A built-in heartbeat mechanism counts the number of active tabs viewing the workspace in real-time.
- **Dark Mode**: Fully supports Dark and Light themes synced globally across all instances.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI/Styling**: Tailwind CSS v4, Lucide React (Icons)
- **State Management**: React Hooks + `BroadcastChannel` for Cross-Tab Sync
- **Charts**: Recharts

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To test the cross-tab sync, open the same URL in a second tab or window side-by-side.

## Evaluation Highlights

- **No Backend**: Complete state synchronization relies entirely on browser APIs (`BroadcastChannel`), maintaining speed and privacy.
- **Responsive & Premium UI**: Styled cleanly using Tailwind CSS with careful attention to layout expectations and micro-interactions.
- **Accurate Math**: EMI calculated precisely using the reducing-balance method. Floating point issues mitigated.

## License

MIT
