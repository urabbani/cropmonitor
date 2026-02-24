# GEMINI.md

This file provides guidance to AI assistants when working with code in this repository.

## Project Overview

**Saudi AgriDrought Warning System (SAWS)** is a React-based agricultural drought monitoring dashboard for the Eastern Province of Saudi Arabia. It provides GIS visualization, satellite data integration, crop health monitoring, and real-time alerts for agricultural management.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with HMR
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Preview production build locally
npm run preview
```

## Technology Stack

- **Frontend**: React 19.2.0 with TypeScript
- **Build**: Vite 7.2.4
- **Styling**: Tailwind CSS with custom desert theme design system
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Maps**: Leaflet 1.9.4 + React Leaflet 5.0.0
- **Charts**: Chart.js 4.5.1 + Recharts 2.15.4
- **Forms**: React Hook Form 7.70.0 + Zod 4.3.5 validation
- **Icons**: Lucide React
- **Notifications**: Sonner 2.0.7 toast
- **HTTP Client**: Axios 1.13.3

## Project Structure

```
src/
├── components/ui/     # Shadcn/ui components (50+ reusable components)
├── sections/          # Main dashboard sections (major feature components)
│   ├── Header.tsx
│   ├── DashboardOverview.tsx
│   ├── UnifiedMapViewer.tsx
│   ├── CropHealthMonitor.tsx
│   ├── SatelliteSources.tsx
│   ├── AlertsPanel.tsx
│   ├── WeatherWidget.tsx
│   ├── AnalyticsPanel.tsx
│   └── FieldDetailModal.tsx
├── data/
│   └── mockData.ts    # Mock data for development (KPIs, fields, alerts, weather, etc.)
├── types/
│   └── index.ts       # TypeScript interfaces for all domain types
├── lib/
│   └── utils.ts       # Utility functions (cn class merger helper)
├── hooks/             # Custom React hooks
│   └── use-mobile.ts  # Mobile responsive hook
├── App.tsx            # Main application (state management, layout)
└── main.tsx           # Entry point
```

## Architecture

### Component Organization

The dashboard follows a section-based architecture where each major feature is a self-contained section component:

- **Header** (`Header.tsx`): Navigation tabs, notifications badge, user menu
- **DashboardOverview** (`DashboardOverview.tsx`): KPI cards with sparklines and trend indicators
- **UnifiedMapViewer** (`UnifiedMapViewer.tsx`): Combined GIS Map and Satellite Imagery with tab switching
- **CropHealthMonitor** (`CropHealthMonitor.tsx`): NDVI/EVI/NDWI vegetation indices display
- **SatelliteSources** (`SatelliteSources.tsx`): Multi-source satellite data status (MODIS, Sentinel-1/2, Landsat, Planet)
- **AlertsPanel** (`AlertsPanel.tsx`): Priority-based alert system with read/unread states
- **WeatherWidget** (`WeatherWidget.tsx`): Current conditions + 5-day forecast
- **AnalyticsPanel** (`AnalyticsPanel.tsx`): Crop trends, yield predictions, health distribution charts
- **FieldDetailModal** (`FieldDetailModal.tsx`): Popup with detailed field information

### State Management

State is managed at the `App.tsx` level using React hooks:
- `selectedField`: Currently selected field for modal display
- `alerts`: Alert array with real-time simulation
- `activeTab`: Current navigation tab (dashboard, analytics, settings)
- `isLoading`: Initial loading state

Alerts are simulated to update in real-time via `setInterval` every 30 seconds.

### Data Flow

1. Mock data is centralized in `/src/data/mockData.ts`
2. All types are defined in `/src/types/index.ts`
3. Sections import data directly from mockData (no API layer yet)
4. Alerts simulate real-time updates via `setInterval` in App.tsx
5. Field selection flows from UnifiedMapViewer → App.tsx → FieldDetailModal

### Type System

Comprehensive TypeScript interfaces in `/src/types/index.ts` cover:

| Type | Description |
|------|-------------|
| `FieldData` | Field boundaries, crop info, NDVI, soil moisture, yield estimates |
| `Alert` | Severity levels (critical/warning/info), locations, timestamps |
| `KPIData` | Metrics with trends, sparklines, status indicators |
| `SatelliteSource` | Satellite metadata, resolution, revisit times |
| `WeatherData` | Current conditions and daily forecasts |
| `AnalyticsData` | Time series trends and predictions |
| `NDVIPoint` / `VegetationIndex` | Time-series vegetation data |

### Design System

Custom color palette in `tailwind.config.js`:
- Desert theme colors: dark brown (#8b5a2b), medium tan (#d4a574), light tan (#e8c4a0), cream (#fdf6e3)
- Agricultural crop colors: dates (desert gold), wheat (yellow), tomatoes (red), alfalfa (light green)
- NDVI gradient scale for vegetation health mapping (desert-appropriate)
- Glassmorphism effect with semi-transparent cards (rgba(255, 255, 255, 0.50))
- Background image from `/public/background.jpg`

UI Components follow Shadcn/ui patterns:
- Components use `cn()` utility for conditional class merging
- Consistent variant patterns using `class-variance-authority`
- Radix UI primitives for accessibility
- Tailwind CSS for all styling

## Path Aliases

The `@/` alias maps to `src/` (configured in `tsconfig.app.json` and `vite.config.ts`).

Example imports:
```typescript
import { Button } from '@/components/ui/button';
import { mockData } from '@/data/mockData';
import type { FieldData } from '@/types';
```

## GIS/Map Integration

The map uses React Leaflet with:
- Field polygons rendered from coordinate arrays
- Multiple base layers (OSM, Satellite, Terrain)
- Data layer toggles (NDVI, crop types, soil moisture, temperature)
- Click interactions to open field detail modals
- Alert locations shown as markers
- Custom marker icons using Leaflet's `L.divIcon`

**Geographic Coverage**: Eastern Province, Saudi Arabia
- Bounds: [25.5, 49.0] to [27.5, 51.0] (Dammam region)
- Districts: Dammam, Al Khobar, Dhahran, Qatif, Al Hofuf, Al Jubail

**Important**: Leaflet CSS must be imported for map tiles to display correctly. Import in `main.tsx`:
```typescript
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
```

## Styling Guidelines

### Tailwind CSS Conventions
- Use utility classes for all styling
- Responsive design with mobile-first approach (`sm:`, `md:`, `lg:`, `xl:` breakpoints)
- Custom spacing and colors defined in `tailwind.config.js`
- Use `cn()` utility from `lib/utils.ts` for conditional classes

### Component Styling Pattern
```typescript
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

const Button = ({ variant = 'default', className, ...props }) => (
  <button
    className={cn(
      'base-classes',
      variant === 'outline' && 'outline-classes',
      className
    )}
    {...props}
  />
);
```

## Toast Notifications

The app uses Sonner for toast notifications:

1. Import `Toaster` component once in `App.tsx`:
```typescript
import { Toaster } from '@/components/ui/sonner';
```

2. Use `toast()` function from 'sonner' anywhere:
```typescript
import { toast } from 'sonner';

toast.success('Field saved successfully');
toast.error('Failed to load data');
```

## Important Notes

- The app uses mock data - when connecting to real APIs, replace imports in `mockData.ts`
- Leaflet maps require proper CSS imports - check `main.tsx` for stylesheet loading
- Shadcn/ui components are in `components/ui/` - use existing components before creating new ones
- The `cn()` utility in `lib/utils.ts` merges Tailwind classes for dynamic styling
- All sections are responsive and work on mobile, tablet, and desktop
- The footer includes links to satellite data providers (NASA, ESA, USGS, Planet)
- The server is configured for WSL access on `0.0.0.0:3000`

## Common Patterns

### Creating a New Section
1. Create file in `src/sections/YourSection.tsx`
2. Define props interface if needed
3. Import types from `@/types`
4. Use mock data from `@/data/mockData`
5. Import in `App.tsx` and add to layout
6. Add navigation tab if needed in `Header.tsx`

### Adding New UI Components
1. Check `components/ui/` for existing Shadcn/ui components
2. Use existing components before creating new ones
3. Follow Shadcn/ui patterns with `cn()` utility and CVA variants

## Date Reference

Current date context: February 2026
