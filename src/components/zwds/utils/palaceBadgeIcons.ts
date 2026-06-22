/**
 * Palace header badge icons — one Lucide icon per palace (12-palace grid).
 */

import type { LucideIcon } from "lucide-react";
import {
  Baby,
  Briefcase,
  Coins,
  Heart,
  Home,
  Leaf,
  Plane,
  Star,
  Users,
} from "lucide-react";

/** Chinese palace name → badge icon */
const PALACE_BADGE_BY_CHINESE: Record<string, LucideIcon> = {
  命宫: Star,
  兄弟: Users,
  夫妻: Heart,
  子女: Baby,
  财帛: Coins,
  疾厄: Heart,
  迁移: Plane,
  交友: Users,
  官禄: Briefcase,
  田宅: Home,
  福德: Leaf,
  父母: Users,
};

/** English palace label → badge icon */
const PALACE_BADGE_BY_ENGLISH: Record<string, LucideIcon> = {
  Life: Star,
  Siblings: Users,
  Spouse: Heart,
  Children: Baby,
  Wealth: Coins,
  Health: Heart,
  Travel: Plane,
  Friends: Users,
  Career: Briefcase,
  Property: Home,
  Wellbeing: Leaf,
  Parents: Users,
};

/**
 * Resolve the header badge icon for a palace by Chinese or English name.
 */
export function getPalaceBadgeIcon(palaceName: string): LucideIcon | null {
  const fromChinese = PALACE_BADGE_BY_CHINESE[palaceName];
  if (fromChinese) {
    return fromChinese;
  }

  const fromEnglish = PALACE_BADGE_BY_ENGLISH[palaceName];
  if (fromEnglish) {
    return fromEnglish;
  }

  return null;
}
