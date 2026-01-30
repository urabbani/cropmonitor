import type { VegetationIndexConfig } from '@/types';

// Vegetation Index Configurations
export const vegetationIndices: VegetationIndexConfig[] = [
  {
    id: 'ndvi',
    name: 'NDVI',
    formula: '(NIR - Red) / (NIR + Red)',
    description: 'Normalized Difference Vegetation Index - measures green, living vegetation',
    range: [-1, 1],
    unit: '',
    colorScale: [
      { value: -0.2, color: '#8b4513', label: 'Water/Bare' },
      { value: 0.0, color: '#d2b48c', label: 'Sparse' },
      { value: 0.3, color: '#ffffcc', label: 'Low' },
      { value: 0.5, color: '#c6e090', label: 'Moderate' },
      { value: 0.7, color: '#38a800', label: 'Healthy' },
      { value: 1.0, color: '#006100', label: 'Dense' }
    ]
  },
  {
    id: 'evi',
    name: 'EVI',
    formula: '2.5 * ((NIR - Red) / (NIR + 6*Red - 7.5*Blue + 1))',
    description: 'Enhanced Vegetation Index - improves sensitivity in high biomass regions',
    range: [-1, 1],
    unit: '',
    colorScale: [
      { value: -0.2, color: '#7c3aed', label: 'Very Low' },
      { value: 0.0, color: '#06b6d4', label: 'Low' },
      { value: 0.3, color: '#fbbf24', label: 'Moderate' },
      { value: 0.6, color: '#22c55e', label: 'Good' },
      { value: 1.0, color: '#15803d', label: 'Excellent' }
    ]
  },
  {
    id: 'ndwi',
    name: 'NDWI',
    formula: '(Green - NIR) / (Green + NIR)',
    description: 'Normalized Difference Water Index - monitors water content in vegetation',
    range: [-1, 1],
    unit: '',
    colorScale: [
      { value: -1, color: '#d4a574', label: 'Dry Land' },
      { value: -0.3, color: '#fcd34d', label: 'Dry Veg' },
      { value: 0.0, color: '#93c5fd', label: 'Moderate' },
      { value: 0.3, color: '#3b82f6', label: 'Wet Veg' },
      { value: 1.0, color: '#1e40af', label: 'Water' }
    ]
  },
  {
    id: 'savi',
    name: 'SAVI',
    formula: '((NIR - Red) / (NIR + Red + 0.5)) * 1.5',
    description: 'Soil Adjusted Vegetation Index - minimizes soil brightness influence',
    range: [-1, 1],
    unit: '',
    colorScale: [
      { value: -0.5, color: '#92400e', label: 'Bare Soil' },
      { value: 0.0, color: '#d4d4d4', label: 'Sparse' },
      { value: 0.3, color: '#bef264', label: 'Low' },
      { value: 0.5, color: '#84cc16', label: 'Moderate' },
      { value: 1.0, color: '#365314', label: 'Dense' }
    ]
  },
  {
    id: 'msi',
    name: 'MSI',
    formula: 'SWIR / NIR',
    description: 'Moisture Stress Index - indicates plant water stress',
    range: [0, 3],
    unit: '',
    colorScale: [
      { value: 0.5, color: '#22c55e', label: 'Well Hydrated' },
      { value: 1.0, color: '#84cc16', label: 'Normal' },
      { value: 1.5, color: '#fbbf24', label: 'Mild Stress' },
      { value: 2.0, color: '#f97316', label: 'Moderate Stress' },
      { value: 3.0, color: '#dc2626', label: 'Severe Stress' }
    ]
  },
  {
    id: 'nbr',
    name: 'NBR',
    formula: '(NIR - SWIR) / (NIR + SWIR)',
    description: 'Normalized Burn Ratio - detects burned areas and vegetation recovery',
    range: [-1, 1],
    unit: '',
    colorScale: [
      { value: -0.5, color: '#7c2d12', label: 'High Severity Burn' },
      { value: -0.2, color: '#ea580c', label: 'Moderate Burn' },
      { value: 0.1, color: '#fcd34d', label: 'Low Severity' },
      { value: 0.4, color: '#84cc16', label: 'Unburned' },
      { value: 1.0, color: '#15803d', label: 'Healthy Regrowth' }
    ]
  },
  {
    id: 'lai',
    name: 'LAI',
    formula: 'Derived from NDVI',
    description: 'Leaf Area Index - one-sided green leaf area per ground area',
    range: [0, 7],
    unit: 'm²/m²',
    colorScale: [
      { value: 0, color: '#fbbf24', label: 'Bare' },
      { value: 1, color: '#a3e635', label: 'Low' },
      { value: 2, color: '#22c55e', label: 'Moderate' },
      { value: 4, color: '#16a34a', label: 'High' },
      { value: 7, color: '#14532d', label: 'Very High' }
    ]
  },
  {
    id: 'gndvi',
    name: 'GNDVI',
    formula: '(NIR - Green) / (NIR + Green)',
    description: 'Green Normalized Difference Vegetation Index - sensitive to chlorophyll content',
    range: [-1, 1],
    unit: '',
    colorScale: [
      { value: -0.2, color: '#78350f', label: 'Non-veg' },
      { value: 0.1, color: '#fef08a', label: 'Low Chlorophyll' },
      { value: 0.4, color: '#86efac', label: 'Moderate' },
      { value: 0.6, color: '#22c55e', label: 'Good' },
      { value: 1.0, color: '#14532d', label: 'High Chlorophyll' }
    ]
  }
];

// Band Combinations for False Color Visualization
export const bandCombinations = [
  {
    id: 'natural',
    name: 'Natural Color',
    redBand: 'Red',
    greenBand: 'Green',
    blueBand: 'Blue',
    description: 'True color representation as seen by human eye'
  },
  {
    id: 'false-color',
    name: 'False Color (NIR)',
    redBand: 'NIR',
    greenBand: 'Red',
    blueBand: 'Green',
    description: 'Standard false color - vegetation appears red'
  },
  {
    id: 'swir',
    name: 'Shortwave Infrared',
    redBand: 'SWIR2',
    greenBand: 'NIR',
    blueBand: 'Red',
    description: 'Emphasizes moisture content and soil differences'
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    redBand: 'SWIR1',
    greenBand: 'NIR',
    blueBand: 'Blue',
    description: 'Optimal for crop monitoring and biomass assessment'
  }
];

// Get index configuration by ID
export function getIndexConfig(indexId: string): VegetationIndexConfig | undefined {
  return vegetationIndices.find(idx => idx.id === indexId);
}

// Get color for a value based on index color scale
export function getColorForValue(indexId: string, value: number): string {
  const config = getIndexConfig(indexId);
  if (!config) return '#808080';

  const sortedScale = [...config.colorScale].sort((a, b) => a.value - b.value);

  // Find the two color stops the value falls between
  for (let i = 0; i < sortedScale.length - 1; i++) {
    if (value >= sortedScale[i].value && value <= sortedScale[i + 1].value) {
      // Interpolate between colors
      const ratio = (value - sortedScale[i].value) / (sortedScale[i + 1].value - sortedScale[i].value);
      return interpolateColor(sortedScale[i].color, sortedScale[i + 1].color, ratio);
    }
  }

  // Return extreme colors if out of range
  if (value < sortedScale[0].value) return sortedScale[0].color;
  return sortedScale[sortedScale.length - 1].color;
}

// Interpolate between two hex colors
function interpolateColor(color1: string, color2: string, ratio: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Generate CSS gradient string for color scale
export function getColorScaleGradient(indexId: string): string {
  const config = getIndexConfig(indexId);
  if (!config) return 'linear-gradient(to right, #808080, #808080)';

  const sortedScale = [...config.colorScale].sort((a, b) => a.value - b.value);

  const min = config.range[0];
  const max = config.range[1];
  const range = max - min;

  const gradientStops = sortedScale.map(stop => {
    const percent = ((stop.value - min) / range) * 100;
    return `${stop.color} ${Math.max(0, Math.min(100, percent))}%`;
  });

  return `linear-gradient(to right, ${gradientStops.join(', ')})`;
}

// Calculate index value from band values (mock implementation)
export function calculateIndexValue(indexId: string, bands: Record<string, number>): number {
  const red = bands.Red || 0;
  const green = bands.Green || 0;
  const blue = bands.Blue || 0;
  const nir = bands.NIR || 0;
  const swir = bands.SWIR || 0;

  switch (indexId) {
    case 'ndvi':
      if (nir + red === 0) return -1;
      return (nir - red) / (nir + red);

    case 'evi':
      const denominator = nir + 6 * red - 7.5 * blue + 1;
      if (denominator === 0) return -1;
      return 2.5 * ((nir - red) / denominator);

    case 'ndwi':
      if (green + nir === 0) return -1;
      return (green - nir) / (green + nir);

    case 'savi':
      const saviDenom = nir + red + 0.5;
      if (saviDenom === 0) return -1;
      return ((nir - red) / saviDenom) * 1.5;

    case 'msi':
      if (nir === 0) return 3;
      return swir / nir;

    case 'nbr':
      if (nir + swir === 0) return -1;
      return (nir - swir) / (nir + swir);

    case 'gndvi':
      if (nir + green === 0) return -1;
      return (nir - green) / (nir + green);

    case 'lai':
      const ndvi = nir + red === 0 ? 0 : (nir - red) / (nir + red);
      // LAI approximation from NDVI
      return Math.max(0, Math.min(7, ndvi * 6));

    default:
      return 0;
  }
}

// Get satellite source display name
export function getSourceDisplayName(sourceId: string): string {
  const names: Record<string, string> = {
    'modis': 'MODIS',
    'sentinel-1': 'Sentinel-1 SAR',
    'sentinel-2': 'Sentinel-2',
    'landsat': 'Landsat 8/9',
    'planet': 'PlanetScope'
  };
  return names[sourceId] || sourceId;
}
