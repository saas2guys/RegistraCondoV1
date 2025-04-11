
import { TooltipProps } from "recharts";

export function CustomPriceTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 rounded-md shadow-md border">
        <p className="font-semibold">{label}</p>
        <p className="text-sm">
          Price: <span className="font-medium text-primary">{payload[0].payload.formattedPrice}</span>
        </p>
        <p className="text-sm text-muted-foreground max-w-[200px] truncate">
          {payload[0].payload.description}
        </p>
        <p className="text-sm mt-1">
          Requested by: <span className="font-medium">{payload[0].payload.requestedBy}</span>
        </p>
        <p className="text-sm">
          Provider: <span className="font-medium">{payload[0].payload.provider}</span>
        </p>
      </div>
    );
  }
  return null;
}

export function CustomCategoryTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 rounded-md shadow-md border">
        <p className="font-semibold">{label}</p>
        <p className="text-sm">
          Average Price: <span className="font-medium text-primary">{payload[0].payload.formattedPrice}</span>
        </p>
      </div>
    );
  }
  return null;
}

export function CustomFrequencyTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 rounded-md shadow-md border">
        <p className="font-semibold">{label}</p>
        <p className="text-sm">
          Service Requests: <span className="font-medium text-primary">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
}
