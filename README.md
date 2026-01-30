# Sindh CropWatch

Agricultural monitoring dashboard for the Sindh province of Pakistan.

## Overview

Sindh CropWatch provides real-time monitoring and visualization of agricultural data through an interactive web dashboard. Track crop health, view satellite imagery, monitor weather conditions, and receive alerts for agricultural management.

## Features

- **Interactive GIS Map** - View field boundaries, crop locations, and spatial data
- **Crop Health Monitoring** - Track vegetation indices (NDVI, EVI, NDWI)
- **Satellite Data Integration** - Multi-source satellite imagery (MODIS, Sentinel, Landsat)
- **Real-time Alerts** - Priority-based notifications for critical agricultural events
- **Weather Dashboard** - Current conditions and 5-day forecasts
- **Analytics Panel** - Crop trends, yield predictions, and health distribution

## Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

## Installation

### Clone the repository

```bash
git clone https://github.com/urabbani/cropmonitor.git
cd cropmonitor
```

### Install dependencies

```bash
npm install
```

## Usage

### Start development server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`

### Build for production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview production build

```bash
npm run preview
```

## Screenshots

| Dashboard Overview | GIS Map |
|-------------------|---------|
| *[Overview]* | *[Map]* |

## Support

For issues, questions, or contributions, please visit the [GitHub Issues](https://github.com/urabbani/cropmonitor/issues) page.

## License

This project is licensed under the MIT License.

## Acknowledgments

Built for agricultural monitoring in Sindh province, Pakistan.
