
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ServiceCategory } from "@/types";
import { formatPrice } from "@/lib/utils";
import { serviceCategoryLabels } from "@/mocks/data";

interface RecordsFilterPanelProps {
  isFilterExpanded: boolean;
  categories: string[];
  selectedCategories: ServiceCategory[];
  onCategoryToggle: (category: ServiceCategory) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
  onResetFilters: () => void;
  totalRecords: number;
  filteredCount: number;
}

export function RecordsFilterPanel({
  isFilterExpanded,
  categories,
  selectedCategories,
  onCategoryToggle,
  priceRange,
  onPriceRangeChange,
  minPrice,
  maxPrice,
  onResetFilters,
  totalRecords,
  filteredCount,
}: RecordsFilterPanelProps) {
  if (!isFilterExpanded) return null;

  return (
    <div className="p-4 border rounded-md bg-background shadow-sm">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium mb-3">Filter by Category</h3>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${category}`} 
                  checked={selectedCategories.includes(category as ServiceCategory)} 
                  onCheckedChange={() => onCategoryToggle(category as ServiceCategory)}
                />
                <Label htmlFor={`category-${category}`}>{serviceCategoryLabels[category as ServiceCategory]}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</h3>
          <Slider
            value={priceRange}
            min={minPrice}
            max={maxPrice}
            step={10}
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatPrice(minPrice)}</span>
            <span>{formatPrice(maxPrice)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onResetFilters}
        >
          Reset Filters
        </Button>
        
        <div className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalRecords} records
        </div>
      </div>
    </div>
  );
}
