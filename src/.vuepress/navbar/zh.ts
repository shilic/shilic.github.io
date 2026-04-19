import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  /* 这里定义了导航栏的内容, 也就是顶部导航栏的内容, 从左到右依次是3个页面: 
  1. 页面1, 使用了 “/” 来表示第一个页面，也就是主页, 会把根目录 "/" 下的 README.md 作为主页显示
  2. 页面2, 使用了 "/demo/" 来表示第二个页面, 会把 "/demo/" 目录下的 README.md 作为第二个页面显示
  3. 博文, 使用了一个对象来定义第三个页面, 这个页面有一个文本 "博文", 一个图标 "pen-to-square", 
  和一个前缀 "/posts/", children 则定义了导航栏下的子菜单
  */
  "/",
  
  // "/demo/",

  // {
  //   text: "博文",
  //   icon: "pen-to-square",
  //   prefix: "/posts/",
  //   children: [
  //     {
  //       text: "苹果",
  //       icon: "pen-to-square",
  //       prefix: "apple/",
  //       children: [
  //         { text: "苹果1", icon: "pen-to-square", link: "1" },
  //         { text: "苹果2", icon: "pen-to-square", link: "2" },
  //         "3",
  //         "4",
  //       ],
  //     },
  //     {
  //       text: "香蕉",
  //       icon: "pen-to-square",
  //       prefix: "banana/",
  //       children: [
  //         {
  //           text: "香蕉 1",
  //           icon: "pen-to-square",
  //           link: "1",
  //         },
  //         {
  //           text: "香蕉 2",
  //           icon: "pen-to-square",
  //           link: "2",
  //         },
  //         "3",
  //         "4",
  //       ],
  //     },
  //     { text: "樱桃", icon: "pen-to-square", link: "cherry" },
  //     { text: "火龙果", icon: "pen-to-square", link: "dragonfruit" },
  //     "tomato",
  //     "strawberry",
  //   ],
  // },

  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },

]);
