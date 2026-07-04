import { hopeTheme } from "vuepress-theme-hope";
//import { commentPlugin } from '@vuepress/plugin-comment'

import { enNavbar, zhNavbar } from "./navbar/index.js";
import { enSidebar, zhSidebarConfig  } from "./sidebar/index.js";


export default hopeTheme({
  hostname: "https://github.com/shilic/shilic.github.io", 

  // 
  author: {
    name: "诚",
    url: " https://shilic.github.io",
  },

  // logo
  logo: "https://raw.githubusercontent.com/shilic/MarkDownImageRepository/main/img/logo1.png", 
  // https://theme-hope-assets.vuejs.press/logo.svg

  // 仓库地址
  repo: "shilic/shilic.github.io",

  // 文档的主目录
  docsDir: "src",

  blog: {
	// 姓名
    name:"诚",

	// 头像默认是  logo
	// avatar:"https://raw.githubusercontent.com/shilic/MarkDownImageRepository/main/img/logo1.png",
 	//description: "心诚则灵",
    // 相关链接 & 社交媒体
    medias: {
      GitHub: "https://github.com/shilic",
      BiliBili: "https://space.bilibili.com/13808984",
      Steam: "https://steamcommunity.com/id/a-cheng/",
      //Zhihu: "https://example.com",
      douban: "https://www.douban.com/people/133155707/",
      bettergi: {
        icon: "https://img.alicdn.com/imgextra/i2/2042484851/O1CN01LQfLIG1lhoEZwz1Gt_!!2042484851.png",
        link: "https://bettergi.com/",
      },
      
    },
  },

  // 右边的个人信息栏目，也就是一些个人简洁
  locales: {
	// 英文的
    "/en/": {
      // navbar
      navbar: enNavbar,

      // sidebar
      sidebar: enSidebar,

      footer: "..",

      displayFooter: true,

      blog: {
        description: "A programmer",
        intro: "/intro.html",
      },

      metaLocales: {
        editLink: "Edit this page on GitHub",
      },
    },

    /**
     * Chinese locale config
     */
    "/": {
      // navbar
      navbar: zhNavbar,

      // sidebar
      sidebar: zhSidebarConfig ,

      footer: "默认页脚",

      displayFooter: true,

      blog: {
		// 头像默认是  logo
		// avatar:"https://raw.githubusercontent.com/shilic/MarkDownImageRepository/main/img/logo1.png",
        description: "车载大屏APP开发、上位机开发、开源项目贡献者",
        intro: "/intro.html",
      },

      // page meta
      metaLocales: {
        editLink: "在 GitHub 上编辑此页",
      },
    },
  },

  encrypt: {
    config: {
      "/demo/encrypt.html": {
        hint: "Password: 1234",
        password: "1234",
      },
    },
  },

  // enable it to preview all changes in time
  // hotReload: true,

  // These features are enabled for demo, only preserve features you need here
  markdown: {
	// 启用警告语法
	alert: true,
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    demo: true,
    figure: true,
    gfm: true,
    imgLazyload: true,
    imgSize: true,
    include: true,
    mark: true,
    plantuml: true,
    spoiler: true,
    stylize: [
      {
        matcher: "Recommended",
        replacer: ({ tag }) => {
          if (tag === "em")
            return {
              tag: "Badge",
              attrs: { type: "tip" },
              content: "Recommended",
            };
        },
      },
    ],
    sub: true,
    sup: true,
	// 选项卡语法
    tabs: true,
    tasklist: true,
    vPre: true,

	/* ------------------------- 以下markdown扩展语法都需要你先安装相关组件之后才能使用 ----------------------- */

	// preview: true,
    // uncomment these if you need TeX support。 数学公式的支持
    // math: {
    //   // install katex before enabling it
    //   type: "katex",
    //   // or install mathjax-full before enabling it
    //   type: "mathjax",
    // },

    // install chart.js before enabling it 
    // chartjs: true,

    // install echarts before enabling it
    // echarts: true,

    // install flowchart.ts before enabling it
    // flowchart: true,

    // install mermaid before enabling it 。使用 mermaid 语法前，需要先 执行 pnpm add -D mermaid 进行安装
    mermaid: true,

    // playground: {
    //   presets: ["ts", "vue"],
    // },

    // install @vue/repl before enabling it
    // vuePlayground: true,

    // install sandpack-vue3 before enabling it
    // sandpack: true,

    // install @vuepress/plugin-revealjs and uncomment these if you need slides
    // revealjs: {
    //   plugins: ["highlight", "math", "search", "notes", "zoom"],
    // },
  },

  plugins: {
	// 启用博客功能，可以设置 Frontmatter  侧边栏和分页等
    blog: true,
	
	// 版权插件
	copyright: {
      // options
	  author: " 诚 ",
	  triggerLength: 50,
	  license: "CC BY-SA 4.0",
	  global: true,
    },

    // Install @waline/client before enabling it
    // Note: This is for testing ONLY!
    // You MUST generate and use your own comment service in production.
	// 集成评论系统
    comment: {
      provider: "Giscus",
	  // 使用在 Giscus 上生成的 script 配置标签来配置评论系统
	  repo: "shilic/shilic.github.io",
	  repoId: "R_kgDON-LAUw",
	  category: "Announcements",
	  categoryId: "DIC_kwDON-LAU84DAeQs",

	  // waline才需要配置下边
      //serverURL: "https://waline-comment.vuejs.press",
    },

	/*import docsearch from '@docsearch/js';
		import '@docsearch/css';

		docsearch({
			container: '#docsearch',
			appId: '3K23AXWAHB',
			indexName: '诚的网络博客',
			apiKey: 'e6e85b70f7c53e58347f295bc66ebb2f',
			askAi: 'YOUR_ALGOLIA_ASSISTANT_ID', // TODO: Replace with your Algolia Assistant ID
		});
	 */

	// 集成搜索系统
	docsearch: {
	  appId: "3K23AXWAHB",
	  apiKey: "e6e85b70f7c53e58347f295bc66ebb2f",
	  indexName: "诚的网络博客",
	},

    components: {
	  // Badge: 多彩的徽章组件; VPCard: 一个卡片组件; PDF: 嵌入 PDF 查看器;  BiliBili: 嵌入 BiliBili 视频
      components: ["Badge", "VPCard", "PDF", "BiliBili"],
    },

    icon: {
      prefix: "fa6-solid:",
    },

    // install @vuepress/plugin-pwa and uncomment these if you want a PWA
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
