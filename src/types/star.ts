export interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  dx: number;
  dy: number;
  isConstellation?: boolean;
}

export interface Line {
  start: Star;
  end: Star;
  opacity: number;
  isConstellation?: boolean;
}

export interface ConstellationPoint {
  x: number; // Relative position (0-1)
  y: number; // Relative position (0-1)
}

export interface Constellation {
  name: string;
  points: ConstellationPoint[];
  connections: [number, number][]; // Pairs of indices that should be connected
}

export interface ChartOptions {
  showPalaceNames: boolean;
  displayStarRatings: boolean;
}

export interface BirthInfo {
  date: string;
  time: string;
  location: string;
} 