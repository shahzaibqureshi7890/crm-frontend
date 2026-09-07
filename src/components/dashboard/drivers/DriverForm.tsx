"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

import type {
  CreateDriverData,
  Driver,
  DriverStatus,
  UpdateDriverData,
} from "@/types/driver.types";

import type { TruckWithGallery } from "@/types/truck.types";

import { getImageUrl } from "@/lib/image-url";

import { showAppToast } from "@/components/ui/app-toast";

const formatDateForInput = (date: string | null): string => {
  if (!date) {
    return "";
  }
  return date.split("T")[0];
};

interface DriverFormProps {
  mode: "create" | "edit";
  driver?: Driver | null;
  trucks: TruckWithGallery[];
  isSubmitting: boolean;

  onSubmit: (
    data: CreateDriverData | UpdateDriverData,
    profileImage?: File,
  ) => Promise<void>;

  onCancel: () => void;
}

export default function DriverForm({
  mode,
  driver = null,
  trucks,
  isSubmitting,
  onSubmit,
  onCancel,
}: DriverFormProps) {
  const [truckId, setTruckId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [status, setStatus] = useState<DriverStatus>("active");

  const [profileImage, setProfileImage] = useState<File | undefined>();

  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null,
  );

  const profileImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === "edit" && driver) {
      setTruckId(driver.truckId === null ? "" : String(driver.truckId));

      setName(driver.name);
      setEmail(driver.email ?? "");
      setPhone(driver.phone);
      setLicenseNumber(driver.licenseNumber);
      setLicenseExpiry(formatDateForInput(driver.licenseExpiry));
      setStatus(driver.status);
    } else {
      setTruckId("");
      setName("");
      setEmail("");
      setPhone("");
      setLicenseNumber("");
      setLicenseExpiry("");
      setStatus("active");
    }

    setProfileImage(undefined);
    setProfileImagePreview(null);

    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = "";
    }
  }, [mode, driver]);

  useEffect(() => {
    if (!profileImage) {
      setProfileImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(profileImage);

    setProfileImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [profileImage]);

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setProfileImage(file);
  };

  const removeProfileImage = () => {
    setProfileImage(undefined);

    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      showAppToast("error", "Driver name is required.");
      return;
    }

    if (!phone.trim()) {
      showAppToast("error", "Phone number is required.");
      return;
    }

    if (!licenseNumber.trim()) {
      showAppToast("error", "License number is required.");
      return;
    }

    const parsedTruckId = truckId === "" ? null : Number(truckId);

    if (
      parsedTruckId !== null &&
      (!Number.isInteger(parsedTruckId) || parsedTruckId <= 0)
    ) {
      showAppToast("error", "Please select a valid truck.");
      return;
    }

    const data: CreateDriverData | UpdateDriverData = {
      truckId: parsedTruckId,
      name: name.trim(),
      email: email.trim() || null,
      phone: phone.trim(),
      licenseNumber: licenseNumber.trim(),
      licenseExpiry: licenseExpiry || null,
      status,
      profileImage: mode === "edit" ? (driver?.profileImage ?? null) : null,
    };

    await onSubmit(data, profileImage);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Image */}

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label
            htmlFor="driver-profile-image"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Profile Image
          </label>

          {mode === "edit" && driver?.profileImage && !profileImage && (
            <span className="text-[10px] text-[var(--color-muted)]">
              Existing Profile Image
            </span>
          )}
        </div>

        <input
          ref={profileImageInputRef}
          id="driver-profile-image"
          name="profileImage"
          type="file"
          accept="image/*"
          onChange={handleProfileImageChange}
          disabled={isSubmitting}
          className="sr-only"
        />

        {profileImagePreview ? (
          <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full border border-[var(--color-border)]">
            <img
              src={profileImagePreview}
              alt="New driver profile preview"
              className="h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={removeProfileImage}
              disabled={isSubmitting}
              aria-label="Remove profile image"
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors duration-300 hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={16} />
            </button>
          </div>
        ) : mode === "edit" && driver?.profileImage ? (
          <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full border border-[var(--color-border)]">
            <Image
              src={getImageUrl(
                `uploads/drivers/${driver.id}/profile/${driver.profileImage}`,
              )}
              alt={`${driver.name} profile`}
              width={160}
              height={160}
              sizes="160px"
              className="h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={() => profileImageInputRef.current?.click()}
              disabled={isSubmitting}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-300 hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Change
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => profileImageInputRef.current?.click()}
            disabled={isSubmitting}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] px-4 py-7 text-sm text-[var(--color-muted)] transition-colors duration-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ImagePlus size={22} strokeWidth={1.8} />
            Choose profile image
          </button>
        )}
      </div>

      {/* Driver Name */}

      <div>
        <label
          htmlFor="driver-name"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Driver Name
        </label>

        <input
          id="driver-name"
          name="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter driver name"
          disabled={isSubmitting}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors duration-300 placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {/* Email */}

      <div>
        <label
          htmlFor="driver-email"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Email
        </label>

        <input
          id="driver-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter email address"
          disabled={isSubmitting}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors duration-300 placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {/* Phone */}

      <div>
        <label
          htmlFor="driver-phone"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Phone
        </label>

        <input
          id="driver-phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Enter phone number"
          disabled={isSubmitting}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors duration-300 placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {/* Assigned Truck */}

      <div>
        <label
          htmlFor="driver-truck"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Assigned Truck
        </label>

        <select
          id="driver-truck"
          name="truckId"
          value={truckId}
          onChange={(event) => setTruckId(event.target.value)}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors duration-300 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">No truck assigned</option>

          {trucks.map((truck) => (
            <option key={truck.id} value={truck.id}>
              {truck.name} ({truck.year})
            </option>
          ))}
        </select>
      </div>

      {/* License Number */}

      <div>
        <label
          htmlFor="driver-license-number"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          License Number
        </label>

        <input
          id="driver-license-number"
          name="licenseNumber"
          type="text"
          value={licenseNumber}
          onChange={(event) => setLicenseNumber(event.target.value)}
          placeholder="Enter license number"
          disabled={isSubmitting}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors duration-300 placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {/* License Expiry */}

      <div>
        <label
          htmlFor="driver-license-expiry"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          License Expiry
        </label>

        <input
          id="driver-license-expiry"
          name="licenseExpiry"
          type="date"
          value={licenseExpiry}
          onChange={(event) => setLicenseExpiry(event.target.value)}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors duration-300 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {/* Status */}

      <div>
        <label
          htmlFor="driver-status"
          className="mb-2 block text-sm font-medium text-[var(--foreground)]"
        >
          Status
        </label>

        <select
          id="driver-status"
          name="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as DriverStatus)}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors duration-300 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="on_leave">On Leave</option>
        </select>
      </div>

      {/* Actions */}

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
              ? "Create Driver"
              : "Update Driver"}
        </button>
      </div>
    </form>
  );
}
