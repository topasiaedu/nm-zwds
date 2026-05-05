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
import membership from "./membership";

const zhTW = {
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
  ...membership,
};

export default zhTW;
