"use client";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import type {
  CreateTruckData,
  TruckGalleryImage,
  TruckWithGallery,
  UpdateTruckData,
} from "@/types/truck.types";
import { getTruckGalleryImageUrl } from "@/lib/image-url";
import Image from "next/image";
import { getTruckFeaturedImageUrl } from "@/lib/image-url";
import { showAppToast } from "@/components/ui/app-toast";

interface TruckFormProps {
  mode: "create" | "edit";
  truck?: TruckWithGallery | null;
  isSubmitting: boolean;
  onSubmit: (
    data: CreateTruckData | UpdateTruckData,
    featuredImage?: File,
    galleryImages?: File[],
  ) => Promise<void>;
  onCancel: () => void;
  onDeleteGalleryImage?: (image: TruckGalleryImage) => Promise<void>;
}

export default function TruckForm({
  mode,
  truck = null,
  isSubmitting,
  onSubmit,
  onCancel,
  onDeleteGalleryImage,
}: TruckFormProps) {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | undefined>();
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<
    string | null
  >(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isDeletingGalleryImage, setIsDeletingGalleryImage] = useState<
    number | null
  >(null);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImagesInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (mode === "edit" && truck) {
      setName(truck.name);
      setYear(String(truck.year));
    } else {
      setName("");
      setYear("");
    }
    setFeaturedImage(undefined);
    setGalleryImages([]);
    setFeaturedImagePreview(null);
    setGalleryPreviews([]);
    setIsDeletingGalleryImage(null);
    if (featuredImageInputRef.current) {
      featuredImageInputRef.current.value = "";
    }
    if (galleryImagesInputRef.current) {
      galleryImagesInputRef.current.value = "";
    }
  }, [mode, truck]);
  useEffect(() => {
    if (!featuredImage) {
      setFeaturedImagePreview(null);
      return;
    }
    const previewUrl = URL.createObjectURL(featuredImage);
    setFeaturedImagePreview(previewUrl);
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [featuredImage]);
  useEffect(() => {
    const previewUrls = galleryImages.map((image) =>
      URL.createObjectURL(image),
    );
    setGalleryPreviews(previewUrls);
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [galleryImages]);
  const handleFeaturedImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setFeaturedImage(file);
  };
  const handleGalleryImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }
    setGalleryImages((currentImages) => [...currentImages, ...files]);
    event.target.value = "";
  };
  const removeFeaturedImage = () => {
    setFeaturedImage(undefined);
    if (featuredImageInputRef.current) {
      featuredImageInputRef.current.value = "";
    }
  };
  const removeGalleryImage = (index: number) => {
    setGalleryImages((currentImages) =>
      currentImages.filter((_, imageIndex) => imageIndex !== index),
    );
  };
  const handleDeleteExistingGalleryImage = async (image: TruckGalleryImage) => {
    if (!onDeleteGalleryImage || isDeletingGalleryImage !== null) {
      return;
    }
    setIsDeletingGalleryImage(image.id);
    try {
      await onDeleteGalleryImage(image);
    } finally {
      setIsDeletingGalleryImage(null);
    }
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedYear = Number(year);

    if (!name.trim()) {
      showAppToast("error", "Truck Name Is required.");
      return;
    }

    if (!year) {
      showAppToast("error", "Truck Year Is required.");
      return;
    }

    if (!Number.isInteger(parsedYear)) {
      showAppToast("error", "Truck Year Must Be a Valid Number.");
      return;
    }

    if (parsedYear < 1900 || parsedYear > 2100) {
      showAppToast("error", "Truck Year Must Be Between 1900 and 2100.");
      return;
    }

    const data =
      mode === "create"
        ? {
            name: name.trim(),
            year: parsedYear,
            featuredImage: null,
          }
        : {
            name: name.trim(),
            year: parsedYear,
            featuredImage: truck?.featuredImage ?? null,
          };
    await onSubmit(data, featuredImage, galleryImages);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="truck-name"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Truck Name
        </label>
        <input
          id="truck-name"
          name="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter truck name"
          disabled={isSubmitting}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors duration-300 placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
      <div>
        <label
          htmlFor="truck-year"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Year
        </label>
        <input
          id="truck-year"
          name="year"
          type="number"
          value={year}
          onChange={(event) => setYear(event.target.value)}
          placeholder="Enter truck year"
          disabled={isSubmitting}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors duration-300 placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label
            htmlFor="truck-featured-image"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Featured Image
          </label>
          {mode === "edit" && truck?.featuredImage && !featuredImage && (
            <span className="text-[10px] text-[var(--color-muted)]">
              Existing Featured Image
            </span>
          )}
        </div>
        <input
          ref={featuredImageInputRef}
          id="truck-featured-image"
          name="featuredImage"
          type="file"
          accept="image/*"
          onChange={handleFeaturedImageChange}
          disabled={isSubmitting}
          className="sr-only"
        />
        {featuredImagePreview ? (
          <div className="relative overflow-hidden rounded-xl border border-[var(--color-border)]">
            <img
              src={featuredImagePreview}
              alt="New featured image preview"
              className="h-48 w-full object-cover"
            />
            <button
              type="button"
              onClick={removeFeaturedImage}
              disabled={isSubmitting}
              aria-label="Remove featured image"
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white transition-colors duration-300 hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        ) : mode === "edit" && truck?.featuredImage ? (
          <div className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
            <Image
              src={getTruckFeaturedImageUrl(truck.id, truck.featuredImage)}
              alt={`${truck.name} featured image`}
              width={800}
              height={450}
              sizes="(max-width: 640px) 100vw, 800px"
              className="h-48 w-full object-cover"
            />
            <button
              type="button"
              onClick={() => featuredImageInputRef.current?.click()}
              disabled={isSubmitting}
              className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-300 hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Choose new image
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => featuredImageInputRef.current?.click()}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] px-4 py-7 text-sm text-[var(--color-muted)] transition-colors duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ImagePlus size={18} strokeWidth={1.8} />
            Choose featured image
          </button>
        )}
      </div>
      <div>
        <label
          htmlFor="truck-gallery-images"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Gallery Images
        </label>
        {mode === "edit" && truck && truck.gallery.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-[var(--color-muted)]">
              Existing Gallery Images
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {truck.gallery.map((image) => (
                <div
                  key={image.id}
                  className="relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)]"
                >
                  <Image
                    src={getTruckGalleryImageUrl(truck.id, image.imageName)}
                    alt={`${truck.name} gallery image`}
                    width={400}
                    height={400}
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="aspect-square w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingGalleryImage(image)}
                    disabled={isSubmitting || isDeletingGalleryImage !== null}
                    aria-label="Delete existing gallery image"
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white transition-colors duration-300 hover:bg-[var(--color-danger)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDeletingGalleryImage === image.id ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <X size={14} strokeWidth={2} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <input
          ref={galleryImagesInputRef}
          id="truck-gallery-images"
          name="galleryImages"
          type="file"
          accept="image/*"
          multiple
          onChange={handleGalleryImagesChange}
          disabled={isSubmitting}
          className="sr-only"
        />
        <button
          type="button"
          onClick={() => galleryImagesInputRef.current?.click()}
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] px-4 py-7 text-sm text-[var(--color-muted)] transition-colors duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ImagePlus size={18} strokeWidth={1.8} />
          Add gallery images
        </button>
        {galleryPreviews.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-[var(--color-muted)]">
              New Gallery Images
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {galleryPreviews.map((preview, index) => (
                <div
                  key={`${preview}-${index}`}
                  className="relative overflow-hidden rounded-lg border border-[var(--color-border)]"
                >
                  <img
                    src={preview}
                    alt={`Gallery preview ${index + 1}`}
                    className="aspect-square w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    disabled={isSubmitting}
                    aria-label={`Remove gallery image ${index + 1}`}
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white transition-colors duration-300 hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col-reverse gap-2 border-t border-[var(--color-border)] pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-muted)] transition-colors duration-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-[var(--color-primary-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Updating..."
            : mode === "create"
              ? "Create Truck"
              : "Update Truck"}
        </button>
      </div>
    </form>
  );
}
