"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import AppModal from "@/components/ui/app-modal";
import TruckForm from "@/components/dashboard/trucks/TruckForm";
import TruckStats from "@/components/dashboard/trucks/TruckStats";
import TruckTable from "@/components/dashboard/trucks/TruckTable";
import { useTrucks } from "@/hooks/use-trucks";
import PageHeader from "@/components/dashboard/PageHeader";

import {
  getTruckFeaturedImageUrl,
  getTruckGalleryImageUrl,
} from "@/lib/image-url";

import type {
  CreateTruckData,
  TruckGalleryImage,
  TruckWithGallery,
  UpdateTruckData,
} from "@/types/truck.types";

type FormMode = "create" | "edit";

export default function TrucksPage() {
  const {
    trucks,
    isLoading,
    isSubmitting,
    fetchTrucks,
    createTruck,
    updateTruck,
    deleteTruck,
    deleteGalleryImage,
  } = useTrucks();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [selectedTruck, setSelectedTruck] = useState<TruckWithGallery | null>(
    null,
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [truckToDelete, setTruckToDelete] = useState<TruckWithGallery | null>(
    null,
  );

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [truckToView, setTruckToView] = useState<TruckWithGallery | null>(null);

  useEffect(() => {
    fetchTrucks();
  }, [fetchTrucks]);

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedTruck(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (truck: TruckWithGallery) => {
    setFormMode("edit");
    setSelectedTruck(truck);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    if (isSubmitting) {
      return;
    }

    setIsFormOpen(false);
    setSelectedTruck(null);
  };

  const handleTruckSubmit = async (
    data: CreateTruckData | UpdateTruckData,
    featuredImage?: File,
    galleryImages?: File[],
  ) => {
    if (formMode === "create") {
      await createTruck(data as CreateTruckData, featuredImage, galleryImages);
    } else if (selectedTruck) {
      await updateTruck(
        selectedTruck.id,
        data as UpdateTruckData,
        featuredImage,
        galleryImages,
      );
    }

    setIsFormOpen(false);
    setSelectedTruck(null);
  };

  const handleDeleteGalleryImage = async (image: TruckGalleryImage) => {
    if (!selectedTruck) {
      return;
    }

    const updatedTruck = await deleteGalleryImage(selectedTruck.id, image.id);

    setSelectedTruck(updatedTruck);

    if (truckToView?.id === updatedTruck.id) {
      setTruckToView(updatedTruck);
    }
  };

  const handleView = (truck: TruckWithGallery) => {
    setTruckToView(truck);
    setIsViewModalOpen(true);
  };

  const handleCloseView = () => {
    setIsViewModalOpen(false);
    setTruckToView(null);
  };

  const handleOpenDelete = (truck: TruckWithGallery) => {
    setTruckToDelete(truck);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDelete = () => {
    if (isSubmitting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setTruckToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!truckToDelete) {
      return;
    }

    await deleteTruck(truckToDelete.id);

    setIsDeleteModalOpen(false);
    setTruckToDelete(null);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <PageHeader />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                Trucks
              </h1>

              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Manage your fleet trucks and their images.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-[var(--color-primary-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              Add Truck
            </button>
          </div>
          <TruckStats trucks={trucks} />
          <div className="mt-6">
            <TruckTable
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
        title={formMode === "create" ? "Create Truck" : "Edit Truck"}
        size="lg"
        closeOnOverlayClick={!isSubmitting}
        showCloseButton={!isSubmitting}
      >
        <TruckForm
          mode={formMode}
          truck={selectedTruck}
          isSubmitting={isSubmitting}
          onSubmit={handleTruckSubmit}
          onCancel={handleCloseForm}
          onDeleteGalleryImage={handleDeleteGalleryImage}
        />
      </AppModal>

      <AppModal
        isOpen={isViewModalOpen}
        onClose={handleCloseView}
        title="Truck Details"
        size="lg"
      >
        {truckToView && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
                Truck Name
              </p>

              <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                {truckToView.name}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
                <p className="text-xs font-medium text-[var(--color-muted)]">
                  Truck ID
                </p>

                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  #{truckToView.id}
                </p>
              </div>

              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
                <p className="text-xs font-medium text-[var(--color-muted)]">
                  Year
                </p>

                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  {truckToView.year}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
                Featured Image
              </p>

              {truckToView.featuredImage ? (
                <div className="relative mt-3 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
                  <Image
                    src={getTruckFeaturedImageUrl(
                      truckToView.id,
                      truckToView.featuredImage,
                    )}
                    alt={`${truckToView.name} featured image`}
                    width={800}
                    height={450}
                    sizes="(max-width: 640px) 100vw, 800px"
                    className="h-64 w-full object-cover"
                  />
                </div>
              ) : (
                <p className="mt-3 text-sm text-[var(--color-muted)]">
                  No featured image available.
                </p>
              )}
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
                Gallery Images
              </p>

              {truckToView.gallery.length === 0 ? (
                <p className="mt-3 text-sm text-[var(--color-muted)]">
                  No gallery images available.
                </p>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {truckToView.gallery.map((image) => (
                    <div
                      key={image.id}
                      className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)]"
                    >
                      <img
                        src={getTruckGalleryImageUrl(
                          truckToView.id,
                          image.imageName,
                        )}
                        alt={`${truckToView.name} gallery image`}
                        className="h-32 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
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
        title="Delete Truck"
        size="sm"
        closeOnOverlayClick={!isSubmitting}
        showCloseButton={!isSubmitting}
      >
        <div>
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {truckToDelete?.name}
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
              {isSubmitting ? "Deleting..." : "Delete Truck"}
            </button>
          </div>
        </div>
      </AppModal>
    </div>
  );
}
