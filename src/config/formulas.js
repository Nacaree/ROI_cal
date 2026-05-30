export const calculationFormulas = [
  {
    label: "Gross monthly rent",
    formula: "Monthly rent per unit x Units",
  },
  {
    label: "Effective gross income",
    formula: "Monthly rent per unit x Units x (1 - Vacancy rate)",
  },
  {
    label: "Monthly rental tax",
    formula: "Effective gross income x Rental tax rate",
  },
  {
    label: "Operating expenses",
    formula: "Monthly rental tax + Maintenance + Utilities",
  },
  {
    label: "Total expenses",
    formula: "Maintenance + Utilities",
  },
  {
    label: "Net monthly income",
    formula: "Effective gross income - Operating expenses",
  },
  {
    label: "Monthly cash flow",
    formula: "Monthly NOI",
  },
  {
    label: "Cash-on-cash return",
    formula: "Annual cash flow / Initial investment",
  },
  {
    label: "Payback period",
    formula: "Initial investment / Annual cash flow",
  },
  {
    label: "Break-even rent per unit",
    formula: "Break-even gross revenue / Units",
  },
  {
    label: "Target monthly profit",
    formula: "Initial investment x Target ROI / 12",
  },
  {
    label: "Net required revenue",
    formula: "Total expenses + Target profit",
  },
  {
    label: "Gross required revenue",
    formula:
      "Net required revenue / ((1 - Vacancy rate) x (1 - Rental tax rate))",
  },
  {
    label: "Required rent per unit",
    formula: "Gross required revenue / Units",
  },
];
