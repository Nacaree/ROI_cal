import { CircleDollarSign, Home, Target, WalletCards } from 'lucide-react'

// These values populate the calculator on first load or when saved data is invalid.
export const defaultInputs = {
  initialInvestment: 50000,
  unitCount: 1,
  monthlyRent: 2200,
  vacancyRate: 5,
  rentalTaxRate: 10,
  monthlyMaintenance: 250,
  monthlyUtilities: 100,
  requiredRevenueMode: 'profit',
  targetCashOnCashReturn: 8,
  targetMonthlyProfit: 333,
}

// Drives the entire input panel. Add/edit fields here instead of hard-coding
// form controls inside the React components.
export const inputSections = [
  {
    title: 'Investment',
    icon: Home,
    fields: [
      {
        key: 'initialInvestment',
        label: 'Initial investment',
        prefix: '$',
        slider: { min: 0, max: 500000, step: 2500 },
      },
    ],
  },
  {
    title: 'Income',
    icon: CircleDollarSign,
    fields: [
      {
        key: 'unitCount',
        label: 'Units',
        step: '1',
        slider: { min: 1, max: 100, step: 1 },
      },
      {
        key: 'monthlyRent',
        label: 'Monthly rent per unit',
        prefix: '$',
        slider: { min: 0, max: 10000, step: 50 },
      },
      {
        key: 'vacancyRate',
        label: 'Vacancy rate',
        suffix: '%',
        step: '0.1',
        slider: { min: 0, max: 30, step: 0.5 },
      },
    ],
  },
  {
    title: 'Expenses',
    icon: WalletCards,
    fields: [
      {
        key: 'rentalTaxRate',
        label: 'Rental tax rate',
        suffix: '%',
        step: '0.01',
        slider: { min: 0, max: 30, step: 0.05 },
      },
      {
        key: 'monthlyMaintenance',
        label: 'Maintenance',
        prefix: '$',
        slider: { min: 0, max: 3000, step: 25 },
      },
      {
        key: 'monthlyUtilities',
        label: 'Utilities',
        prefix: '$',
        slider: { min: 0, max: 2000, step: 25 },
      },
    ],
  },
  {
    title: 'Required Revenue',
    icon: Target,
    choice: {
      key: 'requiredRevenueMode',
      label: 'Target type',
      options: [
        { value: 'profit', label: 'Profit target' },
        { value: 'roi', label: 'ROI target' },
      ],
    },
    fields: [
      {
        key: 'targetMonthlyProfit',
        label: 'Target monthly profit',
        prefix: '$',
        slider: { min: 0, max: 5000, step: 25 },
        showWhen: { key: 'requiredRevenueMode', value: 'profit' },
      },
      {
        key: 'targetCashOnCashReturn',
        label: 'Target ROI',
        suffix: '%',
        step: '0.1',
        slider: { min: 0, max: 30, step: 0.5 },
        showWhen: { key: 'requiredRevenueMode', value: 'roi' },
      },
    ],
  },
]
