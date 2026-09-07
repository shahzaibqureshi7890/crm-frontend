const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) {
    return "";
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  return `${SERVER_URL}/${imagePath.replace(/^\/+/, "")}`;
};

export const getTruckFeaturedImageUrl = (
  truckId: number,
  imageName: string | null | undefined,
): string => {
  if (!imageName) {
    return "";
  }

  return getImageUrl(`uploads/trucks/${truckId}/featured/${imageName}`);
};

export const getTruckGalleryImageUrl = (
  truckId: number,
  imageName: string | null | undefined,
): string => {
  if (!imageName) {
    return "";
  }

  return getImageUrl(`uploads/trucks/${truckId}/gallery/${imageName}`);
};

export const getDriverProfileImageUrl = (
  driverId: number,
  imageName: string | null | undefined,
): string => {
  if (!imageName) {
    return "";
  }

  return getImageUrl(`uploads/drivers/${driverId}/profile/${imageName}`);
};
