
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ServiceProvider, ServiceCategory } from "@/types";
import { Edit, MoreHorizontal, Phone, Trash } from "lucide-react";
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
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

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
      categoryFilter === "all" || provider.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
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
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {serviceCategoryLabels[category as ServiceCategory]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
            <CardFooter className="flex justify-between pt-2">
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
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
