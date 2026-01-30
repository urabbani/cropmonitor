# GEMINI.md: Project Context for AI Assistants

This document provides a comprehensive overview of the "Sindh CropWatch" project to help AI assistants understand its purpose, technologies, and development conventions.

## Project Overview

**Sindh CropWatch** is a web-based agricultural technology (AgriTech) dashboard designed for monitoring and analyzing crop health and environmental conditions. It provides a data-rich, map-centric interface for users to track various metrics related to their agricultural fields.

The application's key features include:
*   An interactive **GIS Map** (using Leaflet.js) to visualize and select farm fields.
*   A main **Dashboard** displaying Key Performance Indicators (KPIs).
*   Detailed analytics on **Crop Health**, likely derived from satellite imagery.
*   An **Alerts Panel** for real-time notifications.
*   A **Weather Widget** for current and forecasted conditions.
*   Data integration from satellite providers like **NASA, ESA, USGS, and Planet**.

The project is structured as a single-page application (SPA).

## Technology Stack

*   **Framework:** React v19 with TypeScript
*   **Build Tool:** Vite
*   **UI Components:** A mix of custom components and primitives from `shadcn/ui`, which are built upon `@radix-ui`.
*   **Styling:** Tailwind CSS
*   **Mapping:** Leaflet.js with `react-leaflet`
*   **Charting & Data Visualization:** `recharts` and `chart.js`
*   **Forms:** `react-hook-form` with `zod` for schema validation
*   **HTTP Client:** `axios`
*   **Linting:** ESLint

## Building and Running

The project is managed using `npm`. The following scripts are defined in `package.json`:

*   **Run Development Server:**
    ```bash
    npm run dev
    ```
    This command starts the Vite development server with Hot Module Replacement (HMR) enabled.

*   **Build for Production:**
    ```bash
    npm run build
    ```
    This command first runs the TypeScript compiler (`tsc`) and then uses Vite to bundle the application for production. The output is placed in the `dist/` directory.

*   **Lint the Code:**
    ```bash
    npm run lint
    ```
    This runs ESLint to check for code quality and style issues across the project.

*   **Preview Production Build:**
    ```bash
    npm run preview
    ```
    This command serves the `dist/` directory, allowing you to test the production build locally.

## Development Conventions

*   **Component Structure:** The application is broken down into major functional areas located in `src/sections/`. Reusable, generic UI components are in `src/components/ui/`.
*   **Styling:** Utility-first CSS is the standard, using Tailwind CSS. Custom styles are minimal and can be found in `src/App.css` and `src/index.css`.
*   **State Management:** The root component (`src/App.tsx`) manages the primary application state, such as the selected field and alerts. State is passed down to child components via props.
*   **Data Fetching:** The project uses `axios` for making HTTP requests. Currently, it uses mock data from `src/data/mockData.ts` for development.
*   **Type Safety:** TypeScript is used throughout the project. Type definitions for shared data structures are located in `src/types/index.ts`.
