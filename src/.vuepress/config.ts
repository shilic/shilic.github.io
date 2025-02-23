import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/en/": {
      lang: "en-US",
      title: "A Cheng",
      description: "A blog ",
    },
    "/": {
      lang: "zh-CN",
      title: "阿城",
      description: "阿城",
    },
  },

  // 这里定义了主题，需要自己进行主题的修改
  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
