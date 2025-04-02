import { ZWDSCalculator } from "./calculator";
/**
 * Zi Wei Dou Shu calculation utilities
 */


export * from "./types";
export * from "./calculator";
export * from "./utils";
export * from "./constants";

/**
 * Create a new Zi Wei Dou Shu calculator instance
 */
export function createCalculator(input: {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: "male" | "female";
  name: string;
}) {
  return new ZWDSCalculator(input);
}

/**
 * Calculate a complete Zi Wei Dou Shu chart
 */
export function calculateChart(input: {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: "male" | "female";
  name: string;
}) {
  const calculator = createCalculator(input);
  return calculator.calculate();
} 