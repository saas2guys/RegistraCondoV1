
import { ServiceRecord } from "@/types";
import { formatDate, formatPrice } from "@/lib/utils";
import { User } from "lucide-react";

interface PriceHistoryTableProps {
  categoryHistory: ServiceRecord[];
}

export function PriceHistoryTable({ categoryHistory }: PriceHistoryTableProps) {
  return (
    <div className="mt-6">
      <h3 className="font-medium mb-2">Recent Prices</h3>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted border-b">
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Provider</th>
              <th className="py-2 px-4 text-left">Requested By</th>
              <th className="py-2 px-4 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {categoryHistory.length > 0 ? (
              categoryHistory.slice().reverse().map((item, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-2 px-4">{formatDate(item.date)}</td>
                  <td className="py-2 px-4">{formatPrice(item.price)}</td>
                  <td className="py-2 px-4">{item.serviceProvider.name}</td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      {item.requestedByUser?.name || "Unknown"}
                    </div>
                  </td>
                  <td className="py-2 px-4 max-w-[200px] truncate">{item.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 px-4 text-center text-muted-foreground">
                  No price history available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
