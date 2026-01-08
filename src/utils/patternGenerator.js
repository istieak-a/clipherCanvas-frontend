// Custom geometric pattern generator (Trianglify alternative)
// Generates SVG-based low-poly patterns

export const generatePattern = (width = 800, height = 600, seed = Math.random()) => {
  const cellSize = 60;
  const variance = 0.75;
  const cols = Math.ceil(width / cellSize) + 1;
  const rows = Math.ceil(height / cellSize) + 1;
  
  // Seeded random number generator
  const random = (seed) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  
  let currentSeed = seed * 1000;
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
  
  // Generate color palette (blue-ish theme based on #0084D1)
  const baseHue = 200; // Blue range
  const colors = [];
  for (let i = 0; i < 5; i++) {
    const hue = baseHue + (seededRandom() - 0.5) * 40;
    const saturation = 50 + seededRandom() * 40;
    const lightness = 40 + seededRandom() * 30;
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

export const generatePatternElement = (width, height, seed) => {
  const pattern = generatePattern(width, height, seed);
  return pattern;
};
