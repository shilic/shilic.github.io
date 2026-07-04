import { defineUserConfig } from "vuepress";
import { copyrightPlugin } from '@vuepress/plugin-copyright'

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
      title: "诚",
      description: "诚",
    },
  },

  // 这里定义了主题，需要自己进行主题的修改
  theme,

  // 添加插件
  plugins: [
	// 版权插件 // ❌ 这样会冲突
    // copyrightPlugin({
    //   // options
	//   author: "诚",
	//   triggerLength: 50,
	//   license: "CC BY-SA 4.0",
	//   global: true,
    // }),
  ],

  // Enable it with pwa
  // shouldPrefetch: false,
});
