
import { ServiceRecord, ServiceCategory } from "@/types";
import { serviceCategoryLabels } from "@/mocks/data";
import { useState, useEffect } from "react";
import { PriceHistoryModal } from "./PriceHistoryModal";
import { RecordsFilterBar } from "./RecordsFilterBar";
import { RecordsFilterPanel } from "./RecordsFilterPanel";
import { RecordsTable } from "./RecordsTable";
import { RecordsPaginationInfo } from "./RecordsPaginationInfo";

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
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  // Event handlers
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

  const handleRecordsPerPageChange = (value: number) => {
    setRecordsPerPage(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([minPrice, maxPrice]);
  };

  return (
    <div className="space-y-4">
      <RecordsFilterBar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortDirection={sortDirection}
        onSortDirectionChange={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
        recordsPerPage={recordsPerPage}
        onRecordsPerPageChange={handleRecordsPerPageChange}
        isFilterExpanded={isFilterExpanded}
        onToggleFilters={() => setIsFilterExpanded(!isFilterExpanded)}
      />

      <RecordsFilterPanel
        isFilterExpanded={isFilterExpanded}
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onResetFilters={handleResetFilters}
        totalRecords={records.length}
        filteredCount={filteredRecords.length}
      />

      <RecordsTable
        records={currentRecords}
        onEdit={onEdit}
        onDelete={onDelete}
        onViewDocument={onViewDocument}
        onViewPriceHistory={viewPriceHistory}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByField={toggleSort}
      />
      
      <RecordsPaginationInfo
        currentPage={currentPage}
        recordsPerPage={recordsPerPage}
        totalRecords={sortedRecords.length}
        onPageChange={handlePageChange}
      />

      {/* Price History Modal */}
      <PriceHistoryModal
        isOpen={isPriceHistoryOpen}
        onOpenChange={setIsPriceHistoryOpen}
        record={selectedRecord}
      />
    </div>
  );
}
