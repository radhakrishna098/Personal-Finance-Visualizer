
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from "@/types";

interface CategoryChartProps {
  transactions: Transaction[];
}

const CategoryChart = ({ transactions }: CategoryChartProps) => {
  // Group transactions by category and calculate totals
  const categoryData = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    
    if (!acc[category]) {
      acc[category] = {
        name: category,
        value: 0,
      };
    }

    acc[category].value += transaction.amount;
    return acc;
  }, {} as Record<string, { name: string; value: number }>);

  // Convert to array and sort by value
  const chartData = Object.values(categoryData).sort((a, b) => b.value - a.value);

  // Define colors for each category
  const COLORS = [
    '#3b82f6', // Blue
    '#ef4444', // Red
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#84cc16', // Lime
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-blue-600">
            Total: {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR'
            }).format(payload[0].value)}
          </p>
          <p className="text-sm text-gray-500">
            {((payload[0].value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
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
          <div className="text-sm">Add some transactions to see your category breakdown</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={60}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
