
import { RecordsPagination } from "./RecordsPagination";

interface RecordsPaginationInfoProps {
  currentPage: number;
  recordsPerPage: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
}

export function RecordsPaginationInfo({
  currentPage,
  recordsPerPage,
  totalRecords,
  onPageChange,
}: RecordsPaginationInfoProps) {
  // Calculate pagination info
  const indexOfFirstRecord = (currentPage - 1) * recordsPerPage + 1;
  const indexOfLastRecord = Math.min(currentPage * recordsPerPage, totalRecords);
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  if (totalRecords === 0) return null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground">
        Showing {indexOfFirstRecord} to {indexOfLastRecord} of {totalRecords} records
      </div>
      
      <RecordsPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
