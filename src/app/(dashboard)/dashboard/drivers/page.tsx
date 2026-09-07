"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import DriverForm from "@/components/dashboard/drivers/DriverForm";
import DriversTable from "@/components/dashboard/drivers/DriversTable";
import PageHeader from "@/components/dashboard/PageHeader";
import AppModal from "@/components/ui/app-modal";
import { useDrivers } from "@/hooks/use-drivers";
import { useTrucks } from "@/hooks/use-trucks";
import DriverStats from "@/components/dashboard/drivers/DriverStats";
import { getDriverProfileImageUrl } from "@/lib/image-url";
import type {
  CreateDriverData,
  Driver,
  UpdateDriverData,
} from "@/types/driver.types";
type FormMode = "create" | "edit";
export default function DriversPage() {
  const {
    drivers,
    isLoading,
    isSubmitting,
    fetchDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
  } = useDrivers();
  const { trucks, isLoading: isTrucksLoading, fetchTrucks } = useTrucks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [driverToView, setDriverToView] = useState<Driver | null>(null);
  useEffect(() => {
    fetchDrivers();
    fetchTrucks();
  }, [fetchDrivers, fetchTrucks]);
  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedDriver(null);
    setIsFormOpen(true);
  };
  const handleOpenEdit = (driver: Driver) => {
    setFormMode("edit");
    setSelectedDriver(driver);
    setIsFormOpen(true);
  };
  const handleCloseForm = () => {
    if (isSubmitting) {
      return;
    }
    setIsFormOpen(false);
    setSelectedDriver(null);
  };
  const handleDriverSubmit = async (
    data: CreateDriverData | UpdateDriverData,
    profileImage?: File,
  ) => {
    if (formMode === "create") {
      await createDriver(data as CreateDriverData, profileImage);
    } else if (selectedDriver) {
      await updateDriver(
        selectedDriver.id,
        data as UpdateDriverData,
        profileImage,
      );
    }
    setIsFormOpen(false);
    setSelectedDriver(null);
  };
  const handleView = (driver: Driver) => {
    setDriverToView(driver);
    setIsViewModalOpen(true);
  };
  const handleCloseView = () => {
    setIsViewModalOpen(false);
    setDriverToView(null);
  };
  const handleOpenDelete = (driver: Driver) => {
    setDriverToDelete(driver);
    setIsDeleteModalOpen(true);
  };
  const handleCloseDelete = () => {
    if (isSubmitting) {
      return;
    }
    setIsDeleteModalOpen(false);
    setDriverToDelete(null);
  };
  const handleConfirmDelete = async () => {
    if (!driverToDelete) {
      return;
    }
    await deleteDriver(driverToDelete.id);
    setIsDeleteModalOpen(false);
    setDriverToDelete(null);
  };
  const getAssignedTruckName = (truckId: number | null) => {
    if (!truckId) {
      return "Not assigned";
    }
    const truck = trucks.find((item) => item.id === truckId);
    return truck ? truck.name : `Truck #${truckId}`;
  };
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <PageHeader />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                Drivers
              </h1>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Manage your drivers and truck assignments.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-[var(--color-primary-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              Add Driver
            </button>
          </div>
          <DriverStats drivers={drivers} />
          <div className="mt-6">
            <DriversTable
              drivers={drivers}
              trucks={trucks}
              isLoading={isLoading}
              onView={handleView}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          </div>
        </div>
      </div>
      <AppModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={formMode === "create" ? "Create Driver" : "Edit Driver"}
        size="lg"
        closeOnOverlayClick={!isSubmitting}
        showCloseButton={!isSubmitting}
      >
        <DriverForm
          mode={formMode}
          driver={selectedDriver}
          trucks={trucks}
          isSubmitting={isSubmitting || isTrucksLoading}
          onSubmit={handleDriverSubmit}
          onCancel={handleCloseForm}
        />
      </AppModal>
      <AppModal
        isOpen={isViewModalOpen}
        onClose={handleCloseView}
        title="Driver Details"
        size="lg"
      >
        {driverToView && (
          <div className="space-y-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {driverToView.profileImage ? (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
                  <Image
                    src={getDriverProfileImageUrl(
                      driverToView.id,
                      driverToView.profileImage,
                    )}
                    alt={`${driverToView.name} profile image`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-2xl font-semibold text-[var(--color-muted)]">
                  {driverToView.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
                  Driver Name
                </p>
                <h2 className="mt-1 text-xl font-semibold text-[var(--foreground)]">
                  {driverToView.name}
                </h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {driverToView.email || "No email available"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
                <p className="text-xs font-medium text-[var(--color-muted)]">
                  Driver ID
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  #{driverToView.id}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
                <p className="text-xs font-medium text-[var(--color-muted)]">
                  Status
                </p>
                <p className="mt-1 text-sm font-semibold capitalize text-[var(--foreground)]">
                  {driverToView.status.replace("_", " ")}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
                <p className="text-xs font-medium text-[var(--color-muted)]">
                  Phone
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  {driverToView.phone}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
                <p className="text-xs font-medium text-[var(--color-muted)]">
                  Assigned Truck
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  {getAssignedTruckName(driverToView.truckId)}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
                <p className="text-xs font-medium text-[var(--color-muted)]">
                  License Number
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  {driverToView.licenseNumber}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
                <p className="text-xs font-medium text-[var(--color-muted)]">
                  License Expiry
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  {driverToView.licenseExpiry
                    ? new Date(driverToView.licenseExpiry).toLocaleDateString()
                    : "Not provided"}
                </p>
              </div>
            </div>
            <div className="flex justify-end border-t border-[var(--color-border)] pt-4">
              <button
                type="button"
                onClick={handleCloseView}
                className="rounded-lg border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-muted)] transition-colors duration-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </AppModal>
      <AppModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDelete}
        title="Delete Driver"
        size="sm"
        closeOnOverlayClick={!isSubmitting}
        showCloseButton={!isSubmitting}
      >
        <div>
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {driverToDelete?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCloseDelete}
              disabled={isSubmitting}
              className="rounded-lg border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-muted)] transition-colors duration-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className="rounded-lg bg-[var(--color-danger)] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-danger)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Deleting..." : "Delete Driver"}
            </button>
          </div>
        </div>
      </AppModal>
    </div>
  );
}
