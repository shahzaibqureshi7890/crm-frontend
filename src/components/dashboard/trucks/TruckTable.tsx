"use client";
import Image from "next/image";
import { Eye, Pencil, Trash2 } from "lucide-react";
import DataTable, {
  type DataTableColumn,
} from "@/components/ui/data-table/DataTable";
import type { TruckWithGallery } from "@/types/truck.types";
import { getTruckFeaturedImageUrl } from "@/lib/image-url";
interface TruckTableProps {
  trucks: TruckWithGallery[];
  isLoading?: boolean;
  onView: (truck: TruckWithGallery) => void;
  onEdit: (truck: TruckWithGallery) => void;
  onDelete: (truck: TruckWithGallery) => void;
}

export default function TruckTable({
  trucks,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
}: TruckTableProps) {
  const columns: DataTableColumn<TruckWithGallery>[] = [
    {
      key: "truck",
      header: "Truck",
      searchable: true,
      searchValue: (truck) => `${truck.name} ${truck.id}`,
      exportable: true,
      exportValue: (truck) => `${truck.name} (#${truck.id})`,
      render: (truck) => (
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
            {truck.featuredImage ? (
              <Image
                src={getTruckFeaturedImageUrl(truck.id, truck.featuredImage)}
                alt={truck.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[var(--color-muted)]">
                <TruckIcon />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--foreground)]">
              {truck.name}
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--color-muted)]">
              ID #{truck.id}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "year",
      header: "Year",
      searchable: true,
      searchValue: (truck) => truck.year,
      exportable: true,
      exportValue: (truck) => truck.year,
      render: (truck) => (
        <span className="text-sm text-[var(--foreground)]">{truck.year}</span>
      ),
    },
    {
      key: "gallery",
      header: "Gallery",
      searchable: false,
      exportable: true,
      exportValue: (truck) =>
        `${truck.gallery.length} ${
          truck.gallery.length === 1 ? "image" : "images"
        }`,
      render: (truck) => (
        <span className="inline-flex rounded-md bg-[var(--color-primary-light)] px-2 py-1 text-[10px] font-medium text-[var(--color-primary)]">
          {truck.gallery.length}{" "}
          {truck.gallery.length === 1 ? "image" : "images"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      searchable: false,
      exportable: false,
      align: "center",
      widthClassName: "w-[140px]",
      render: (truck) => (
        <div className="flex w-full items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => onView(truck)}
            aria-label={`View ${truck.name}`}
            title="View"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors duration-300 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            <Eye size={15} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            onClick={() => onEdit(truck)}
            aria-label={`Edit ${truck.name}`}
            title="Edit"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors duration-300 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            <Pencil size={15} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(truck)}
            aria-label={`Delete ${truck.name}`}
            title="Delete"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors duration-300 hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            <Trash2 size={15} strokeWidth={1.8} />
          </button>
        </div>
      ),
    },
  ];
  return (
    <DataTable
      data={trucks}
      columns={columns}
      isLoading={isLoading}
      getRowKey={(truck) => truck.id}
      searchPlaceholder="Search trucks..."
      defaultPageSize={10}
      pageSizeOptions={[10, 25, 50, 100]}
      emptyMessage="No trucks found"
      emptyDescription="There are no trucks available yet. Create your first truck to get started."
      rowClassName={() =>
        "text-[10px] transition-colors duration-300 hover:bg-[var(--color-surface-soft)]"
      }
    />
  );
}
function TruckIcon() {
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
        d="M3 7.5A1.5 1.5 0 0 1 4.5 6h10A1.5 1.5 0 0 1 16 7.5V15H3V7.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 10h2.2a1.5 1.5 0 0 1 1.2.6l1.6 2.1V15H16v-5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM18 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
      />
    </svg>
  );
}
