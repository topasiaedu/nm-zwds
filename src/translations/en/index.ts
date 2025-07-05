import common from "./common";
import validation from "./validation";
import navigation from "./navigation";
import auth from "./auth";
import dashboard from "./dashboard";
import profile from "./profile";
import calculate from "./calculate";
import chart from "./chart";
import analysis from "./analysis/index";
import zwds from "./zwds";
import misc from "./misc";
import freeTest from "./freeTest";

const en = {
  ...common,
  ...validation,
  ...navigation,
  ...auth,
  ...dashboard,
  ...profile,
  ...calculate,
  ...chart,
  ...analysis,
  ...zwds,
  ...misc,
  ...freeTest,
  general:{
    close: "Close",
  }
};

console.log("ENGLISH TRANSLATIONS", en.analysis.fourKeyPalaceContent.田宅);

export default en; 