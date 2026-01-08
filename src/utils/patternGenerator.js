// Custom geometric pattern generator (Trianglify alternative)
// Generates SVG-based low-poly patterns

// Emotion-based color palettes
const EMOTION_PALETTES = {
  passion: {
    baseHue: 0, // Red
    hueRange: 30,
    saturationBase: 60,
    saturationRange: 30,
    lightnessBase: 40,
    lightnessRange: 25,
    colors: ['#FF1744', '#D50000', '#FF5252', '#FF8A80', '#C62828']
  },
  calm: {
    baseHue: 200, // Blue
    hueRange: 40,
    saturationBase: 50,
    saturationRange: 40,
    lightnessBase: 45,
    lightnessRange: 30,
    colors: ['#0084D1', '#2196F3', '#64B5F6', '#1565C0', '#42A5F5']
  },
  joy: {
    baseHue: 45, // Yellow/Orange
    hueRange: 35,
    saturationBase: 70,
    saturationRange: 25,
    lightnessBase: 50,
    lightnessRange: 20,
    colors: ['#FFD600', '#FF9800', '#FFC107', '#FFAB00', '#FF6F00']
  },
  mystery: {
    baseHue: 270, // Purple
    hueRange: 40,
    saturationBase: 55,
    saturationRange: 35,
    lightnessBase: 35,
    lightnessRange: 25,
    colors: ['#7C4DFF', '#651FFF', '#AA00FF', '#9C27B0', '#6200EA']
  },
  nature: {
    baseHue: 120, // Green
    hueRange: 45,
    saturationBase: 50,
    saturationRange: 35,
    lightnessBase: 40,
    lightnessRange: 25,
    colors: ['#00C853', '#4CAF50', '#8BC34A', '#2E7D32', '#66BB6A']
  },
  serenity: {
    baseHue: 180, // Teal/Cyan
    hueRange: 35,
    saturationBase: 45,
    saturationRange: 30,
    lightnessBase: 45,
    lightnessRange: 25,
    colors: ['#00BCD4', '#26C6DA', '#00ACC1', '#4DD0E1', '#0097A7']
  }
};

// Default palette (calm/blue)
const DEFAULT_PALETTE = EMOTION_PALETTES.calm;

export const generatePattern = (width = 800, height = 600, seed = Math.random(), emotion = 'calm') => {
  const cellSize = 60;
  const variance = 0.75;
  const cols = Math.ceil(width / cellSize) + 1;
  const rows = Math.ceil(height / cellSize) + 1;
  
  // Get emotion palette (fallback to calm/blue if not found)
  const palette = EMOTION_PALETTES[emotion?.toLowerCase()] || DEFAULT_PALETTE;
  
  // Convert seed to numeric value if it's a string (UUID)
  let numericSeed = seed;
  if (typeof seed === 'string') {
    // Hash the string to create a numeric seed
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    numericSeed = Math.abs(hash) / 2147483647; // Normalize to 0-1
  }
  
  // Seeded random number generator
  const random = (seed) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  
  let currentSeed = numericSeed * 1000;
  const seededRandom = () => random(currentSeed++);
  
  // Generate grid points with variance
  const points = [];
  for (let row = -1; row <= rows; row++) {
    for (let col = -1; col <= cols; col++) {
      const x = col * cellSize + (seededRandom() - 0.5) * cellSize * variance;
      const y = row * cellSize + (seededRandom() - 0.5) * cellSize * variance;
      points.push({ x, y });
    }
  }
  
  // Generate color palette based on emotion
  const colors = [];
  for (let i = 0; i < 5; i++) {
    const hue = palette.baseHue + (seededRandom() - 0.5) * palette.hueRange;
    const saturation = palette.saturationBase + seededRandom() * palette.saturationRange;
    const lightness = palette.lightnessBase + seededRandom() * palette.lightnessRange;
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  
  // Simple Delaunay-like triangulation (using grid-based approach)
  const triangles = [];
  const pointsPerRow = cols + 2;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const topLeft = row * pointsPerRow + col;
      const topRight = topLeft + 1;
      const bottomLeft = topLeft + pointsPerRow;
      const bottomRight = bottomLeft + 1;
      
      // Create two triangles per cell
      triangles.push({
        points: [points[topLeft], points[topRight], points[bottomLeft]],
        color: colors[Math.floor(seededRandom() * colors.length)]
      });
      
      triangles.push({
        points: [points[topRight], points[bottomRight], points[bottomLeft]],
        color: colors[Math.floor(seededRandom() * colors.length)]
      });
    }
  }
  
  // Generate SVG string
  const svgTriangles = triangles
    .map(tri => {
      const pointsStr = tri.points.map(p => `${p.x},${p.y}`).join(' ');
      return `<polygon points="${pointsStr}" fill="${tri.color}" stroke="${tri.color}" stroke-width="0.5"/>`;
    })
    .join('');
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      ${svgTriangles}
    </svg>
  `;
  
  // Return as data URL
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const generatePatternElement = (width, height, seed, emotion) => {
  const pattern = generatePattern(width, height, seed, emotion);
  return pattern;
};

// Export emotion palettes for UI usage
export const EMOTIONS = Object.keys(EMOTION_PALETTES);
export const getEmotionColors = (emotion) => EMOTION_PALETTES[emotion?.toLowerCase()]?.colors || DEFAULT_PALETTE.colors;
