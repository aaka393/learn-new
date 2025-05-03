export function calculateControlPoints(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  // Create a smooth curve by offsetting control points
  const offset = Math.min(Math.abs(dx), Math.abs(dy)) * 0.5;
  
  return {
    cp1x: midX - offset,
    cp1y: y1,
    cp2x: midX + offset,
    cp2y: y2,
  };
}

export function getBezierPoint(t: number, p0: Point, cp1: Point, cp2: Point, p1: Point): Point {
  const x = Math.pow(1 - t, 3) * p0.x +
    3 * Math.pow(1 - t, 2) * t * cp1.x +
    3 * (1 - t) * Math.pow(t, 2) * cp2.x +
    Math.pow(t, 3) * p1.x;
    
  const y = Math.pow(1 - t, 3) * p0.y +
    3 * Math.pow(1 - t, 2) * t * cp1.y +
    3 * (1 - t) * Math.pow(t, 2) * cp2.y +
    Math.pow(t, 3) * p1.y;
    
  return { x, y };
}

interface Point {
  x: number;
  y: number;
}

export function findNearestPointOnCircle(cx: number, cy: number, px: number, py: number, r: number) {
  const dx = px - cx;
  const dy = py - cy;
  const angle = Math.atan2(dy, dx);
  
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}
