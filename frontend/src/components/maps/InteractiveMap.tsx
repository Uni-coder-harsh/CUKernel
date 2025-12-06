// src/components/maps/InteractiveMap.tsx
'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
// 🛑 FIX: REMOVED CSS IMPORTS (mapbox-gl.css and mapbox-gl-geocoder.css)
// These CSS files MUST be imported in src/app/globals.css
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import * as turf from '@turf/turf';
import { MapPin, Loader, Navigation } from 'lucide-react';
import clsx from 'clsx';

// Import general event details from the centralized constants file
import { EVENT_DETAILS } from '@/constants/index'; 

// Import map-specific configuration from the config file
import { 
    CUK_COORDS, 
    ROUTE_CITIES, 
    DESTINATION_ADDRESS,
    DEFAULT_ZOOM,
    DEFAULT_PITCH
} from '@/config/EVENT_DETAILS';

// Mapbox Token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

// Define Map Layers/Sources
const ROUTE_SOURCE_ID = 'route-source';
const ROUTE_LAYER_ID = 'route-line';
type CoordinateTuple = [number, number];


// --- Interactive Map Component ---

const InteractiveMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const geocoderContainerRef = useRef<HTMLDivElement>(null);
  
  const [origin, setOrigin] = useState<CoordinateTuple | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ duration: number, distance: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Driving mode is the fixed "easiest way" mode as requested
  const travelMode: 'driving' = 'driving'; 

  // --- Helper to format duration/distance ---
  const formatTime = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hr ${remainingMinutes} min`;
  };
  const formatDistance = (meters: number) => (meters / 1000).toFixed(0);

  // --- 1. ROUTE CALCULATION FUNCTION (Driving Only) ---
  const getRoute = useCallback(async (
    start: CoordinateTuple, 
    end: CoordinateTuple, 
  ) => {
    if (!mapRef.current) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${travelMode}/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch route. Check coordinates or network.');

      const data = await response.json();
      const route = data.routes[0];

      if (!route) throw new Error('No driving route found.');
      
      const routeGeoJSON = turf.featureCollection([
        turf.feature(route.geometry),
      ]);
      
      setRouteInfo({
        duration: route.duration,
        distance: route.distance,
      });
      
      const map = mapRef.current as mapboxgl.Map;
      
      // Remove old route if exists
      if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID);
      if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID);

      // Add new route
      map.addSource(ROUTE_SOURCE_ID, { type: 'geojson', data: routeGeoJSON });
      
      map.addLayer({
        id: ROUTE_LAYER_ID,
        type: 'line',
        source: ROUTE_SOURCE_ID,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 
            'line-color': '#00D4FF', // Neon Blue Route Line
            'line-width': 5,
            'line-opacity': 0.8,
        },
      });
      
      // Fit map to the bounding box of the route
      const bbox = turf.bbox(routeGeoJSON);
      map.fitBounds(bbox as mapboxgl.LngLatBoundsLike, { padding: 80, duration: 1500 });

    } catch (err: any) {
      console.error("Routing error:", err);
      setError(err.message || 'An unknown routing error occurred.');
      setRouteInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- 2. MAP INITIALIZATION useEffect ---
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
    // Create the map instance
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Dark Map Style
      center: CUK_COORDS, // Center on CUK by default
      zoom: DEFAULT_ZOOM,
      pitch: DEFAULT_PITCH,
      accessToken: mapboxgl.accessToken,
      
      // UX FIX: Disable interactions that interfere with page scrolling
      scrollZoom: false, // Prevents map from hijacking scroll
      dragRotate: false,
      
    });

    mapRef.current = mapInstance;
    
    mapInstance.on('load', () => {
        // Add CUK Venue Marker
        new mapboxgl.Marker({ color: '#7C3AED' }) // Brand Purple Pin
          .setLngLat(CUK_COORDS)
          .setPopup(new mapboxgl.Popup().setHTML(`
            <h3 class="font-bold text-lg">${EVENT_DETAILS.name}</h3>
            <p class="text-sm">${DESTINATION_ADDRESS}</p>
          `))
          .addTo(mapInstance);

        // Initialize Geocoder
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl as any, 
            marker: false,
            placeholder: 'Search your origin address...',
            proximity: { longitude: CUK_COORDS[0], latitude: CUK_COORDS[1] } 
        });
        
        // Add geocoder control to map
        mapInstance.addControl(geocoder, 'top-left');

        // UX FIX: Move Geocoder UI from map container to custom container for styling/layout control
        const geocoderElement = mapInstance.getContainer().querySelector('.mapboxgl-ctrl-geocoder');
        if (geocoderElement && geocoderContainerRef.current) {
            geocoderContainerRef.current.appendChild(geocoderElement);
        }

        // Geocoder: Handle result event (user searches for an origin)
        geocoder.on('result', (e: { result: { geometry: { coordinates: CoordinateTuple } } }) => {
            const coords = e.result.geometry.coordinates;
            setOrigin(coords);
            setRouteInfo(null); 
            getRoute(coords, CUK_COORDS);
        });
        
        // Add basic navigation controls
        mapInstance.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        
        // 3. Add Fixed City Markers
        ROUTE_CITIES.forEach((city) => {
            const marker = new mapboxgl.Marker({ color: '#FCD34D' }) // Amber Pin
                .setLngLat(city.coords as CoordinateTuple)
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`
                        <div class="text-sm font-bold text-gray-900">${city.name}</div>
                        <div class="text-xs text-gray-700">
                            Click to see the driving route to CUK!
                        </div>
                    `)
                )
                .addTo(mapInstance);

            // Add event listener to the marker pin to trigger route calculation
            marker.getElement().addEventListener('click', () => {
                // Show the fixed distance/duration info in the popup immediately upon opening
                marker.getPopup().setHTML(`
                    <div class="text-sm font-bold text-gray-900">${city.name}</div>
                    <div class="text-xs text-gray-700">
                        <p class="font-semibold mt-1">Distance: ${city.distance}</p>
                        <p class="font-semibold">Time: ${city.duration}</p>
                        <p class="text-xs italic mb-1">(${city.summary})</p>
                        <button class="route-click-btn text-brand-neon hover:text-brand-purple underline text-xs">
                            Trace Route
                        </button>
                    </div>
                `);

                // Event listener to trigger route calculation on button click inside popup
                setTimeout(() => {
                    const button = document.querySelector('.route-click-btn');
                    if (button) {
                        button.addEventListener('click', () => {
                            getRoute(city.coords as CoordinateTuple, CUK_COORDS);
                            marker.getPopup().remove(); // Close popup after clicking trace
                        });
                    }
                }, 50); 
            });
        });

    });

    return () => {
        if (mapRef.current) mapRef.current.remove();
        mapRef.current = null;
    };
  }, [getRoute]);
  
  // 3. Render output
  return (
    <>
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
                // Aesthetic filter for a futuristic look
                style={{ filter: 'grayscale(0.3) contrast(1.1) brightness(1.1)' }} 
            />

            {/* Route Details Overlay */}
            <div className="absolute bottom-4 right-4 bg-gray-800/90 text-white p-4 rounded-lg shadow-xl max-w-xs transition duration-300 border border-brand-purple/50">
                <h3 className="text-lg font-bold mb-1 border-b border-brand-neon/50 pb-1 text-brand-neon">
                    <Navigation className='w-4 h-4 inline mr-2' /> Route Details
                </h3>
                
                {error ? (
                    <p className="text-red-400 text-sm font-sans">{error}</p>
                ) : (
                    <>
                        {routeInfo && (
                            <div className="mt-2 font-sans">
                                <p className="text-sm text-gray-400">Destination: CUK</p>
                                <p className="text-2xl font-extrabold text-white leading-none mt-1">{formatDistance(routeInfo.distance)} km</p>
                                <p className="text-sm font-semibold text-brand-neon/90">{formatTime(routeInfo.duration)} Driving Time</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Current mode: Easiest Driving Route
                                </p>
                            </div>
                        )}
                        {!routeInfo && !isLoading && (
                            <p className="text-sm text-gray-400 font-sans">
                                Click a city marker or use the search bar to trace a route.
                            </p>
                        )}
                         {isLoading && (
                            <div className='flex items-center text-brand-neon text-sm'>
                                <Loader className='w-5 h-5 animate-spin mr-2' />
                                Calculating route...
                            </div>
                        )}
                    </>
                )}
            </div>
            
            {/* CUK Title Card */}
            <div className="absolute top-4 right-4 bg-gray-800/90 text-white p-3 rounded-lg shadow-xl border border-brand-purple/50">
                <h3 className="text-lg font-bold text-white">
                    {EVENT_DETAILS.name}
                </h3>
                <p className="text-xs text-brand-neon">
                    Host: Central University of Karnataka
                </p>
            </div>
        </div>
    </>
  );
};

export default InteractiveMap;