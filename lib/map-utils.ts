// /lib/map-utils.ts

import type { RefObject } from "react"

// Referencia global opcional para Leaflet
export let leafletMapRef: any = null
export let leafletMarkerRef: any = null

type LatLng = {
  latitude: number
  longitude: number
}

// Función para inicializar Leaflet en el mapa de envío a domicilio
export function initializeBranchMapLeaflet(
  containerId: string,
  initialPos: LatLng,
  onPositionChange?: (pos: LatLng) => void
) {
  if (!window.L) return null
  if (leafletMapRef) return { map: leafletMapRef, marker: leafletMarkerRef }

  const map = window.L.map(containerId).setView([initialPos.latitude, initialPos.longitude], 15)

  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  const marker = window.L.marker([initialPos.latitude, initialPos.longitude], { draggable: true }).addTo(map)

  const updateLocation = (lat: number, lng: number) => {
    if (onPositionChange) onPositionChange({ latitude: lat, longitude: lng })
  }

  map.on("click", (e: any) => {
    const { lat, lng } = e.latlng
    marker.setLatLng([lat, lng])
    updateLocation(lat, lng)
  })

  marker.on("dragend", () => {
    const { lat, lng } = marker.getLatLng()
    updateLocation(lat, lng)
  })

  leafletMapRef = map
  leafletMarkerRef = marker

  // Devolver referencias por si quieres usarlas directamente
  return { map, marker }
}

// Función opcional para Google Maps (sucursal)
export function initGoogleMap(containerRef: RefObject<HTMLDivElement>, position: LatLng) {
  if (!containerRef.current || !window.google) return

  const map = new window.google.maps.Map(containerRef.current, {
    zoom: 15,
    center: { lat: position.latitude, lng: position.longitude },
  })

  new window.google.maps.Marker({
    position: { lat: position.latitude, lng: position.longitude },
    map,
    title: "Sucursal Óptica Nuevo Estilo",
  })

  return map
}
