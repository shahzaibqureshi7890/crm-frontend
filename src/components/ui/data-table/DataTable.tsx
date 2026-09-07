"use client";
import { type ReactNode, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  searchable?: boolean;
  searchValue?: (row: T) => string | number;
  exportable?: boolean;
  exportValue?: (row: T) => string | number;
  align?: "left" | "center" | "right";
  widthClassName?: string;
}
interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  searchPlaceholder?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  getRowKey: (row: T, index: number) => string | number;
  tableClassName?: string;
  rowClassName?: (row: T) => string;
  exportFileName?: string;
  showExportButtons?: boolean;
}
export default function DataTable<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "No records found",
  emptyDescription = "There are no records available.",
  searchPlaceholder = "Search...",
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
  getRowKey,
  tableClassName = "",
  rowClassName,
  exportFileName = "data",
  showExportButtons = true,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const searchableColumns = useMemo(
    () => columns.filter((column) => column.searchable !== false),
    [columns],
  );
  const exportableColumns = useMemo(
    () => columns.filter((column) => column.exportable !== false),
    [columns],
  );
  const getExportRows = () => {
    return filteredData.map((row) =>
      exportableColumns.reduce<Record<string, string | number>>(
        (result, column) => {
          if (!column.exportValue) {
            result[column.header] = "";
            return result;
          }
          result[column.header] = column.exportValue(row);
          return result;
        },
        {},
      ),
    );
  };
  const handleCopy = async () => {
    const rows = getExportRows();
    if (rows.length === 0) {
      return;
    }
    const headers = exportableColumns.map((column) => column.header);
    const text = [
      headers.join("\t"),
      ...rows.map((row) =>
        headers.map((header) => String(row[header] ?? "")).join("\t"),
      ),
    ].join("\n");
    await navigator.clipboard.writeText(text);
  };
  const handleExportCSV = () => {
    const rows = getExportRows();
    if (rows.length === 0) {
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exportFileName}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const handleExportExcel = () => {
    const rows = getExportRows();
    if (rows.length === 0) {
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${exportFileName}.xlsx`);
  };
  const handleExportPDF = () => {
    const rows = getExportRows();
    if (rows.length === 0) {
      return;
    }
    const headers = exportableColumns.map((column) => column.header);
    const body = rows.map((row) =>
      headers.map((header) => String(row[header] ?? "")),
    );
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    autoTable(doc, {
      head: [headers],
      body,
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fontSize: 8,
      },
    });
    doc.save(`${exportFileName}.pdf`);
  };

  const handlePrint = () => {
    const rows = getExportRows();

    if (rows.length === 0) {
      return;
    }

    const headers = exportableColumns.map((column) => column.header);

    const tableRows = rows
      .map(
        (row) => `
        <tr>
          ${headers
            .map(
              (header) =>
                `<td>${String(row[header] ?? "")
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;")
                  .replace(/'/g, "&#039;")}</td>`,
            )
            .join("")}
        </tr>
      `,
      )
      .join("");

    const tableHeaders = headers.map((header) => `<th>${header}</th>`).join("");

    const printWindow = window.open("", "_blank", "width=1200,height=800");

    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${exportFileName}</title>

        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            padding: 24px;
            color: #202426;
          }

          h1 {
            font-size: 20px;
            margin-bottom: 20px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            border: 1px solid #e7e9eb;
            padding: 10px 12px;
            text-align: left;
            font-size: 12px;
          }

          th {
            background: #f5f6f7;
            font-weight: 600;
          }

          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>

      <body>
        <h1>${exportFileName}</h1>

        <table>
          <thead>
            <tr>
              ${tableHeaders}
            </tr>
          </thead>

          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `);

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();

    printWindow.close();
  };

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return data;
    }
    return data.filter((row) =>
      searchableColumns.some((column) => {
        const value = column.searchValue
          ? column.searchValue(row)
          : column.render(row);
        if (typeof value !== "string" && typeof value !== "number") {
          return false;
        }
        return String(value).toLowerCase().includes(query);
      }),
    );
  }, [data, search, searchableColumns]);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pageItems = useMemo<(number | "...")[]>(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (safeCurrentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      "...",
      totalPages,
    ];
  }, [totalPages, safeCurrentPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, pageSize, safeCurrentPage]);
  const startEntry =
    filteredData.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endEntry = Math.min(safeCurrentPage * pageSize, filteredData.length);
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };
  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  };
  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };
  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };
  if (isLoading) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="flex min-h-[240px] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
            Loading...
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="search"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-9 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs text-[var(--foreground)] outline-none transition-colors duration-300 placeholder:text-[var(--color-muted)] hover:border-[var(--color-border-strong)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
            />
          </div>
          {showExportButtons && (
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopy}
                disabled={filteredData.length === 0}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-2 text-[10px] font-medium text-[var(--color-muted)] outline-none transition-colors duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={filteredData.length === 0}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-2 text-[10px] font-medium text-[var(--color-muted)] outline-none transition-colors duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                CSV
              </button>
              <button
                type="button"
                onClick={handleExportExcel}
                disabled={filteredData.length === 0}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-2 text-[10px] font-medium text-[var(--color-muted)] outline-none transition-colors duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Excel
              </button>
              <button
                type="button"
                onClick={handleExportPDF}
                disabled={filteredData.length === 0}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-2 text-[10px] font-medium text-[var(--color-muted)] outline-none transition-colors duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                PDF
              </button>
              <button
                type="button"
                onClick={handlePrint}
                disabled={filteredData.length === 0}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-2 text-[10px] font-medium text-[var(--color-muted)] outline-none transition-colors duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Print
              </button>
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2 text-xs text-[var(--color-muted)]">
          <span className="whitespace-nowrap">Show</span>
          <select
            value={pageSize}
            onChange={(event) =>
              handlePageSizeChange(Number(event.target.value))
            }
            className="h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 text-xs text-[var(--foreground)] outline-none transition-colors duration-300 hover:border-[var(--color-border-strong)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
            aria-label="Entries per page"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="whitespace-nowrap">entries</span>
        </div>
      </div>
      {filteredData.length === 0 ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
            <EmptyTableIcon />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-[var(--foreground)]">
            {emptyMessage}
          </h3>
          <p className="mt-1 max-w-sm text-xs leading-5 text-[var(--color-muted)]">
            {search
              ? "Try adjusting your search to find what you are looking for."
              : emptyDescription}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table
              className={`w-full min-w-[760px] border-collapse ${tableClassName}`}
            >
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-soft)]">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)] ${
                        column.align === "center"
                          ? "text-center"
                          : column.align === "right"
                            ? "text-right"
                            : "text-left"
                      } ${column.widthClassName ?? ""}`}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr
                    key={getRowKey(row, index)}
                    className={`border-b border-[var(--color-border)] last:border-b-0 ${
                      rowClassName ? rowClassName(row) : ""
                    }`}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-5 py-4 ${
                          column.align === "center"
                            ? "text-center"
                            : column.align === "right"
                              ? "text-right"
                              : "text-left"
                        } ${column.widthClassName ?? ""}`}
                      >
                        {column.render(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-[var(--color-border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-xs text-[var(--color-muted)]">
              Showing{" "}
              <span className="font-medium text-[var(--foreground)]">
                {startEntry}
              </span>{" "}
              to{" "}
              <span className="font-medium text-[var(--foreground)]">
                {endEntry}
              </span>{" "}
              of{" "}
              <span className="font-medium text-[var(--foreground)]">
                {filteredData.length}
              </span>{" "}
              entries
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={safeCurrentPage === 1}
                className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-muted)] outline-none transition-colors duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[var(--color-border)] disabled:hover:bg-transparent disabled:hover:text-[var(--color-muted)]"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {pageItems.map((item, index) =>
                  item === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex h-8 min-w-8 items-center justify-center px-1 text-xs text-[var(--color-muted)]"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCurrentPage(item)}
                      aria-label={`Go to page ${item}`}
                      aria-current={
                        safeCurrentPage === item ? "page" : undefined
                      }
                      className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2.5 text-xs font-semibold outline-none transition-colors duration-300 ${
                        safeCurrentPage === item
                          ? "bg-[var(--color-primary)] text-white"
                          : "border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]"
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
              <button
                type="button"
                onClick={goToNextPage}
                disabled={safeCurrentPage === totalPages}
                className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-muted)] outline-none transition-colors duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[var(--color-border)] disabled:hover:bg-transparent disabled:hover:text-[var(--color-muted)]"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
function EmptyTableIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 9h16M8 9v11M4 14h4M12 14h4M12 17h4"
      />
    </svg>
  );
}
