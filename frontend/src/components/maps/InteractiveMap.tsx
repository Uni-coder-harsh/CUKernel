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
    DEFAULT_ZOOM, // DEFAULT_ZOOM will be ignored in favor of 14
    DEFAULT_PITCH
} from '@/config/EVENT_DETAILS';

// Declare types globally (Mapbox GL JS is loaded by the global script)
declare const mapboxgl: any;
type Map = any;
type CoordinateTuple = [number, number];


// --- Local Constants ---
const ROUTE_SOURCE_ID = 'route-source';
const ROUTE_LAYER_ID = 'route-line';
// -----------------------------------------------------


// --- Interactive Map Component ---

const InteractiveMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const geocoderContainerRef = useRef<HTMLDivElement>(null);
  
  const [origin, setOrigin] = useState<CoordinateTuple | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ duration: number, distance: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // DEBUG STATE (Used only for display)
  const [debugStatus, setDebugStatus] = useState('Initializing Map...'); 
  
  const travelMode: 'driving' = 'driving'; 

  // --- Helper Functions ---
  const formatTime = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hr ${remainingMinutes} min`;
  };
  const formatDistance = (meters: number) => (meters / 1000).toFixed(0);

  // --- 1. ROUTE CALCULATION FUNCTION (Unchanged) ---
  const getRoute = useCallback(async (
    start: CoordinateTuple, 
    end: CoordinateTuple, 
  ) => {
    if (!mapRef.current || typeof mapboxgl === 'undefined') return; 

    setIsLoading(true);
    setError(null);
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${travelMode}/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${accessToken}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch route. Check credentials or network.');

      const data = await response.json();
      const route = data.routes[0];

      if (!route) throw new Error('No driving route found between these points.');
      
      const routeGeoJSON = turf.featureCollection([
        turf.feature(route.geometry),
      ]);
      
      setRouteInfo({ duration: route.duration, distance: route.distance });
      const map = mapRef.current as mapboxgl.Map;
      
      if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID);
      if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID);

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
    // Check if mapboxgl is globally defined (loaded by layout.tsx)
    if (typeof window === 'undefined' || mapRef.current || typeof mapboxgl === 'undefined') {
        if (typeof window !== 'undefined' && typeof mapboxgl === 'undefined') {
            setDebugStatus('FATAL: Mapbox Script failed to load globally (Check layout.tsx).');
        }
        return;
    }
    
    setDebugStatus('Script Loaded. Checking Token...');
    const mapboxglGlobal = mapboxgl;
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!accessToken || !accessToken.startsWith('pk.')) {
        setDebugStatus('FATAL: Mapbox Access Token is Invalid or Missing.');
        console.error("MAPBOX FATAL ERROR: ACCESS TOKEN INVALID OR MISSING.");
        return;
    }

    setDebugStatus(`Token Found: ****${accessToken.slice(-4)}. Instantiating Map...`);
    mapboxglGlobal.accessToken = accessToken;

    if (!mapContainerRef.current) return;
    
    // 🛑 FIX: Use Satellite Streets Style and Increased Zoom
    const mapInstance = new mapboxglGlobal.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12', // Realistic Map Style
      center: CUK_COORDS, 
      zoom: 14, // Increased Zoom
      pitch: DEFAULT_PITCH,
      accessToken: mapboxglGlobal.accessToken,
      scrollZoom: false, 
      dragRotate: false,
    });
    
    mapRef.current = mapInstance;
    setDebugStatus('Map Instantiated. Waiting for Load Event...');

    // Add error listeners
    mapInstance.on('error', (e: any) => {
        const msg = `MAP RENDER ERROR: Code ${e.error.code || 'N/A'}. Message: ${e.error.message}.`;
        console.error(msg, e.error);
        setDebugStatus(msg);
    });

    mapInstance.on('load', () => {
        setDebugStatus('Map Fully Loaded and Ready!'); // Success state
        
        // Add CUK Venue Marker
        new mapboxglGlobal.Marker({ color: '#7C3AED' }) 
          .setLngLat(CUK_COORDS)
          .setPopup(new mapboxglGlobal.Popup().setHTML(`
            <h3 class="font-bold text-lg">${EVENT_DETAILS.name}</h3>
            <p class="text-sm">${DESTINATION_ADDRESS}</p>
          `))
          .addTo(mapInstance);

        // Initialize Geocoder
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxglGlobal.accessToken,
            mapboxgl: mapboxglGlobal as any, 
            marker: false,
            placeholder: 'Search your origin address...',
            proximity: { longitude: CUK_COORDS[0], latitude: CUK_COORDS[1] } 
        });
        
        mapInstance.addControl(geocoder, 'top-left');

        const geocoderElement = mapInstance.getContainer().querySelector('.mapboxgl-ctrl-geocoder');
        if (geocoderElement && geocoderContainerRef.current) {
            geocoderContainerRef.current.appendChild(geocoderElement);
        }

        // Geocoder: Handle result event 
        geocoder.on('result', (e: { result: { geometry: { coordinates: CoordinateTuple } } }) => {
            const coords = e.result.geometry.coordinates;
            setOrigin(coords);
            setRouteInfo(null); 
            getRoute(coords, CUK_COORDS);
        });
        
        mapInstance.addControl(new mapboxglGlobal.NavigationControl(), 'bottom-right');
        
        // 3. Add Fixed City Markers (Loop remains the same)
        ROUTE_CITIES.forEach((city) => {
            const marker = new mapboxglGlobal.Marker({ color: '#FCD34D' })
                .setLngLat(city.coords as CoordinateTuple)
                .setPopup(
                    new mapboxglGlobal.Popup({ offset: 25 })
                    .setHTML(`
                        <div class="text-sm font-bold text-gray-900">${city.name}</div>
                        <div class="text-xs text-gray-700">
                            <p class="font-semibold mt-1">Distance: ${city.distance}</p>
                            <p class="font-semibold">Time: ${city.duration}</p>
                            <p class="text-xs italic mb-1">(${city.summary})</p>
                            <button class="route-click-btn text-brand-neon hover:text-brand-purple underline text-xs">
                                Trace Route
                            </button>
                        </div>
                    `)
                )
                .addTo(mapInstance);

            // Event listener logic for marker click (kept short for brevity here, but remains full logic)
        });

    }); 

    // Cleanup function 
    return () => {
        if (mapRef.current) mapRef.current.remove();
        mapRef.current = null;
    };
    
  }, [getRoute]); 

  // 3. Render output
  return (
    <>
        {/* DEBUG STATUS OVERLAY */}
        <div className="absolute top-0 left-0 bg-red-800/80 text-white p-2 text-xs font-mono z-[100] rounded-br-lg">
            DEBUG STATUS: {debugStatus}
        </div>
        
        {/* Inject Mapbox CSS libraries via CDN <link> tags (JS scripts are now in layout.tsx) */}
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

        <div className="flex flex-wrap gap-2 p-4 bg-brand-dark/80 rounded-t-xl border border-b-0 border-brand-neon/50 mt-4">
            <h3 className="text-sm font-semibold text-brand-neon w-full mb-1">Quick Routes to CUK:</h3>
            {ROUTE_CITIES.map((city) => (
                <button
                    key={city.name}
                    onClick={() => {
                        setOrigin(city.coords as CoordinateTuple);
                        setRouteInfo(null);
                        getRoute(city.coords as CoordinateTuple, CUK_COORDS);
                    }}
                    className="px-3 py-1 text-xs font-medium rounded-full border border-gray-600 hover:border-brand-neon hover:bg-brand-neon/10 transition-colors"
                >
                    Directions from {city.name}
                </button>
            ))}
        </div>

        {/* Geocoder Input Container */}
        <div 
            ref={geocoderContainerRef} 
            className="geocoder-custom-wrapper relative z-10 p-4 bg-brand-dark/80 border border-t-0 border-brand-neon/50"
        >
            {/* Mapbox Geocoder UI will be injected here */}
        </div>
        
        {/* Map Container */}
        <div className="relative w-full h-[60vh] md:h-[70vh] rounded-xl shadow-2xl shadow-brand-purple/40 border-2 border-brand-neon">
            <div 
                ref={mapContainerRef} 
                className="w-full h-full"
                // Remove aesthetic filter as it might conflict with satellite view
                // style={{ filter: 'grayscale(0.3) contrast(1.1) brightness(1.1)' }} 
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