"use client";
import { useEffect, useRef } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
type FleetStatus = "on-route" | "delayed" | "stopped";
type FleetMarker = {
  id: string;
  truck: string;
  driver: string;
  lat: number;
  lng: number;
  status: FleetStatus;
  lastUpdate: string;
  eta: string;
  location: string;
};

const fleetMarkers: FleetMarker[] = [
  {
    id: "truck-4821",
    truck: "#4821",
    driver: "Marcus Reyes",
    lat: 43.615,
    lng: -116.202,
    status: "stopped",
    lastUpdate: "47 min ago",
    eta: "2h 24m",
    location: "6th & Main St",
  },
  {
    id: "truck-2148",
    truck: "#2148",
    driver: "James Wilson",
    lat: 43.585,
    lng: -116.145,
    status: "delayed",
    lastUpdate: "47 min ago",
    eta: "3h 12m",
    location: "Southeast Boise",
  },
  {
    id: "truck-3192",
    truck: "#3192",
    driver: "Andre Foster",
    lat: 43.575,
    lng: -116.235,
    status: "on-route",
    lastUpdate: "47 min ago",
    eta: "1h 48m",
    location: "West Boise",
  },
  {
    id: "truck-4076",
    truck: "#4076",
    driver: "Maria Reyes",
    lat: 43.625,
    lng: -116.175,
    status: "on-route",
    lastUpdate: "22 min ago",
    eta: "1h 32m",
    location: "East Boise",
  },
  {
    id: "truck-5214",
    truck: "#5214",
    driver: "David Miller",
    lat: 43.555,
    lng: -116.185,
    status: "on-route",
    lastUpdate: "12 min ago",
    eta: "2h 05m",
    location: "South Boise",
  },
];

const clusters = [
  {
    count: 18,
    position: {
      lat: 43.635,
      lng: -116.245,
    },
  },
  {
    count: 23,
    position: {
      lat: 43.59,
      lng: -116.135,
    },
  },
];

const STATUS_COLORS: Record<FleetStatus, string> = {
  "on-route": "#439394",
  delayed: "#e9c88a",
  stopped: "#c95f69",
};

const STATUS_LABELS: Record<FleetStatus, string> = {
  "on-route": "On route",
  delayed: "Delayed",
  stopped: "Stopped",
};

export default function GoogleMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    const initializeMap = async () => {
      if (!mapRef.current) return;
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error("Google Maps API key is missing.");
        return;
      }
      setOptions({
        key: apiKey,
      });
      try {
        const mapsLibrary = await importLibrary("maps");
        const markerLibrary = await importLibrary("marker");
        if (cancelled || !mapRef.current) return;
        const Map = mapsLibrary.Map;
        const AdvancedMarkerElement = markerLibrary.AdvancedMarkerElement;
        const map = new Map(mapRef.current, {
          center: {
            lat: 43.6,
            lng: -116.19,
          },
          zoom: 11,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          mapId: "41418d697ece0f58e8303dfe",
        });
        let activePopup: any = null;
        const createFleetMarkerElement = (vehicle: FleetMarker) => {
          const element = document.createElement("div");
          const color = STATUS_COLORS[vehicle.status];
          element.style.width = "16px";
          element.style.height = "16px";
          element.style.borderRadius = "50%";
          element.style.backgroundColor = color;
          element.style.border = "2px solid #ffffff";
          element.style.boxSizing = "border-box";
          element.style.boxShadow = "0 2px 6px rgba(32, 36, 38, 0.28)";
          element.style.cursor = "pointer";
          element.style.transition =
            "transform 150ms ease, box-shadow 150ms ease";
          element.addEventListener("mouseenter", () => {
            element.style.transform = "scale(1.15)";
            element.style.boxShadow = "0 3px 9px rgba(32, 36, 38, 0.35)";
          });
          element.addEventListener("mouseleave", () => {
            element.style.transform = "scale(1)";
            element.style.boxShadow = "0 2px 6px rgba(32, 36, 38, 0.28)";
          });
          return element;
        };
        const createPopupElement = (vehicle: FleetMarker) => {
          const popup = document.createElement("div");
          popup.style.width = "220px";
          popup.style.padding = "13px 14px";
          popup.style.borderRadius = "10px";
          popup.style.backgroundColor = "#202426";
          popup.style.color = "#ffffff";
          popup.style.boxShadow = "0 8px 22px rgba(32, 36, 38, 0.30)";
          popup.style.fontFamily = "Arial, Helvetica, sans-serif";
          popup.style.boxSizing = "border-box";
          popup.style.pointerEvents = "none";
          const statusColor = STATUS_COLORS[vehicle.status];
          const statusLabel = STATUS_LABELS[vehicle.status];
          popup.innerHTML = `
            <div
              style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:12px;
              "
            >
              <span
                style="
                  font-size:13px;
                  font-weight:700;
                  color:#ffffff;
                  white-space:nowrap;
                "
              >
                ${vehicle.truck}
              </span>
              <span
                style="
                  font-size:10px;
                  font-weight:500;
                  color:${statusColor};
                  white-space:nowrap;
                "
              >
                ${statusLabel} · ${vehicle.lastUpdate}
              </span>
            </div>
            <div
              style="
                margin-top:10px;
                font-size:11px;
                line-height:1.45;
                color:#d8dcde;
              "
            >
              Driver: ${vehicle.driver}
            </div>
            <div
              style="
                margin-top:4px;
                font-size:11px;
                line-height:1.45;
                color:#d8dcde;
              "
            >
              Location: ${vehicle.location}
            </div>
            <div
              style="
                margin-top:4px;
                font-size:11px;
                line-height:1.45;
                color:#d8dcde;
              "
            >
              ETA: Depot 2 · ${vehicle.eta}
            </div>
          `;
          return popup;
        };
        const openPopup = (vehicle: FleetMarker) => {
          if (activePopup) {
            activePopup.map = null;
            activePopup = null;
          }
          const popupElement = createPopupElement(vehicle);
          activePopup = new AdvancedMarkerElement({
            map,
            position: {
              lat: vehicle.lat,
              lng: vehicle.lng,
            },
            title: `${vehicle.truck} - ${vehicle.driver}`,
            content: popupElement,
          });
        };
        fleetMarkers.forEach((vehicle) => {
          const markerElement = createFleetMarkerElement(vehicle);
          const marker = new AdvancedMarkerElement({
            map,
            position: {
              lat: vehicle.lat,
              lng: vehicle.lng,
            },
            title: `${vehicle.truck} - ${vehicle.driver}`,
            content: markerElement,
          });
          marker.addListener("click", () => {
            openPopup(vehicle);
          });
        });
        clusters.forEach((cluster) => {
          const clusterElement = document.createElement("div");
          clusterElement.style.width = "36px";
          clusterElement.style.height = "36px";
          clusterElement.style.borderRadius = "50%";
          clusterElement.style.backgroundColor = "#439394";
          clusterElement.style.border = "2px solid #ffffff";
          clusterElement.style.boxSizing = "border-box";
          clusterElement.style.boxShadow = "0 2px 7px rgba(32, 36, 38, 0.30)";
          clusterElement.style.display = "flex";
          clusterElement.style.alignItems = "center";
          clusterElement.style.justifyContent = "center";
          clusterElement.style.color = "#ffffff";
          clusterElement.style.fontSize = "12px";
          clusterElement.style.fontWeight = "700";
          clusterElement.style.cursor = "pointer";
          clusterElement.textContent = String(cluster.count);
          const clusterMarker = new AdvancedMarkerElement({
            map,
            position: cluster.position,
            title: `${cluster.count} vehicles`,
            content: clusterElement,
          });
          clusterMarker.addListener("click", () => {
            map.setZoom(12);
            map.panTo(cluster.position);
          });
        });
        openPopup(fleetMarkers[0]);
      } catch (error) {
        console.error("Failed to initialize Google Maps:", error);
      }
    };
    initializeMap();
    return () => {
      cancelled = true;
    };
  }, []);

  return <div ref={mapRef} className="h-full min-h-[280px] w-full" />;
}
