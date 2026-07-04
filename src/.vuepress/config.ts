import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  head: [
	// 将 Algolia 提供的这行代码转换成数组格式放入 head 中, 通过验证 
	// 您需要核实详细信息,以确保您或您的组织拥有所抓取的数据,并且不会在未经授权的情况下抓取网站。
	// 格式：[标签名, { 属性键值对 }, 可选的内部HTML]
	["meta", { name: "algolia-site-verification", content: "1E846E9A9DF73C22" }]
  ],


  base: "/",

  locales: {
    "/en/": {
      lang: "en-US",
      title: "A Cheng",
      description: "A blog ",
    },
    "/": {
      lang: "zh-CN",
      title: "诚",
      description: "诚",
    },
  },

  // 这里定义了主题，需要自己进行主题的修改
  theme,

  // 添加插件
  plugins: [
  ],

  // Enable it with pwa
  // shouldPrefetch: false,
});
