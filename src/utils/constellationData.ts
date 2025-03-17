import { Constellation } from "../types/star";

export const constellationData: Constellation[] = [
  {
    name: "Ursa Major (Big Dipper)",
    points: [
      { x: 0.2, y: 0.3 }, { x: 0.25, y: 0.35 }, { x: 0.3, y: 0.4 },
      { x: 0.35, y: 0.45 }, { x: 0.4, y: 0.43 }, { x: 0.45, y: 0.35 },
      { x: 0.5, y: 0.3 }
    ],
    connections: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6]]
  },
  {
    name: "Orion",
    points: [
      { x: 0.6, y: 0.2 }, { x: 0.65, y: 0.25 }, { x: 0.63, y: 0.3 },
      { x: 0.67, y: 0.35 }, { x: 0.7, y: 0.4 }, { x: 0.73, y: 0.45 },
      { x: 0.68, y: 0.45 }
    ],
    connections: [[0,1], [1,2], [2,3], [3,4], [4,5], [3,6]]
  },
  {
    name: "Scorpius",
    points: [
      { x: 0.8, y: 0.6 }, { x: 0.75, y: 0.65 }, { x: 0.7, y: 0.7 },
      { x: 0.65, y: 0.75 }, { x: 0.6, y: 0.8 }, { x: 0.55, y: 0.85 },
      { x: 0.5, y: 0.82 }
    ],
    connections: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6]]
  },
  {
    name: "Cassiopeia",
    points: [
      { x: 0.15, y: 0.15 }, { x: 0.2, y: 0.1 }, { x: 0.25, y: 0.15 },
      { x: 0.3, y: 0.1 }, { x: 0.35, y: 0.15 }
    ],
    connections: [[0,1], [1,2], [2,3], [3,4]]
  },
  {
    name: "Cygnus (Northern Cross)",
    points: [
      { x: 0.5, y: 0.15 }, { x: 0.5, y: 0.2 }, { x: 0.5, y: 0.25 },
      { x: 0.45, y: 0.22 }, { x: 0.55, y: 0.22 }, { x: 0.4, y: 0.2 },
      { x: 0.6, y: 0.2 }
    ],
    connections: [[0,1], [1,2], [1,3], [1,4], [3,5], [4,6]]
  },
  {
    name: "Lyra",
    points: [
      { x: 0.75, y: 0.15 }, { x: 0.78, y: 0.18 }, { x: 0.8, y: 0.2 },
      { x: 0.78, y: 0.22 }, { x: 0.75, y: 0.25 }
    ],
    connections: [[0,1], [1,2], [2,3], [3,4], [0,4]]
  }
]; 