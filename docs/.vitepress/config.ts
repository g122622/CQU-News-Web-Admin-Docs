import mdItCustomAttrs from "markdown-it-custom-attrs";

export default {
	title: "CQU_News-开发者文档",
	lang: "zh-CN",
	description: "重庆大学新闻网后台管理系统-开发者文档",
	base: "/docs/CQU/",
	head: [
		["meta", { name: "author", content: "Guo Yi" }],
		["meta", { name: "keywords", content: "Geeker, CQU-News-Web-Admin, CQU-News-Web-Admin-Docs, Vite, Vue, Vue3, Admin" }],
		["link", { rel: "icon", href: "/logo.svg" }],
		["link", { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/@fancyapps/ui/dist/fancybox.css" }],
		["script", { src: "https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js" }],
	],
	markdown: { config: (md) => md.use(mdItCustomAttrs, "image", { "data-fancybox": "gallery" }) },
	lastUpdated: true,
	themeConfig: {
		logo: "/logo.svg",
		algolia: {
			appId: "YMXN47DKMJ",
			apiKey: "8bf7d8e2b7e7b32a95f5aec9aca38a70",
			indexName: "CQU-News-Web-Admin",
		},
		editLink: {
			text: "为此页提供修改建议",
			pattern: "https://github.com/g122622/CQU-News-Web-Admin-Docs",
		},
		socialLinks: [{ icon: "github", link: "https://github.com/g122622/CQU-News-Web-Admin" }],
		footer: {
			message: "MIT License.",
			copyright: "Copyright © 2024 CQU",
		},
		nav: [
			{ text: "指南", link: "/guide/", activeMatch: "/guide" },
			{
				text: "组件",
				items: [
					{ text: "ProTable", link: "/components/proTable" },
					{ text: "SelectIcon", link: "/components/selectIcon" },
					{ text: "SelectFilter", link: "/components/selectFilter" },
					{ text: "TreeFilter", link: "/components/treeFilter" },
					{ text: "Upload", link: "/components/upload" },
					{ text: "ImportExcel", link: "/components/importExcel" },
					{ text: "SvgIcon", link: "/components/svgIcon" },
					{ text: "WangEditor", link: "/components/wangEditor" },
				],
			},
			{
				text: "相关链接",
				items: [
					{ text: "预览地址", link: "https://admin.spicyboy.cn/" },
					{ text: "Gitee 源码", link: "https://gitee.com/g122622/CQU-News-Web-Admin" },
					{ text: "GitHub 源码", link: "https://github.com/g122622/CQU-News-Web-Admin" },
					{ text: "文档源码", link: "https://github.com/g122622/CQU-News-Web-Admin-Docs" },
					{ text: "更新日志", link: "https://github.com/g122622/CQU-News-Web-Admin/blob/master/CHANGELOG.md" },
				],
			},
			{ text: "🍵 赞助", link: "/sponsor/index" },
		],

		sidebar: [
				{
					text: "概览",
					collapsible: true,
					items: [
						{ text: "介绍", link: "/guide/introduce" },
						{ text: "快速上手", link: "/guide/" },
						{ text: "总体目录结构", link: "/guide/catalogue" },
						{ text: "必读：项目规范", link: "/guide/standard" },
						{ text: "构建、部署", link: "/guide/build" },
					],
				},
				{
					text: "基础库",
					collapsible: true,
					items: [
						{ text: "路由、菜单", link: "/guide/router" },
						{ text: "权限管理", link: "/guide/auth" },
						{ text: "网络请求", link: "/guide/request" },
						{ text: "工具库", link: "/guide/utils" },
						{ text: "布局模式", link: "/guide/layout" },
						{ text: "主题配置", link: "/guide/theme" },
					],
				},
				{
					text: "业务逻辑",
					collapsible: true,
					items: [
						{ text: "登录与身份验证", link: "/logic/login" },
					],
				},
				{
					text: "组件",
					collapsible: true,
					items: [
						{ text: "ProTable", link: "/components/proTable" },
						{ text: "SelectIcon", link: "/components/selectIcon" },
						{ text: "SelectFilter", link: "/components/selectFilter" },
						{ text: "TreeFilter", link: "/components/treeFilter" },
						{ text: "Upload", link: "/components/upload" },
						{ text: "ImportExcel", link: "/components/importExcel" },
						{ text: "SvgIcon", link: "/components/svgIcon" },
						{ text: "WangEditor", link: "/components/wangEditor" },
					],
				},
				{
					text: "其他",
					collapsible: true,
					items: [{ text: "常见问题", link: "/guide/question" }],
				},
			]
		},
};
