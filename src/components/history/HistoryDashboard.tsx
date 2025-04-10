
import { PriceHistoryChart } from "./PriceHistoryChart";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { ServiceCostHighlights } from "./ServiceCostHighlights";

export function HistoryDashboard() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <PriceHistoryChart />
      </div>
      <div>
        <CategoryBreakdown />
      </div>
      <div className="lg:col-span-3">
        <ServiceCostHighlights />
      </div>
    </div>
  );
}
