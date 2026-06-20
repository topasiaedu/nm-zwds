// Western zodiac icons — MIT-licensed SVGs (krakkenkodex/astrology_icons)

import type { ElementType } from "react";
import { ReactComponent as Aquarius } from "./aquarius.svg";
import { ReactComponent as Aries } from "./aries.svg";
import { ReactComponent as Cancer } from "./cancer.svg";
import { ReactComponent as Capricorn } from "./capricorn.svg";
import { ReactComponent as Gemini } from "./gemini.svg";
import { ReactComponent as Leo } from "./leo.svg";
import { ReactComponent as Libra } from "./libra.svg";
import { ReactComponent as Pisces } from "./pisces.svg";
import { ReactComponent as Sagittarius } from "./sagittarius.svg";
import { ReactComponent as Scorpio } from "./scorpio.svg";
import { ReactComponent as Taurus } from "./taurus.svg";
import { ReactComponent as Virgo } from "./virgo.svg";

export {
  Aquarius,
  Aries,
  Cancer,
  Capricorn,
  Gemini,
  Leo,
  Libra,
  Pisces,
  Sagittarius,
  Scorpio,
  Taurus,
  Virgo,
};

export type WesternZodiacKey =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

const WesternZodiacIcons: Record<WesternZodiacKey, ElementType> = {
  aries: Aries,
  taurus: Taurus,
  gemini: Gemini,
  cancer: Cancer,
  leo: Leo,
  virgo: Virgo,
  libra: Libra,
  scorpio: Scorpio,
  sagittarius: Sagittarius,
  capricorn: Capricorn,
  aquarius: Aquarius,
  pisces: Pisces,
};

export default WesternZodiacIcons;
