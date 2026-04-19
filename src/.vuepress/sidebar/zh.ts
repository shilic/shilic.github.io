import { sidebar } from "vuepress-theme-hope";

/* 侧边栏和 navbar 类似,  点击任何一个页面之后，侧边栏都会显示。
使用一个键值对来表示目录结构，左侧的键 "/" 表示根目录，右侧的值是一个数组，表示该目录下的页面和子目录。
例如 第一个值 "" 虽然表示空字符串，将路径合起来在这里也就表示 "/"，也就是第一个侧边导航是 "/"目录下的 README.md 
而后边的对象则表示一个组，表示一组侧边栏，例如 "demo/"则表示这一个文件夹里的文件组， structure 关键字 会自动将里边的文件生成导航。
*/
export const zhSidebarConfig  = sidebar({
  "/": [
    "",
    // {
    //   text: "如何使用",
    //   icon: "laptop-code",
    //   prefix: "demo/",
    //   link: "demo/",
    //   children: "structure",
    //   collapsible: true,
    // },
    {
      text: "文章",
      icon: "book",
      prefix: "posts/",
      children: "structure",
      collapsible: true,
    },
    "intro",
    // {
    //   text: "幻灯片",
    //   icon: "person-chalkboard",
    //   link: "https://ecosystem.vuejs.press/zh/plugins/markdown/revealjs/demo.html",
    // },
  ],
});
