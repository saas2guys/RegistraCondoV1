
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
import { ServiceRecord } from "@/types";
import { Edit, Eye, FileText, MoreHorizontal, Trash, BarChart2 } from "lucide-react";
import { serviceCategoryLabels } from "@/mocks/data";
import { formatDate, formatPrice } from "@/lib/utils";

interface RecordsTableProps {
  records: ServiceRecord[];
  onEdit: (record: ServiceRecord) => void;
  onDelete: (id: string) => void;
  onViewDocument: (url: string) => void;
  onViewPriceHistory: (record: ServiceRecord) => void;
  sortBy: string;
  sortDirection: "asc" | "desc";
  onSortByField: (field: string) => void;
}

export function RecordsTable({
  records,
  onEdit,
  onDelete,
  onViewDocument,
  onViewPriceHistory,
  sortBy,
  sortDirection,
  onSortByField,
}: RecordsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Provider</TableHead>
            <TableHead className="min-w-[200px]">Description</TableHead>
            <TableHead
              className="w-[100px] cursor-pointer"
              onClick={() => onSortByField("price")}
            >
              Price {sortBy === "price" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="w-[120px] cursor-pointer"
              onClick={() => onSortByField("date")}
            >
              Date {sortBy === "date" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="w-[150px]">Added By</TableHead>
            <TableHead className="w-[100px]">Documents</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length > 0 ? (
            records.map((record) => (
              <TableRow 
                key={record.id} 
                className="cursor-pointer hover:bg-muted/80"
                onClick={() => onViewPriceHistory(record)}
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
                      <DropdownMenuItem onClick={() => onViewPriceHistory(record)}>
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
  );
}
