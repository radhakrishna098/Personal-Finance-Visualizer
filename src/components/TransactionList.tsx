
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit3 } from "lucide-react";
import { Transaction } from "@/types";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const TransactionList = ({ transactions, onEdit, onDelete, loading }: TransactionListProps) => {
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food': 'bg-orange-100 text-orange-800',
      'Utilities': 'bg-blue-100 text-blue-800',
      'Rent': 'bg-purple-100 text-purple-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Entertainment': 'bg-green-100 text-green-800',
      'Transportation': 'bg-yellow-100 text-yellow-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Others': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors['Others'];
  };

  if (sortedTransactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No transactions yet</div>
        <div className="text-gray-500 text-sm">Add your first transaction to get started</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedTransactions.map((transaction) => (
        <Card key={transaction.id} className="transition-all hover:shadow-md border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {formatAmount(transaction.amount)}
                  </Badge>
                  <Badge className={getCategoryColor(transaction.category)}>
                    {transaction.category}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </span>
                </div>
                
                {transaction.description && (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {transaction.description}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(transaction)}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(transaction.id)}
                  disabled={loading}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TransactionList;
