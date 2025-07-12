
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction, Budget } from "@/types";

interface BudgetChartProps {
  transactions: Transaction[];
  budgets: Budget[];
}

const BudgetChart = ({ transactions, budgets }: BudgetChartProps) => {
  // Get current month
  const currentMonth = new Date().toISOString().slice(0, 7); // Format: "2025-07"

  // Calculate actual spending for current month by category
  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionMonth = transaction.date.slice(0, 7);
    return transactionMonth === currentMonth;
  });

  const actualSpending = currentMonthTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  // Get budgets for current month
  const currentMonthBudgets = budgets.filter(budget => budget.month === currentMonth);

  // Combine budget and actual data
  const chartData = currentMonthBudgets.map(budget => ({
    category: budget.category,
    budget: budget.budgetAmount,
    actual: actualSpending[budget.category] || 0,
    difference: budget.budgetAmount - (actualSpending[budget.category] || 0)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const budgetValue = payload.find((p: any) => p.dataKey === 'budget')?.value || 0;
      const actualValue = payload.find((p: any) => p.dataKey === 'actual')?.value || 0;
      const difference = budgetValue - actualValue;
      const isOverBudget = difference < 0;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-blue-600">
              Budget: {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(budgetValue)}
            </p>
            <p className="text-orange-600">
              Actual: {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(actualValue)}
            </p>
            <p className={isOverBudget ? 'text-red-600' : 'text-green-600'}>
              {isOverBudget ? 'Over by: ' : 'Remaining: '}
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(Math.abs(difference))}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-lg mb-2">No budget data</div>
          <div className="text-sm">Set some budgets to see your spending comparison</div>
        </div>
      </div>
    );
  }

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Budget vs Actual - {formatMonth(currentMonth)}
        </h3>
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="category" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="budget" 
              fill="#3b82f6"
              name="Budget"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="actual" 
              fill="#f59e0b"
              name="Actual"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetChart;
