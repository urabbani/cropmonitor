# Saudi AgriDrought Warning System (SAWS) - Production Development Plan

> **Project Goal**: Transform SAWS from prototype to a production-ready agricultural drought monitoring dashboard for Eastern Province, Saudi Arabia, aligned with FAO WaPOR, NASA Harvest, and industry best practices.

> **Current Date**: February 2026
> **Target Deployment**: Q2 2026

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Research Findings & Best Practices](#research-findings--best-practices)
3. [Proposed Project Structure](#proposed-project-structure)
4. [Development Phases](#development-phases)
5. [Coding Standards & Guidelines](#coding-standards--guidelines)
6. [Parallel Task Assignments](#parallel-task-assignments)
7. [Quality Assurance](#quality-assurance)
8. [Deployment Strategy](#deployment-strategy)

---

## Executive Summary

### Current State Assessment

**Strengths:**
- Clean React 19 + TypeScript foundation with Vite
- 50+ Shadcn/ui components (excellent design system)
- Section-based architecture with good separation
- Comprehensive type definitions

**Critical Gaps Identified:**
1. No real API integration layer
2. Missing error handling and loading states
3. No data caching strategy
4. Performance issues (no code splitting, large bundles)
5. Limited mobile optimization
6. Missing professional agricultural features

**Target State:**
- Production-ready agricultural monitoring platform
- Real satellite data integration (Sentinel-1/2, Landsat, MODIS)
- ML-based yield prediction
- Professional-grade visualization
- Scalable backend architecture
- CI/CD pipeline

---

## Research Findings & Best Practices

### 1. Industry Standards Analysis

#### FAO WaPOR Framework
- **Data Resolution**: 100m (Africa/Middle East), 20m (high-res areas), 300m (global)
- **Update Frequency**: Every 10 days (dekadal)
- **Key Metrics**: Evapotranspiration (ET), Net Primary Production (NPP), Water Productivity (WP)
- **Implementation**: Open-source APIs with OGC standards (WMS, WMTS, WCS)

#### NASA Harvest Best Practices
- **Multi-sensor approach**: Combine optical (Sentinel-2, Landsat) + SAR (Sentinel-1)
- **Machine Learning Integration**: Random Forest, XGBoost, Deep Learning for yield prediction
- **Ground Truth Integration**: Field surveys + satellite data validation
- **Open Data Access**: Google Earth Engine for processing

#### State-of-the-Art Yield Prediction (2024-2025)
- **Best Algorithm**: Gaussian Process Regression (GPR), LightGBM
- **Key Features**: NDVI time-series, elevation (DEM), soil moisture, precipitation
- **Temporal Window**: Optimal prediction at grain-filling stage (Jul-Sep for maize)
- **Accuracy Target**: R² > 0.8, MAPE < 10%

### 2. Technical Stack Recommendations

#### Frontend Enhancements
```json
{
  "performance": {
    "map-rendering": "Canvas renderer for >1000 features",
    "image-loading": "WMTS tiles with GeoWebCache",
    "caching": "Service Worker + IndexedDB"
  },
  "geospatial": {
    "tile-format": "WMTS (preferred) over WMS",
    "coordinate-system": "EPSG:3857 for web, EPSG:4326 for analysis",
    "libgeotiff": "For client-side GeoTIFF parsing"
  },
  "state-management": {
    "approach": "Zustand for complex state, React Query for server state",
    "real-time": "WebSockets for alerts, polling for imagery updates"
  }
}
```

#### Data Pipeline Architecture
```
Satellite Data (ESA/NASA/USGS)
    ↓
STAC API (Catalog)
    ↓
Processing Service (Python/FastAPI)
    ↓
COG (Cloud Optimized GeoTIFF) + STAC
    ↓
CDN (CloudFront/Cloudflare)
    ↓
Frontend (React)
```

---

## Proposed Project Structure

### Monorepo Structure

```
sindh-cropwatch/
├── apps/
│   ├── web/                    # Frontend (current Vite app)
│   │   ├── src/
│   │   │   ├── components/     # 50+ UI components (keep as-is)
│   │   │   ├── features/       # FEATURE-BASED STRUCTURE
│   │   │   │   ├── dashboard/      # Dashboard overview
│   │   │   │   │   ├── components/
│   │   │   │   │   ├── hooks/
│   │   │   │   │   ├── api/
│   │   │   │   │   └── index.ts
│   │   │   │   ├── fields/         # Field management
│   │   │   │   ├── satellite/      # Satellite imagery
│   │   │   │   ├── analytics/      # Analytics & yield prediction
│   │   │   │   ├── alerts/         # Alert system
│   │   │   │   └── settings/       # User settings
│   │   │   ├── shared/         # SHARED CODE
│   │   │   │   ├── components/     # Shared components
│   │   │   │   ├── hooks/          # Shared hooks
│   │   │   │   ├── utils/          # Shared utilities
│   │   │   │   ├── types/          # Shared types
│   │   │   │   └── constants/      # Shared constants
│   │   │   ├── lib/            # INTEGRATION LAYER
│   │   │   │   ├── api/            # API clients (Axios instances)
│   │   │   │   ├── services/       # Business logic services
│   │   │   │   ├── stores/         # State stores (Zustand)
│   │   │   │   └── database/       # IndexedDB wrapper
│   │   │   └── App.tsx
│   │   ├── public/
│   │   │   └── locales/        # i18n translations
│   │   ├── index.html
│   │   └── vite.config.ts
│   └── api/                    # Backend (NEW)
│       ├── src/
│       │   ├── api/            # FastAPI endpoints
│       │   ├── services/       # Satellite data processing
│       │   │   ├── sentinel.py
│       │   │   ├── landsat.py
│       │   │   ├── modis.py
│       │   │   └── processor.py
│       │   ├── models/         # Database models
│       │   ├── tasks/          # Celery tasks
│       │   └── main.py
│       ├── tests/
│       └── pyproject.toml
├── packages/                   # SHARED PACKAGES
│   ├── config/                # Shared configuration
│   ├── types/                 # Shared TypeScript types
│   └── ui/                    # Shared UI components
├── infrastructure/             # DEVOPS
│   ├── terraform/            # IaC for AWS/Azure
│   ├── docker/               # Docker configurations
│   └── kubernetes/           # K8s manifests
├── docs/                      # DOCUMENTATION
│   ├── api/                  # API docs
│   ├── architecture/         # Architecture diagrams
│   └── user/                 # User guides
├── scripts/                   # UTILITY SCRIPTS
│   ├── seed/
│   └── migrate/
├── package.json              # Root package.json
├── pnpm-workspace.yaml       # PNPM workspace config
├── turbo.json               # Turborepo config
└── docker-compose.yml       # Local development
```

### New File Structure (Within apps/web/src)

```
src/
├── features/                    # FEATURE-BASED ORGANIZATION
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── KPICard.tsx
│   │   │   ├── KPISparkline.tsx
│   │   │   └── DashboardGrid.tsx
│   │   ├── hooks/
│   │   │   ├── useKPIData.ts
│   │   │   └── useDashboardRefresh.ts
│   │   ├── api/
│   │   │   ├── getKPIs.ts
│   │   │   └── getTrends.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── fields/                  # FIELD MANAGEMENT
│   │   ├── components/
│   │   │   ├── FieldList.tsx
│   │   │   ├── FieldCard.tsx
│   │   │   ├── FieldForm.tsx
│   │   │   └── FieldPolygon.tsx
│   │   ├── hooks/
│   │   │   ├── useFields.ts
│   │   │   ├── useFieldSelection.ts
│   │   │   └── useFieldCRUD.ts
│   │   ├── api/
│   │   │   ├── fieldApi.ts
│   │   │   └── fieldQueries.ts
│   │   ├── stores/
│   │   │   └── fieldStore.ts
│   │   └── index.ts
│   │
│   ├── satellite/              # SATELLITE IMAGERY
│   │   ├── components/
│   │   │   ├── ImageryViewer.tsx
│   │   │   ├── TimelineSlider.tsx
│   │   │   ├── LayerControl.tsx
│   │   │   ├── DateSelector.tsx
│   │   │   └── ComparisonView.tsx
│   │   ├── hooks/
│   │   │   ├── useSatelliteData.ts
│   │   │   ├── useTimeline.ts
│   │   │   ├── useSTAC.ts
│   │   │   └── useGeoTIFF.ts
│   │   ├── api/
│   │   │   ├── stacApi.ts
│   │   │   ├── sentinelHub.ts
│   │   │   └── imageryQueries.ts
│   │   ├── services/
│   │   │   ├── tiffProcessor.ts
│   │   │   ├── tileLoader.ts
│   │   │   └── cacheManager.ts
│   │   ├── utils/
│   │   │   ├── colorRamps.ts
│   │   │   ├── ndvi.ts
│   │   │   └── projections.ts
│   │   └── index.ts
│   │
│   ├── map/                    # GIS MAP
│   │   ├── components/
│   │   │   ├── MapContainer.tsx
│   │   │   ├── BaseLayers.tsx
│   │   │   ├── OverlayLayers.tsx
│   │   │   ├── FieldPolygons.tsx
│   │   │   ├── MapControls.tsx
│   │   │   ├── Legend.tsx
│   │   │   └── MeasureTool.tsx
│   │   ├── hooks/
│   │   │   ├── useMap.ts
│   │   │   ├── useLayers.ts
│   │   │   ├── useDraw.ts
│   │   │   └── useMapEvents.ts
│   │   ├── services/
│   │   │   ├── layerManager.ts
│   │   │   └── tileProvider.ts
│   │   └── index.ts
│   │
│   ├── analytics/              # ANALYTICS & PREDICTION
│   │   ├── components/
│   │   │   ├── YieldPrediction.tsx
│   │   │   ├── TrendChart.tsx
│   │   │   ├── ComparisonChart.tsx
│   │   │   ├── AnomalyDetection.tsx
│   │   │   └── ExportButton.tsx
│   │   ├── hooks/
│   │   │   ├── useYieldPrediction.ts
│   │   │   ├── useTrends.ts
│   │   │   └── useAnalytics.ts
│   │   ├── api/
│   │   │   ├── analyticsApi.ts
│   │   │   └── predictionApi.ts
│   │   └── index.ts
│   │
│   ├── alerts/                 # ALERT SYSTEM
│   │   ├── components/
│   │   │   ├── AlertList.tsx
│   │   │   ├── AlertCard.tsx
│   │   │   ├── AlertFilters.tsx
│   │   │   └── AlertFeed.tsx
│   │   ├── hooks/
│   │   │   ├── useAlerts.ts
│   │   │   ├── useRealtimeAlerts.ts
│   │   │   └── useAlertSubscription.ts
│   │   ├── api/
│   │   │   └── alertApi.ts
│   │   ├── stores/
│   │   │   └── alertStore.ts
│   │   └── index.ts
│   │
│   └── weather/                # WEATHER DATA
│       ├── components/
│       │   ├── CurrentWeather.tsx
│       │   ├── Forecast.tsx
│       │   └── PrecipitationChart.tsx
│       ├── hooks/
│       │   └── useWeather.ts
│       ├── api/
│       │   └── weatherApi.ts
│       └── index.ts
│
├── shared/                      # SHARED ACROSS FEATURES
│   ├── components/
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   └── DataCard.tsx
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useIntersectionObserver.ts
│   │   ├── useLocalStorage.ts
│   │   └── useMediaQuery.ts
│   ├── utils/
│   │   ├── date.ts
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── cn.ts              # Existing class merger
│   ├── types/
│   │   ├── api.ts             # API response types
│   │   ├── domain.ts          # Domain types
│   │   └── geometry.ts        # GeoJSON types
│   └── constants/
│       ├── crops.ts
│       ├── indices.ts         # NDVI, EVI, etc.
│       └── map.ts
│
├── lib/                         # INTEGRATION LAYER
│   ├── api/
│   │   ├── client.ts          # Axios instance
│   │   ├── interceptors.ts    # Auth, error handling
│   │   ├── endpoints.ts       # API endpoint definitions
│   │   └── react-query.ts     # QueryClient setup
│   ├── services/
│   │   ├── auth.ts
│   │   ├── cache.ts           # Cache service
│   │   └── websocket.ts       # WebSocket client
│   ├── stores/
│   │   ├── userStore.ts
│   │   └── appStore.ts
│   └── database/
│       └── indexedDB.ts       # Local storage wrapper
│
└── App.tsx
```

---

## Development Phases

### Phase 1: Foundation (Weeks 1-4)

**Objective**: Establish project infrastructure and core architecture

#### 1.1 Project Setup
```bash
# Monorepo setup
pnpm init
pnpm add -D turbo typescript @typescript-eslint/eslint-plugin

# New dependencies
pnpm add @tanstack/react-query@^5.0.0 zustand@^5.0.0
pnpm add georaster leaflet-geotiff proj4js
pnpm add workbox-webpack-plugin
pnpm add -D @tanstack/react-query-devtools
```

#### 1.2 File Structure Migration
- Create feature-based directory structure
- Migrate existing sections to new structure
- Set up barrel exports (index.ts files)

#### 1.3 API Layer Implementation

**File**: `src/lib/api/client.ts`
```typescript
import axios from 'axios';
import type { AxiosError, AxiosInstance } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorResponse>) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public get instance(): AxiosInstance {
    return this.client;
  }
}

interface ApiErrorResponse {
  message: string;
  code?: string;
}

export const apiClient = new ApiClient().instance;
```

#### 1.4 React Query Setup

**File**: `src/lib/api/react-query.ts`
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && 'status' in error && typeof error.status === 'number') {
          if (error.status >= 400 && error.status < 500) return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
  },
});
```

### Phase 2: Core Features (Weeks 5-10)

#### 2.1 Satellite Data Integration

**File**: `src/features/satellite/api/stacApi.ts`
```typescript
import { apiClient } from '@/lib/api/client';

export interface STACItem {
  id: string;
  geometry: GeoJSON.Geometry;
  properties: {
    datetime: string;
    'eo:cloud_cover': number;
    'sat:relative_orbit': number;
  };
  assets: {
    [key: string]: {
      href: string;
      type: string;
      roles?: string[];
    };
  };
}

export interface STACSearchParams {
  bbox: [number, number, number, number];
  datetime?: string;
  collections?: string[];
  limit?: number;
  query?: Record<string, unknown>;
}

export const stacApi = {
  async search(params: STACSearchParams): Promise<STACItem[]> {
    const { data } = await apiClient.post<{ features: STACItem[] }>(
      '/stac/search',
      params
    );
    return data.features;
  },

  async getItem(collection: string, itemId: string): Promise<STACItem> {
    const { data } = await apiClient.get<STACItem>(
      `/stac/collections/${collection}/items/${itemId}`
    );
    return data;
  },

  async getAsset(url: string): Promise<Blob> {
    const { data } = await apiClient.get<Blob>(url, {
      responseType: 'blob',
    });
    return data;
  },
};
```

#### 2.2 GeoTIFF Processing Service

**File**: `src/features/satellite/services/tiffProcessor.ts`
```typescript
import { fromUrl } from 'georaster';
import parseGeoraster from 'georaster';

export interface BandStats {
  min: number;
  max: number;
  mean: number;
  stdDev: number;
}

export class GeoTIFFProcessor {
  private georaster: Awaited<ReturnType<typeof parseGeoraster>> | null = null;

  async load(url: string): Promise<void> {
    const georaster = await fromUrl(url);
    this.georaster = await parseGeoraster(georaster);
  }

  getBandStats(bandIndex: number): BandStats | null {
    if (!this.georaster) return null;

    const values = this.georaster.values[bandIndex];
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;
    const squareDiffs = values.map((v) => Math.pow(v - mean, 2));
    const variance = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      mean,
      stdDev,
    };
  }

  getPixelValue(lat: number, lon: number, bandIndex: number): number | null {
    if (!this.georaster) return null;

    // Convert lat/lon to pixel coordinates
    const x = Math.floor((lon - this.georaster.xmin) / this.georaster.pixelWidth);
    const y = Math.floor((this.georaster.ymax - lat) / Math.abs(this.georaster.pixelHeight));

    if (x < 0 || x >= this.georaster.width || y < 0 || y >= this.georaster.height) {
      return null;
    }

    const index = y * this.georaster.width + x;
    return this.georaster.values[bandIndex][index];
  }

  calculateNDVI(): Float32Array | null {
    if (!this.georaster || this.georaster.values.length < 2) return null;

    const red = this.georaster.values[0]; // Red band
    const nir = this.georaster.values[1]; // NIR band

    const ndvi = new Float32Array(red.length);
    for (let i = 0; i < red.length; i++) {
      const numerator = nir[i] - red[i];
      const denominator = nir[i] + red[i];
      ndvi[i] = denominator !== 0 ? numerator / denominator : 0;
    }

    return ndvi;
  }
}
```

#### 2.3 Map Layer Management

**File**: `src/features/map/services/layerManager.ts`
```typescript
import L from 'leaflet';
import 'leaflet-draw';

export interface LayerConfig {
  id: string;
  name: string;
  type: 'tile' | 'wms' | 'wmts' | 'geojson' | 'geotiff';
  visible: boolean;
  opacity: number;
  zIndex: number;
  data?: unknown;
}

export class LayerManager {
  private map: L.Map;
  private layers: Map<string, L.Layer> = new Map();
  private overlayGroups: L.LayerGroup;
  private baseLayers: Record<string, L.Layer> = {};

  constructor(map: L.Map) {
    this.map = map;
    this.overlayGroups = L.layerGroup().addTo(map);
  }

  addTileLayer(config: LayerConfig & { type: 'tile'; url: string }): void {
    const layer = L.tileLayer(config.url, {
      opacity: config.opacity,
      zIndex: config.zIndex,
    });

    this.layers.set(config.id, layer);
    if (config.visible) {
      layer.addTo(this.map);
    }
  }

  addWMSLayer(config: LayerConfig & {
    type: 'wms';
    url: string;
    layers: string;
    styles?: string;
  }): void {
    const layer = L.tileLayer.wms(config.url, {
      layers: config.layers,
      styles: config.styles,
      format: 'image/png',
      transparent: true,
      opacity: config.opacity,
      zIndex: config.zIndex,
    });

    this.layers.set(config.id, layer);
    if (config.visible) {
      this.overlayGroups.addLayer(layer);
    }
  }

  addGeoJSONLayer(config: LayerConfig & {
    type: 'geojson';
    data: GeoJSON.GeoJSON;
    style?: L.PathOptions;
  }): void {
    const layer = L.geoJSON(config.data, {
      style: config.style || this.getDefaultStyle(),
      onEachFeature: (feature, layer) => {
        if (feature.properties) {
          layer.bindPopup(this.createPopup(feature.properties));
        }
      },
    });

    this.layers.set(config.id, layer);
    if (config.visible) {
      this.overlayGroups.addLayer(layer);
    }
  }

  toggleLayer(id: string, visible: boolean): void {
    const layer = this.layers.get(id);
    if (!layer) return;

    if (visible) {
      this.overlayGroups.addLayer(layer);
    } else {
      this.overlayGroups.removeLayer(layer);
    }
  }

  setOpacity(id: string, opacity: number): void {
    const layer = this.layers.get(id);
    if (layer && 'setOpacity' in layer) {
      layer.setOpacity(opacity);
    }
  }

  removeLayer(id: string): void {
    const layer = this.layers.get(id);
    if (layer) {
      this.overlayGroups.removeLayer(layer);
      this.layers.delete(id);
    }
  }

  private getDefaultStyle(): L.PathOptions {
    return {
      color: '#3388ff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.2,
    };
  }

  private createPopup(properties: Record<string, unknown>): string {
    return Object.entries(properties)
      .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
      .join('<br>');
  }
}
```

### Phase 3: Advanced Features (Weeks 11-16)

#### 3.1 Yield Prediction Service

**File**: `src/features/analytics/api/predictionApi.ts`
```typescript
import { apiClient } from '@/lib/api/client';

export interface YieldPredictionRequest {
  fieldId: string;
  crop: string;
  plantingDate: string;
  satelliteData: {
    ndvi: number[];
    evi: number[];
    dates: string[];
  };
  weatherData: {
    precipitation: number[];
    temperature: number[];
    dates: string[];
  };
  soilData?: {
    organicMatter?: number;
    ph?: number;
    nitrogen?: number;
  };
}

export interface YieldPredictionResponse {
  predictedYield: number;
  unit: string;
  confidence: number;
  predictionDate: string;
  factors: {
    ndviContribution: number;
    weatherContribution: number;
    soilContribution?: number;
  };
  historicalComparison?: {
    average: number;
    lastYear: number;
  };
}

export const predictionApi = {
  async predictYield(
    request: YieldPredictionRequest
  ): Promise<YieldPredictionResponse> {
    const { data } = await apiClient.post<YieldPredictionResponse>(
      '/analytics/yield-prediction',
      request
    );
    return data;
  },

  async getHistoricalYields(fieldId: string, years: number = 5) {
    const { data } = await apiClient.get(
      `/analytics/fields/${fieldId}/yields/historical`,
      { params: { years } }
    );
    return data;
  },
};
```

#### 3.2 Real-time Alert System

**File**: `src/lib/services/websocket.ts`
```typescript
type EventHandler<T> = (data: T) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private handlers: Map<string, Set<EventHandler<unknown>>> = new Map();

  constructor(url: string) {
    this.url = url;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const handlers = this.handlers.get(message.type);
        handlers?.forEach((handler) => handler(message.data));
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  on<T>(event: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler as EventHandler<unknown>);

    return () => {
      this.handlers.get(event)?.delete(handler as EventHandler<unknown>);
    };
  }

  emit(event: string, data: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: event, data }));
    }
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
  }
}
```

### Phase 4: Quality & Performance (Weeks 17-20)

#### 4.1 Performance Optimizations

**File**: `vite.config.ts` (updated)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true, gzipSize: true }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'leaflet': ['leaflet', 'react-leaflet'],
          'charts': ['chart.js', 'react-chartjs-2', 'recharts'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/stac': {
        target: 'https://earth-search.aws.element84.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/stac/, '/v1'),
      },
    },
  },
});
```

#### 4.2 Service Worker for Caching

**File**: `src/lib/services/cache.ts`
```typescript
const CACHE_VERSION = 'v1';
const CACHE_NAME = `cropwatch-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
];

const API_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export class CacheService {
  static async install(): Promise<void> {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(STATIC_ASSETS);
  }

  static async cacheAPIRequest(
    request: Request,
    response: Response
  ): Promise<void> {
    if (!response.ok) return;

    const cache = await caches.open(`${CACHE_NAME}-api`);
    const clonedResponse = response.clone();

    // Add timestamp to response for TTL
    const headers = new Headers(clonedResponse.headers);
    headers.append('sw-cached-at', Date.now().toString());

    const cachedResponse = new Response(clonedResponse.body, {
      status: clonedResponse.status,
      statusText: clonedResponse.statusText,
      headers,
    });

    await cache.put(request, cachedResponse);
  }

  static async getCachedAPIRequest(request: Request): Promise<Response | null> {
    const cache = await caches.open(`${CACHE_NAME}-api`);
    const cached = await cache.match(request);

    if (!cached) return null;

    const cachedAt = cached.headers.get('sw-cached-at');
    if (cachedAt) {
      const age = Date.now() - parseInt(cachedAt, 10);
      if (age > API_CACHE_TTL) {
        await cache.delete(request);
        return null;
      }
    }

    return cached;
  }

  static async clearCache(): Promise<void> {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => name.startsWith('cropwatch-'))
        .map((name) => caches.delete(name))
    );
  }
}
```

---

## Coding Standards & Guidelines

### TypeScript Standards

#### 1. Type Definitions
```typescript
// ✅ GOOD: Use specific types
interface FieldData {
  id: string;
  name: string;
  geometry: GeoJSON.Polygon;
  area: number; // in hectares
  crop: CropType;
  plantingDate: Date;
  expectedHarvest: Date;
}

// ❌ BAD: Use 'any' or loose types
interface FieldData {
  [key: string]: any;
}
```

#### 2. API Response Types
```typescript
// ✅ GOOD: Explicit API response types
interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    version: string;
  };
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ❌ BAD: Implicit typing
function getData() {
  return fetch('/api/fields').then(r => r.json());
}
```

#### 3. Component Props
```typescript
// ✅ GOOD: Explicit prop types with defaults
interface KPICardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: number;
  };
  loading?: boolean;
  error?: string;
  className?: string;
}

export function KPICard({
  title,
  value,
  unit,
  trend,
  loading = false,
  error,
  className,
}: KPICardProps) {
  // ...
}
```

### React Best Practices

#### 1. Component Organization
```typescript
// ✅ GOOD: Logical component structure
function SatelliteViewer() {
  // 1. Hooks (in order)
  const map = useMap();
  const { data, loading, error } = useSatelliteData();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 2. Derived values
  const filteredData = useMemo(() => {
    return data?.filter(item => item.date === selectedDate);
  }, [data, selectedDate]);

  // 3. Event handlers
  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  // 4. Effects
  useEffect(() => {
    if (filteredData) {
      map.addLayer(filteredData);
    }
  }, [filteredData, map]);

  // 5. Conditional rendering
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;
  if (!filteredData) return <EmptyState />;

  // 6. Render
  return <div>...</div>;
}
```

#### 2. Custom Hooks Pattern
```typescript
// ✅ GOOD: Reusable custom hook
interface UseSatelliteDataOptions {
  bbox: [number, number, number, number];
  startDate: Date;
  endDate: Date;
  enabled?: boolean;
}

interface UseSatelliteDataResult {
  data: STACItem[] | undefined;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useSatelliteData(
  options: UseSatelliteDataOptions
): UseSatelliteDataResult {
  const { bbox, startDate, endDate, enabled = true } = options;

  const query = useQuery({
    queryKey: ['satellite', 'search', bbox, startDate, endDate],
    queryFn: () => stacApi.search({
      bbox,
      datetime: `${startDate.toISOString()}/${endDate.toISOString()}`,
      collections: ['sentinel-2-l2a', 'landsat-c2-l2'],
    }),
    enabled,
    staleTime: 60 * 60 * 1000, // 1 hour for satellite data
  });

  return {
    data: query.data,
    loading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
```

### Error Handling

#### 1. Error Boundaries
```typescript
// src/shared/components/ErrorBoundary.tsx
interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}
```

#### 2. API Error Handling
```typescript
// lib/api/errors.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    throw new ApiError(message, statusCode);
  }
  if (error instanceof Error) {
    throw error;
  }
  throw new Error('An unknown error occurred');
}
```

### Performance Guidelines

#### 1. Memoization
```typescript
// ✅ GOOD: Memoize expensive computations
const fieldStatistics = useMemo(() => {
  return fields.reduce((acc, field) => {
    const crop = field.crop;
    acc[crop] = (acc[crop] || 0) + field.area;
    return acc;
  }, {} as Record<string, number>);
}, [fields]);

// ✅ GOOD: Memoize callbacks passed to children
const handleFieldClick = useCallback((fieldId: string) => {
  router.push(`/fields/${fieldId}`);
}, [router]);
```

#### 2. Code Splitting
```typescript
// ✅ GOOD: Lazy load heavy components
const SatelliteImageryViewer = lazy(() =>
  import('@/features/satellite/components/ImageryViewer')
);

const AnalyticsPanel = lazy(() =>
  import('@/features/analytics/components/AnalyticsPanel')
);

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/satellite" element={<SatelliteImageryViewer />} />
        <Route path="/analytics" element={<AnalyticsPanel />} />
      </Routes>
    </Suspense>
  );
}
```

---

## Parallel Task Assignments

### Independent Workstreams

| Task | Dependencies | Est. Effort | Assignee |
|------|-------------|-------------|----------|
| **A: API Layer** | None | 2 days | Backend Dev |
| **B: Map Optimization** | None | 3 days | Frontend Dev |
| **C: Satellite Integration** | A | 4 days | GeoSpatial Dev |
| **D: Analytics/Ml** | A | 5 days | Data Scientist |
| **E: Alert System** | A | 3 days | Frontend Dev |
| **F: Testing Suite** | All | 4 days | QA Engineer |

### Task Details

#### Task A: API Layer (No Dependencies)

**Deliverables:**
1. Axios client with interceptors
2. React Query setup
3. API endpoint definitions
4. Error handling utilities
5. Mock API responses for development

**Files to Create:**
```
src/lib/api/
├── client.ts          # Axios instance
├── interceptors.ts    # Auth, error interceptors
├── endpoints.ts       # Endpoint definitions
├── react-query.ts     # QueryClient config
└── errors.ts          # Error classes
```

#### Task B: Map Optimization (No Dependencies)

**Deliverables:**
1. Layer management system
2. Canvas rendering for large datasets
3. Tile caching strategy
4. Performance monitoring
5. Custom marker clustering

**Files to Create:**
```
src/features/map/
├── services/
│   ├── layerManager.ts     # Layer CRUD operations
│   ├── tileCache.ts        # Tile caching
│   └── performance.ts      # Performance utilities
└── components/
    ├── MapContainer.tsx    # Main map component
    ├── LayerControl.tsx    # Layer visibility controls
    └── Legend.tsx          # Map legend
```

#### Task C: Satellite Integration (Depends on A)

**Deliverables:**
1. STAC API client
2. GeoTIFF processing utilities
3. NDVI/EVI calculation
4. Time-series visualization
5. Comparison view (before/after)

**Files to Create:**
```
src/features/satellite/
├── api/
│   ├── stacApi.ts          # STAC client
│   └── imageryQueries.ts   # React Query hooks
├── services/
│   ├── tiffProcessor.ts    # GeoTIFF utilities
│   ├── indexCalculator.ts  # NDVI/EVI/etc.
│   └── cacheManager.ts     # Image caching
└── components/
    ├── ImageryViewer.tsx   # Main viewer
    ├── TimelineSlider.tsx  # Time navigation
    └── ComparisonView.tsx  # Swipe comparison
```

#### Task D: Analytics & ML (Depends on A)

**Deliverables:**
1. Yield prediction API integration
2. Trend analysis charts
3. Anomaly detection
4. Export functionality
5. Model performance metrics

**Files to Create:**
```
src/features/analytics/
├── api/
│   ├── predictionApi.ts    # ML endpoints
│   └── analyticsApi.ts     # Analytics endpoints
├── components/
│   ├── YieldPrediction.tsx # Prediction card
│   ├── TrendChart.tsx      # Line/bar charts
│   ├── AnomalyDetection.tsx # Alert heatmaps
│   └── ExportButton.tsx    # Data export
└── utils/
    ├── chartConfig.ts      # Chart.js configs
    └── formatters.ts       # Number/date formatting
```

#### Task E: Alert System (Depends on A)

**Deliverables:**
1. WebSocket client
2. Real-time alert feed
3. Alert filtering/pagination
4. Push notification support
5. Alert preferences

**Files to Create:**
```
src/features/alerts/
├── stores/
│   └── alertStore.ts       # Zustand store
├── hooks/
│   ├── useRealtimeAlerts.ts # WebSocket integration
│   └── useAlertSubscription.ts # Subscription management
├── api/
│   └── alertApi.ts         # REST endpoints
└── components/
    ├── AlertFeed.tsx       # Live alert list
    ├── AlertCard.tsx       # Individual alert
    └── AlertFilters.tsx    # Filter controls
```

#### Task F: Testing Suite (Depends on All)

**Deliverables:**
1. Component testing (Vitest)
2. E2E testing (Playwright)
3. API mocking (MSW)
4. Visual regression (Percy)
5. Load testing (k6)

**Files to Create:**
```
tests/
├── unit/
│   ├── components/         # Component tests
│   ├── hooks/              # Hook tests
│   └── utils/              # Utility tests
├── e2e/
│   ├── scenarios/          # User flows
│   └── fixtures/           # Test data
├── mocks/
│   └── handlers.ts         # MSW handlers
└── performance/
    └── load-test.js        # k6 scripts
```

---

## Quality Assurance

### Testing Strategy

#### 1. Component Testing
```typescript
// Example: KPICard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KPICard } from '@/features/dashboard/components/KPICard';

describe('KPICard', () => {
  it('displays the value with unit', () => {
    render(
      <KPICard
        title="Total Area"
        value={1250}
        unit="ha"
        trend={{ direction: 'up', value: 5.2 }}
      />
    );

    expect(screen.getByText('1,250 ha')).toBeInTheDocument();
    expect(screen.getByText('Total Area')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<KPICard title="Loading" value={0} loading />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('displays trend indicator', () => {
    render(
      <KPICard
        title="Yield"
        value={100}
        trend={{ direction: 'up', value: 5 }}
      />
    );

    expect(screen.getByText('+5%')).toBeInTheDocument();
    expect(screen.getByTestId('trend-up')).toBeInTheDocument();
  });
});
```

#### 2. E2E Testing
```typescript
// Example: satellite-view.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Satellite Imagery Viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/satellite');
  });

  test('loads and displays the map', async ({ page }) => {
    await expect(page.locator('.leaflet-container')).toBeVisible();
  });

  test('changes imagery date using timeline', async ({ page }) => {
    await page.click('[data-testid="timeline-slider"]');
    await page.fill('[data-testid="timeline-slider"]', '50');

    await expect(page.locator('[data-testid="imagery-date"]'))
      .toContainText('2025-12-15');
  });

  test('compares two dates side by side', async ({ page }) => {
    await page.click('[data-testid="comparison-mode"]');
    await page.selectOption('[data-testid="before-date"]', '2025-12-01');
    await page.selectOption('[data-testid="after-date"]', '2025-12-15');

    const beforeImage = page.locator('[data-testid="before-image"]');
    const afterImage = page.locator('[data-testid="after-image"]');

    await expect(beforeImage).toBeVisible();
    await expect(afterImage).toBeVisible();
  });
});
```

### Code Review Checklist

- [ ] TypeScript types are explicit (no `any`)
- [ ] Components are properly memoized (useMemo, useCallback)
- [ ] Error handling is comprehensive
- [ ] Loading states are defined
- [ ] Accessibility requirements met (ARIA labels)
- [ ] Console has no warnings/errors
- [ ] Bundle size impact is acceptable
- [ ] Tests cover critical paths
- [ ] Documentation is updated

---

## Deployment Strategy

### Environment Configuration

```bash
# .env.production
VITE_API_URL=https://api.cropwatch.pk
VITE_STAC_URL=https://stac-api.cropwatch.pk
VITE_WS_URL=wss://alerts.cropwatch.pk
VITE_SENTRY_DSN=...
VITE_GOOGLE_ANALYTICS_ID=...
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run lint
      - run: pnpm run test:unit
      - run: pnpm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run build
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      - run: aws s3 sync dist/ s3://cropwatch-web --delete
      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
```

---

## References

### Data Sources
- **STAC API**: https://stacspec.org/
- **Sentinel Hub**: https://docs.sentinel-hub.com/
- **Google Earth Engine**: https://earthengine.google.com/
- **NASA Harvest**: https://harvest.umd.edu/
- **FAO WaPOR**: https://wapor.apps.fao.org/

### Documentation
- **Leaflet**: https://leafletjs.com/reference.html
- **React Query**: https://tanstack.com/query/latest
- **Zustand**: https://zustand-demo.pmnd.rs/
- **Shadcn/ui**: https://ui.shadcn.com/

### Research Papers
1. "AI-Based Rice Yield Prediction" (Korean Journal Remote Sensing, 2024)
2. "Optimal Estimation Time Period for Maize Yield" (2025)
3. "Soybean Yield Prediction with Transfer Learning" (2025)
4. "DeepCropNet: Hierarchical Deep Learning for Corn Yield" (Environmental Research Letters)

---

**Document Version**: 1.0
**Last Updated**: February 2026
**Next Review**: Monthly during development
