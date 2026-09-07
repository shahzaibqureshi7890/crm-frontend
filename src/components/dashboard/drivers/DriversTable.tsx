"use client";
import Image from "next/image";
import { Eye, Pencil, Trash2 } from "lucide-react";
import DataTable, {
  type DataTableColumn,
} from "@/components/ui/data-table/DataTable";
import type { Driver } from "@/types/driver.types";
import type { TruckWithGallery } from "@/types/truck.types";
import { getDriverProfileImageUrl } from "@/lib/image-url";
interface DriversTableProps {
  drivers: Driver[];
  trucks: TruckWithGallery[];
  isLoading?: boolean;
  onView: (driver: Driver) => void;
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
}
const getStatusLabel = (status: Driver["status"]): string => {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "on_leave":
      return "On Leave";
  }
};
const getStatusClassName = (status: Driver["status"]): string => {
  switch (status) {
    case "active":
      return "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]";
    case "inactive":
      return "bg-[var(--color-danger-light)] text-[var(--color-danger)]";
    case "on_leave":
      return "bg-[var(--color-warning-light)] text-[var(--color-warning-dark)]";
  }
};
const formatLicenseExpiry = (licenseExpiry: string | null): string => {
  if (!licenseExpiry) {
    return "Not provided";
  }
  const date = new Date(licenseExpiry);
  if (Number.isNaN(date.getTime())) {
    return licenseExpiry;
  }
  return date.toLocaleDateString();
};
export default function DriversTable({
  drivers,
  trucks,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
}: DriversTableProps) {
  const getAssignedTruck = (
    truckId: number | null,
  ): TruckWithGallery | undefined => {
    if (truckId === null) {
      return undefined;
    }
    return trucks.find((truck) => truck.id === truckId);
  };
  const columns: DataTableColumn<Driver>[] = [
    {
      key: "driver",
      header: "Driver",
      searchable: true,
      searchValue: (driver) =>
        `${driver.name} ${driver.email ?? ""} ${driver.phone}`,
      exportable: true,
      exportValue: (driver) => driver.name,
      render: (driver) => (
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-primary-light)]">
            {driver.profileImage ? (
              <Image
                src={getDriverProfileImageUrl(driver.id, driver.profileImage)}
                alt={driver.name}
                fill
                sizes="44px"
                className="object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-[var(--color-primary)]">
                {driver.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--foreground)]">
              {driver.name}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-[var(--color-muted)]">
              {driver.email || "No email provided"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      searchable: true,
      searchValue: (driver) => driver.phone,
      exportable: true,
      exportValue: (driver) => driver.phone,
      render: (driver) => (
        <span className="text-sm text-[var(--foreground)]">{driver.phone}</span>
      ),
    },
    {
      key: "truck",
      header: "Assigned Truck",
      searchable: true,
      searchValue: (driver) => {
        const truck = getAssignedTruck(driver.truckId);
        return truck ? `${truck.name} ${truck.year}` : "Not assigned";
      },
      exportable: true,
      exportValue: (driver) => {
        const truck = getAssignedTruck(driver.truckId);
        return truck ? `${truck.name} (${truck.year})` : "Not assigned";
      },
      render: (driver) => {
        const assignedTruck = getAssignedTruck(driver.truckId);
        return assignedTruck ? (
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              {assignedTruck.name}
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--color-muted)]">
              {assignedTruck.year}
            </p>
          </div>
        ) : (
          <span className="text-sm text-[var(--color-muted)]">
            Not assigned
          </span>
        );
      },
    },
    {
      key: "licenseNumber",
      header: "License Number",
      searchable: true,
      searchValue: (driver) => driver.licenseNumber,
      exportable: true,
      exportValue: (driver) => driver.licenseNumber,
      render: (driver) => (
        <span className="text-sm text-[var(--foreground)]">
          {driver.licenseNumber}
        </span>
      ),
    },
    {
      key: "licenseExpiry",
      header: "License Expiry",
      searchable: true,
      searchValue: (driver) => driver.licenseExpiry ?? "",
      exportable: true,
      exportValue: (driver) => formatLicenseExpiry(driver.licenseExpiry),
      render: (driver) => (
        <span className="text-sm text-[var(--color-muted)]">
          {formatLicenseExpiry(driver.licenseExpiry)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      searchable: true,
      searchValue: (driver) => getStatusLabel(driver.status),
      exportable: true,
      exportValue: (driver) => getStatusLabel(driver.status),
      render: (driver) => (
        <span
          className={`inline-flex rounded-md px-2 py-1 text-[10px] font-medium ${getStatusClassName(
            driver.status,
          )}`}
        >
          {getStatusLabel(driver.status)}
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
      render: (driver) => (
        <div className="flex w-full items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => onView(driver)}
            aria-label={`View ${driver.name}`}
            title="View"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors duration-300 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            <Eye size={15} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            onClick={() => onEdit(driver)}
            aria-label={`Edit ${driver.name}`}
            title="Edit"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors duration-300 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            <Pencil size={15} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(driver)}
            aria-label={`Delete ${driver.name}`}
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
      data={drivers}
      columns={columns}
      isLoading={isLoading}
      getRowKey={(driver) => driver.id}
      searchPlaceholder="Search drivers..."
      defaultPageSize={10}
      pageSizeOptions={[10, 25, 50, 100]}
      emptyMessage="No drivers found"
      emptyDescription="There are no drivers available yet. Create your first driver to get started."
      rowClassName={() =>
        "text-[10px] transition-colors duration-300 hover:bg-[var(--color-surface-soft)]"
      }
    />
  );
}
