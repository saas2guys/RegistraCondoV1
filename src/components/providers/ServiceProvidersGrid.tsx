
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ServiceProvider, ServiceCategory } from "@/types";
import { Edit, MoreHorizontal, Phone, Trash, InfoIcon } from "lucide-react";
import { serviceCategoryLabels } from "@/mocks/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";

interface ServiceProvidersGridProps {
  providers: ServiceProvider[];
  onEdit: (provider: ServiceProvider) => void;
  onDelete: (id: string) => void;
}

export function ServiceProvidersGrid({
  providers,
  onEdit,
  onDelete,
}: ServiceProvidersGridProps) {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<ServiceCategory[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Get unique categories from providers for the filter
  const categories = Array.from(
    new Set(providers.map((provider) => provider.category))
  );

  // Filter providers
  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      search === "" ||
      provider.name.toLowerCase().includes(search.toLowerCase()) ||
      (provider.address || "").toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(provider.category);

    return matchesSearch && matchesCategory;
  });

  const handleCategoryToggle = (category: ServiceCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder="Search providers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            >
              Filters {isFilterExpanded ? "▲" : "▼"}
            </Button>
          </div>
        </div>

        {isFilterExpanded && (
          <div className="p-4 border rounded-md bg-background shadow-sm">
            <div>
              <h3 className="text-sm font-medium mb-3">Filter by Category</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category}`} 
                      checked={selectedCategories.includes(category)} 
                      onCheckedChange={() => handleCategoryToggle(category as ServiceCategory)}
                    />
                    <Label htmlFor={`category-${category}`}>{serviceCategoryLabels[category as ServiceCategory]}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedCategories([]);
                }}
              >
                Reset Filters
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Showing {filteredProviders.length} of {providers.length} providers
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProviders.map((provider) => (
          <Card key={provider.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <Badge className="mb-2">{serviceCategoryLabels[provider.category]}</Badge>
                  <CardTitle>{provider.name}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(provider)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => onDelete(provider.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {provider.address && (
                <CardDescription>{provider.address}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="pb-2">
              {provider.notes && <p className="text-sm">{provider.notes}</p>}
            </CardContent>
            <CardFooter className="flex justify-between pt-2 flex-col items-start gap-2">
              <div className="flex w-full justify-between">
                {provider.phone ? (
                  <a
                    href={`tel:${provider.phone}`}
                    className="flex items-center text-sm text-primary hover:underline"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    {provider.phone}
                  </a>
                ) : (
                  <span></span>
                )}
                {provider.website && (
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Website
                  </a>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground border-t pt-2 w-full flex items-center justify-between">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-1 cursor-help">
                        <InfoIcon className="h-3 w-3" />
                        Added by {provider.createdByUser.name}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Created on {formatDate(provider.createdAt)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {provider.updatedByUser && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="flex items-center gap-1 cursor-help">
                          <InfoIcon className="h-3 w-3" />
                          Updated by {provider.updatedByUser.name}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Last updated on {formatDate(provider.updatedAt)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
