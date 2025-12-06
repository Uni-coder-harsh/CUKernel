// src/components/maps/MapClientWrapper.tsx
'use client';

import dynamic from 'next/dynamic';

// 1. Dynamically import the Map component here (inside a Client Component)
const DynamicInteractiveMap = dynamic(
    () => import('./InteractiveMap'), // Relative import from the same folder
    { ssr: false } // This is now allowed because the parent is 'use client'
);

export default function MapClientWrapper() {
    return (
        // 2. Render the dynamically loaded map
        <DynamicInteractiveMap />
    );
}