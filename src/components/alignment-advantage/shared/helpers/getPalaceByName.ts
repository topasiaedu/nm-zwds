import type { Palace } from "../../../../utils/zwds/types";

/**
 * Returns the palace matching a given Chinese name, or null if not found.
 */
export function getPalaceByName(palaces: Palace[], name: string): Palace | null {
  return palaces.find((p) => p.name === name) ?? null;
}
