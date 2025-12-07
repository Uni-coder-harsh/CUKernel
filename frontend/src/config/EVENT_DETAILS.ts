// src/config/EVENT_DETAILS.ts (FINAL MAP CONFIGURATION)

// Central University of Karnataka Coordinates (Fixed Destination)
export const CUK_COORDS: [number, number] = [76.6731, 17.4335]; // [Lng, Lat] format for Mapbox  17.4335, 76.6731
export const DESTINATION_ADDRESS = "Central University of Karnataka, Kadaganchi, Kalaburagi, Karnataka - 585367";

// Default Map Settings
export const DEFAULT_ZOOM = 15;
export const DEFAULT_PITCH = 35;

// Fixed routes from major cities to CUK (Driving mode assumed as "easiest way")
// NOTE: Coordinates here are [Lng, Lat]
export const ROUTE_CITIES = [
  { name: 'Hyderabad', coords: [78.4867, 17.3850], distance: '256 km', duration: '5 hrs', summary: 'via NH 65' },
  { name: 'Pune', coords: [73.8567, 18.5204], distance: '350 km', duration: '7 hrs 30 mins', summary: 'via NH 65 / NH 9' },
  { name: 'Bangalore', coords: [77.5946, 12.9716], distance: '560 km', duration: '10 hrs 30 mins', summary: 'via NH 50' },
  { name: 'Solapur', coords: [75.9068, 17.6599], distance: '105 km', duration: '2 hrs 30 mins', summary: 'via NH 50' },
  { name: 'Mumbai', coords: [72.8777, 19.0760], distance: '580 km', duration: '11 hrs', summary: 'via NH 65 / AH 47' },
];