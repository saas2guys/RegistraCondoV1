
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceCategory } from "@/types";
import { useState } from "react";

interface RecordsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortDirection: "asc" | "desc";
  onSortDirectionChange: () => void;
  recordsPerPage: number;
  onRecordsPerPageChange: (value: number) => void;
  isFilterExpanded: boolean;
  onToggleFilters: () => void;
}

export function RecordsFilterBar({
  search,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionChange,
  recordsPerPage,
  onRecordsPerPageChange,
  isFilterExpanded,
  onToggleFilters,
}: RecordsFilterBarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Search records..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline"
            onClick={onToggleFilters}
          >
            Filters {isFilterExpanded ? "▲" : "▼"}
          </Button>

          <Select
            value={sortBy}
            onValueChange={onSortByChange}
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
            onClick={onSortDirectionChange}
          >
            {sortDirection === "asc" ? "↑" : "↓"}
          </Button>
          
          <Select
            value={recordsPerPage.toString()}
            onValueChange={(value) => onRecordsPerPageChange(parseInt(value))}
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
    </div>
  );
}
