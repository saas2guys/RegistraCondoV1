
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServiceRecord, ServiceCategory } from "@/types";
import { Edit, Eye, FileText, MoreHorizontal, Trash, BarChart2 } from "lucide-react";
import { serviceCategoryLabels, serviceCategories } from "@/mocks/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { PriceHistoryModal } from "./PriceHistoryModal";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatDate, formatPrice } from "@/lib/utils";
import { RecordsPagination } from "./RecordsPagination";

interface ServiceRecordsTableProps {
  records: ServiceRecord[];
  onEdit: (record: ServiceRecord) => void;
  onDelete: (id: string) => void;
  onViewDocument: (url: string) => void;
}

export function ServiceRecordsTable({
  records,
  onEdit,
  onDelete,
  onViewDocument,
}: ServiceRecordsTableProps) {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<ServiceCategory[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ServiceRecord | undefined>();
  const [isPriceHistoryOpen, setIsPriceHistoryOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Get unique categories from records for the filter
  const categories = Array.from(
    new Set(records.map((record) => record.serviceProvider.category))
  );

  // Find min and max prices from records
  const prices = records.map(record => record.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 5000;

  // Update price range when records change
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  // Filter and sort records
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      search === "" ||
      record.description.toLowerCase().includes(search.toLowerCase()) ||
      record.serviceProvider.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(record.serviceProvider.category);

    const matchesPrice =
      record.price >= priceRange[0] && record.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortBy === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "price") {
      return sortDirection === "asc"
        ? a.price - b.price
        : b.price - a.price;
    } else {
      // Default to sorting by date
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  // Reset to first page when filters change or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategories, priceRange, sortBy, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  const handleCategoryToggle = (category: ServiceCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const viewPriceHistory = (record: ServiceRecord) => {
    setSelectedRecord(record);
    setIsPriceHistoryOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            >
              Filters {isFilterExpanded ? "▲" : "▼"}
            </Button>

            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="price">Sort by Price</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
            >
              {sortDirection === "asc" ? "↑" : "↓"}
            </Button>
            
            <Select
              value={recordsPerPage.toString()}
              onValueChange={(value) => {
                setRecordsPerPage(parseInt(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Records per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isFilterExpanded && (
          <div className="p-4 border rounded-md bg-background shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium mb-3">Filter by Category</h3>
                <div className="grid grid-cols-2 gap-2">
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

              <div>
                <h3 className="text-sm font-medium mb-3">Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</h3>
                <Slider
                  value={priceRange}
                  min={minPrice}
                  max={maxPrice}
                  step={10}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
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
                onClick={() => {
                  setSelectedCategories([]);
                  setPriceRange([minPrice, maxPrice]);
                }}
              >
                Reset Filters
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Showing {filteredRecords.length} of {records.length} records
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Provider</TableHead>
              <TableHead className="min-w-[200px]">Description</TableHead>
              <TableHead
                className="w-[100px] cursor-pointer"
                onClick={() => toggleSort("price")}
              >
                Price {sortBy === "price" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="w-[120px] cursor-pointer"
                onClick={() => toggleSort("date")}
              >
                Date {sortBy === "date" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="w-[150px]">Added By</TableHead>
              <TableHead className="w-[100px]">Documents</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRecords.length > 0 ? (
              currentRecords.map((record) => (
                <TableRow 
                  key={record.id} 
                  className="cursor-pointer hover:bg-muted/80"
                  onClick={() => viewPriceHistory(record)}
                >
                  <TableCell className="font-medium">
                    <div>
                      {record.serviceProvider.name}
                      <div className="text-xs text-muted-foreground">
                        {serviceCategoryLabels[record.serviceProvider.category]}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="truncate-2">
                      {record.description}
                    </div>
                  </TableCell>
                  <TableCell>{formatPrice(record.price)}</TableCell>
                  <TableCell>{formatDate(record.date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted overflow-hidden">
                        <img
                          src={record.createdByUser.avatar || ""}
                          alt={record.createdByUser.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="text-sm">{record.createdByUser.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.documentationUrl ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDocument(record.documentationUrl as string);
                        }}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewPriceHistory(record)}>
                          <BarChart2 className="mr-2 h-4 w-4" />
                          Price History
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(record)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {record.documentationUrl && (
                          <DropdownMenuItem onClick={() => 
                            onViewDocument(record.documentationUrl as string)
                          }>
                            <Eye className="mr-2 h-4 w-4" />
                            View Document
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => onDelete(record.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No records found matching the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {sortedRecords.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, sortedRecords.length)} of {sortedRecords.length} records
          </div>
          
          <RecordsPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Price History Modal */}
      <PriceHistoryModal
        isOpen={isPriceHistoryOpen}
        onOpenChange={setIsPriceHistoryOpen}
        record={selectedRecord}
      />
    </div>
  );
}
