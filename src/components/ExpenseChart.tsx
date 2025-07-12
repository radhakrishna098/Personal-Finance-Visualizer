
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from "@/types";

interface ExpenseChartProps {
  transactions: Transaction[];
}

const ExpenseChart = ({ transactions }: ExpenseChartProps) => {
  // Group transactions by month and calculate totals
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });

    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthLabel,
        total: 0,
      };
    }

    acc[monthKey].total += transaction.amount;
    return acc;
  }, {} as Record<string, { month: string; total: number }>);

  // Convert to array and sort by month
  const chartData = Object.values(monthlyData).sort((a, b) => {
    return a.month.localeCompare(b.month);
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            Total: {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR'
            }).format(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-lg mb-2">No data to display</div>
          <div className="text-sm">Add some transactions to see your spending trends</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
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
            dataKey="month" 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="total" 
            fill="url(#gradient)"
            radius={[4, 4, 0, 0]}
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
