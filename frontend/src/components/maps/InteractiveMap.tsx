// src/components/maps/InteractiveMap.tsx
'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import * as turf from '@turf/turf';
import { MapPin, Loader, Navigation } from 'lucide-react';
import clsx from 'clsx';

// Import configuration
import { EVENT_DETAILS } from '@/constants/index';
import {
  CUK_COORDS,
  ROUTE_CITIES,
  DESTINATION_ADDRESS,
  DEFAULT_ZOOM,
  DEFAULT_PITCH,
} from '@/config/EVENT_DETAILS';

// Local constants
const ROUTE_SOURCE_ID = 'route-source';
const ROUTE_LAYER_ID = 'route-line';

type CoordinateTuple = [number, number];

const InteractiveMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any | null>(null);
  const geocoderContainerRef = useRef<HTMLDivElement | null>(null);

  const [origin, setOrigin] = useState<CoordinateTuple | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ duration: number; distance: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const travelMode: 'driving' = 'driving';

  const formatTime = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hr ${remainingMinutes} min`;
  };
  const formatDistance = (meters: number) => (meters / 1000).toFixed(0);

  const getRoute = useCallback(
    async (start: CoordinateTuple, end: CoordinateTuple) => {
      if (!mapRef.current) return;

      setIsLoading(true);
      setError(null);
      const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

      try {
        const resp = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/${travelMode}/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${accessToken}`
        );

        if (!resp.ok) throw new Error('Failed to fetch route. Check credentials or network.');

        const data = await resp.json();
        const route = data.routes && data.routes[0];
        if (!route) throw new Error('No driving route found between these points.');

        // Create GeoJSON feature from returned geometry
        const routeGeoJSON = turf.featureCollection([turf.feature(route.geometry)]);

        setRouteInfo({
          duration: route.duration,
          distance: route.distance,
        });

        const map = mapRef.current as any;

        // Remove existing route if present
        if (map.getLayer && map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID);
        if (map.getSource && map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID);

        map.addSource(ROUTE_SOURCE_ID, { type: 'geojson', data: routeGeoJSON });

        map.addLayer({
          id: ROUTE_LAYER_ID,
          type: 'line',
          source: ROUTE_SOURCE_ID,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#00D4FF',
            'line-width': 5,
            'line-opacity': 0.8,
          },
        });

        // Fit to route bbox
        const bbox = turf.bbox(routeGeoJSON);
        if (map.fitBounds) map.fitBounds(bbox as any, { padding: 80, duration: 1500 });
      } catch (err: any) {
        console.error('Routing error:', err);
        setError(err?.message || 'An unknown routing error occurred.');
        setRouteInfo(null);
      } finally {
        setIsLoading(false);
      }
    },
    [travelMode]
  );

  useEffect(() => {
    // Only run in browser and only once
    if (typeof window === 'undefined' || mapRef.current) return;

    let mapInstance: any = null;
    let removed = false;

    (async () => {
      try {
        const module = await import('mapbox-gl');
        const mapboxglDynamic = module?.default ?? module;

        // set access token
        mapboxglDynamic.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

        if (!mapContainerRef.current) return;

        mapInstance = new mapboxglDynamic.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: CUK_COORDS,
          zoom: DEFAULT_ZOOM,
          pitch: DEFAULT_PITCH,
          accessToken: mapboxglDynamic.accessToken,
          scrollZoom: false,
          dragRotate: false,
        });

        mapRef.current = mapInstance;

        mapInstance.on('load', () => {
          // CUK marker
          new mapboxglDynamic.Marker({ color: '#7C3AED' })
            .setLngLat(CUK_COORDS)
            .setPopup(
              new mapboxglDynamic.Popup().setHTML(`
                <h3 class="font-bold text-lg">${EVENT_DETAILS.name}</h3>
                <p class="text-sm">${DESTINATION_ADDRESS}</p>
              `)
            )
            .addTo(mapInstance);

          // Geocoder
          const geocoder = new MapboxGeocoder({
            accessToken: mapboxglDynamic.accessToken,
            mapboxgl: mapboxglDynamic as any,
            marker: false,
            placeholder: 'Search your origin address...',
            proximity: { longitude: CUK_COORDS[0], latitude: CUK_COORDS[1] },
          });

          // Add control to map then move element into custom container (if provided)
          mapInstance.addControl(geocoder, 'top-left');

          const geocoderElement = mapInstance.getContainer().querySelector('.mapboxgl-ctrl-geocoder');
          if (geocoderElement && geocoderContainerRef.current) {
            geocoderContainerRef.current.appendChild(geocoderElement as Node);
          }

          geocoder.on('result', (e: any) => {
            const coords = e.result.geometry.coordinates as CoordinateTuple;
            setOrigin(coords);
            setRouteInfo(null);
            getRoute(coords, CUK_COORDS);
          });

          // Navigation control
          mapInstance.addControl(new mapboxglDynamic.NavigationControl(), 'bottom-right');

          // Add city markers
          ROUTE_CITIES.forEach((city: any) => {
            const marker = new mapboxglDynamic.Marker({ color: '#FCD34D' })
              .setLngLat(city.coords as CoordinateTuple)
              .setPopup(
                new mapboxglDynamic.Popup({ offset: 25 }).setHTML(`
                  <div class="text-sm font-bold text-gray-900">${city.name}</div>
                  <div class="text-xs text-gray-700">
                    Click to see the driving route to CUK!
                  </div>
                `)
              )
              .addTo(mapInstance);

            // When popup opens, inject the Trace Route button and attach click handler
            marker.getElement().addEventListener('click', () => {
              // Slight delay to ensure popup DOM is created
              setTimeout(() => {
                const popupEl = document.querySelector('.mapboxgl-popup-content');
                if (!popupEl) return;

                // Insert button if not already present
                if (!popupEl.querySelector('.route-click-btn')) {
                  const btn = document.createElement('button');
                  btn.className = 'route-click-btn text-brand-neon hover:text-brand-purple underline text-xs';
                  btn.textContent = 'Trace Route';
                  btn.onclick = () => {
                    getRoute(city.coords as CoordinateTuple, CUK_COORDS);
                    // close all popups
                    const popups = document.querySelectorAll('.mapboxgl-popup');
                    popups.forEach(p => (p as HTMLElement).remove());
                  };
                  popupEl.appendChild(btn);
                }
              }, 100);
            });
          });
        });
      } catch (err) {
        console.error('Map init error:', err);
        setError('Failed to initialize the map.');
      }
    })();

    // cleanup
    return () => {
      removed = true;
      if (mapInstance) mapInstance.remove();
      mapRef.current = null;
    };
  }, [getRoute]);

  return (
    <>
      {/* Load CSS via CDN to avoid module resolution issues during build */}
      <link
        rel="stylesheet"
        href="https://api.mapbox.com/mapbox-gl-js/v3.4.0/mapbox-gl.css"
        key="mapbox-css-main"
      />
      <link
        rel="stylesheet"
        href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.1.0/mapbox-gl-geocoder.css"
        key="mapbox-css-geocoder"
      />

      {/* Geocoder Input Container */}
      <div
        ref={geocoderContainerRef}
        className="geocoder-custom-wrapper relative z-10 p-4 bg-brand-dark/80 rounded-b-xl border border-t-0 border-brand-neon/50"
      >
        {/* Mapbox Geocoder UI will be injected here */}
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[60vh] md:h-[70vh] rounded-xl shadow-2xl shadow-brand-purple/40 border-2 border-brand-neon mt-4">
        <div
          ref={mapContainerRef}
          className="w-full h-full"
          style={{ filter: 'grayscale(0.3) contrast(1.1) brightness(1.1)' }}
        />

        {/* Route Details Overlay */}
        <div className="absolute bottom-4 right-4 bg-gray-800/90 text-white p-4 rounded-lg shadow-xl max-w-xs transition duration-300 border border-brand-purple/50">
          <h3 className="text-lg font-bold mb-1 border-b border-brand-neon/50 pb-1 text-brand-neon">
            <Navigation className="w-4 h-4 inline mr-2" /> Route Details
          </h3>

          {error ? (
            <p className="text-red-400 text-sm font-sans">{error}</p>
          ) : (
            <>
              {routeInfo && (
                <div className="mt-2 font-sans">
                  <p className="text-sm text-gray-400">Destination: CUK</p>
                  <p className="text-2xl font-extrabold text-white leading-none mt-1">
                    {formatDistance(routeInfo.distance)} km
                  </p>
                  <p className="text-sm font-semibold text-brand-neon/90">
                    {formatTime(routeInfo.duration)} Driving Time
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Current mode: Easiest Driving Route</p>
                </div>
              )}
              {!routeInfo && !isLoading && (
                <p className="text-sm text-gray-400 font-sans">
                  Click a city marker or use the search bar to trace a route.
                </p>
              )}
              {isLoading && (
                <div className="flex items-center text-brand-neon text-sm">
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Calculating route...
                </div>
              )}
            </>
          )}
        </div>

        {/* CUK Title Card */}
        <div className="absolute top-4 right-4 bg-gray-800/90 text-white p-3 rounded-lg shadow-xl border border-brand-purple/50">
          <h3 className="text-lg font-bold text-white">{EVENT_DETAILS.name}</h3>
          <p className="text-xs text-brand-neon">Host: Central University of Karnataka</p>
        </div>
      </div>
    </>
  );
};

export default InteractiveMap;
