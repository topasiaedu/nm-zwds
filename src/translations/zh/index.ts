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

const zh = {
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
    back: "返回",
    cancel: "取消",
    close: "关闭",
    confirm: "确认",
    error: "错误",
    loadingText: "加载中...",
    noSearchResults: "没有符合搜索条件的结果",
    retry: "重试",
    search: "搜索",
  }
};

export default zh; 