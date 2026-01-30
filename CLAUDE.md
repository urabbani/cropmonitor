# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sindh CropWatch** is a React-based agricultural monitoring dashboard for the Sindh province of Pakistan. It provides GIS visualization, satellite data integration, crop health monitoring, and real-time alerts for agricultural management.

## Development Commands

```bash
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
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Maps**: Leaflet + React Leaflet
- **Charts**: Chart.js + Recharts
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner toast

## Project Structure

```
src/
├── components/ui/     # Shadcn/ui components (40+ reusable components)
├── sections/          # Main dashboard sections (9 major feature components)
├── data/
│   └── mockData.ts    # Mock data for development (KPIs, fields, alerts, weather, etc.)
├── types/
│   └── index.ts       # TypeScript interfaces for all domain types
├── lib/
│   └── utils.ts       # Utility functions (cn class merger helper)
├── hooks/             # Custom React hooks
├── App.tsx            # Main application (state management, layout)
└── main.tsx           # Entry point
```

## Architecture

### Component Organization

The dashboard follows a section-based architecture where each major feature is a self-contained section component:

- **Header**: Navigation tabs, notifications badge, user menu
- **DashboardOverview**: KPI cards with sparklines and trend indicators
- **GISMap**: Interactive Leaflet map with field polygons, markers, and layer controls
- **CropHealthMonitor**: NDVI/EVI/NDWI vegetation indices display
- **SatelliteSources**: Multi-source satellite data status (MODIS, Sentinel-1/2, Landsat, Planet)
- **AlertsPanel**: Priority-based alert system with read/unread states
- **WeatherWidget**: Current conditions + 5-day forecast
- **AnalyticsPanel**: Crop trends, yield predictions, health distribution charts
- **FieldDetailModal**: Popup with detailed field information

### State Management

State is managed at the `App.tsx` level using React hooks:
- `selectedField`: Currently selected field for modal display
- `alerts`: Alert array with real-time simulation
- `activeTab`: Current navigation tab
- `isLoading`: Initial loading state

### Data Flow

1. Mock data is centralized in `/src/data/mockData.ts`
2. All types are defined in `/src/types/index.ts`
3. Sections import data directly from mockData (no API layer yet)
4. Alerts simulate real-time updates via `setInterval` in App.tsx

### Type System

Comprehensive TypeScript interfaces cover:
- `FieldData`: Field boundaries, crop info, NDVI, soil moisture, yield estimates
- `Alert`: Severity levels (critical/warning/info), locations, timestamps
- `KPIData`: Metrics with trends, sparklines, status indicators
- `SatelliteSource`: Satellite metadata, resolution, revisit times
- `WeatherData`: Current conditions and daily forecasts
- `AnalyticsData`: Time series trends and predictions
- `NDVIPoint` / `VegetationIndex`: Time-series vegetation data

### Design System

Custom color palette in `App.css`:
- Agricultural crop colors: wheat (yellow), rice (cyan), cotton (gray/white), sugarcane (green)
- NDVI gradient scale for vegetation health mapping
- Dark mode CSS variables for theming
- Custom animations defined in Tailwind config

## Path Aliases

The `@/` alias maps to `src/` (configured in `tsconfig.app.json` and `vite.config.ts`).

## GIS/Map Integration

The map uses React Leaflet with:
- Field polygons rendered from coordinate arrays
- Multiple base layers (OSM, Satellite, Terrain)
- Data layer toggles (NDVI, crop types, soil moisture, temperature)
- Click interactions to open field detail modals
- Alert locations shown as markers

Note: Leaflet CSS must be imported for map tiles to display correctly.

## Important Notes

- The app uses mock data - when connecting to real APIs, replace imports in `mockData.ts`
- Leaflet maps require proper CSS imports - check `main.tsx` for stylesheet loading
- Shadcn/ui components are in `components/ui/` - use existing components before creating new ones
- The `cn()` utility in `lib/utils.ts` merges Tailwind classes for dynamic styling
- Toast notifications use Sonner - import `Toaster` component and use `toast()` from sonner
