# Saudi AgriDrought Warning System (SAWS)

An agricultural drought monitoring dashboard for the Eastern Province of Saudi Arabia, providing GIS visualization, satellite data integration, crop health monitoring, and real-time alerts for agricultural management.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Overview

Saudi AgriDrought Warning System (SAWS) helps agricultural professionals monitor crop conditions and drought indicators across Eastern Province, Saudi Arabia through an intuitive web interface. The dashboard integrates satellite imagery, weather data, and field-level analytics to support data-driven agricultural decisions.

## Features

- **Interactive GIS Map** - View field boundaries, crop locations, and spatial data on an interactive map with multiple base layers
- **Crop Health Monitoring** - Track vegetation indices (NDVI, EVI, NDWI) for assessing crop health and development
- **Real-time Alerts** - Receive priority-based notifications for water stress, pest detection, weather events, and disease outbreaks
- **Satellite Data Integration** - Access multi-source satellite imagery from MODIS, Sentinel-1/2, Landsat, and Planet
- **Weather Dashboard** - View current conditions and 5-day forecasts for agricultural planning
- **Analytics & Insights** - Analyze crop trends, yield predictions, and health distribution charts
- **Field Details** - Access comprehensive information for individual fields including soil moisture and yield estimates

## Screenshots

### Dashboard Overview
![Dashboard](docs/screenshots/dashboard.png)

### GIS Map View
![GIS Map](docs/screenshots/gis-map.png)

### Crop Health Monitoring
![Crop Health](docs/screenshots/crop-health.png)

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

## Installation

1. Clone the repository:
```bash
git clone https://github.com/urabbani/saws-saudi.git
cd saws-saudi
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Development Mode

Start the development server with hot module replacement:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

Build the application for production:
```bash
npm run build
```

The built files will be output to the `dist/` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## Tech Stack

- **Frontend** - React 19 with TypeScript
- **Build Tool** - Vite 7
- **Styling** - Tailwind CSS with desert theme
- **Maps** - Leaflet with React Leaflet
- **Charts** - Chart.js and Recharts
- **UI Components** - Shadcn/ui (Radix UI)

## Geographic Coverage

- **Region**: Eastern Province, Saudi Arabia
- **Coverage Area**: Dammam, Al Khobar, Dhahran, Qatif, Al Hofuf, Al Jubail
- **Coordinate Bounds**: 25.5°N to 27.5°N, 49.0°E to 51.0°E

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or suggestions, please [open an issue](https://github.com/urabbani/saws-saudi/issues) on GitHub.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Satellite data providers: MODIS, Sentinel, Landsat, Planet
- Leaflet and React Leaflet communities
- Shadcn/ui component library

---

[View on GitHub](https://github.com/urabbani/saws-saudi) | [Report Issues](https://github.com/urabbani/saws-saudi/issues)
