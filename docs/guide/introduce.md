# 介绍

## 简介

[CQU-News-Web-Admin](https://github.com/g122622/CQU-News-Web-Admin) 一款基于 Vue3.3、TypeScript、Vite3、Pinia、Element-Plus 开源的后台管理系统，使用目前最新技术栈开发。项目提供强大的 [ProTable](../components/proTable.md) 组件，在一定程度上提升我们的开发效率。另外本项目还封装了一些常用组件、hooks、指令、动态路由、按钮级别权限控制等功能。

## 📚️需要掌握的基础知识

- 本项目基于 Vue3.3、Vite4、TS、Pinia、Element-Plus 开发，并全部采用了的单文件组件 `＜script setup＞` 写法。

- 建议各位在开发前先学习以下内容，提前了解和学习这些知识，会对项目理解非常有帮助：
  - [Vue3 文档](https://cn.vuejs.org/guide/introduction.html)
  - [Vue-Router 文档](https://router.vuejs.org/zh/guide/)
  - [Vite 文档](https://cn.vitejs.dev/guide/)
  - [TypeScript 文档](https://www.typescriptlang.org/zh/docs/)
  - [Pinia 文档](https://pinia.web3doc.top/introduction.html)
  - [Element-Plus 文档](https://element-plus.org/zh-CN/component/button.html)
  - [ES6 教程](https://es6.ruanyifeng.com/)

## 📤️关于版本更新

- 本项目后期将会经历不断的更新迭代，希望可以慢慢的从小做到大。
- 在编写代码时，最好也要写一份简要的说明文档；如果业务需要对框架核心逻辑进行修改，请务必记录下修改内容，告知项目负责人。

## 🌎浏览器支持

- 本地开发推荐使用 Chrome 最新版浏览器 [Download](https://www.google.com/intl/zh-CN/chrome/)。

- 生产环境支持现代浏览器，不在支持 IE 浏览器，更多浏览器可以查看 [Can I Use Es Module](https://caniuse.com/?search=ESModule)。

  | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png" alt="IE" width="24px" height="24px"  />](http://godban.github.io/browsers-support-badges/)IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)Safari |
  | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
  |                                                                                                                not support                                                                                                                |                                                                                          last 2 versions                                                                                          |                                                                                               last 2 versions                                                                                                |                                                                                             last 2 versions                                                                                              |                                                                                             last 2 versions                                                                                              |

## 文档

- 技术文档源码在 [CQU-News-Web-Admin-Docs](https://github.com/g122622/CQU-News-Web-Admin-Docs)，采用 [VitePress](https://vitepress.vuejs.org/) 开发。
- 如发现文档有误，欢迎提交 [Pull requests](https://github.com/g122622/CQU-News-Web-Admin-Docs/pulls) 帮助我们改进。

### 本地运行文档

- 正常情况下不需要本地运行文档。如果实在是需要本地运行文档，只需要将文档拉取到本地进行运行即可。请再次注意，这不是项目的源码，而是项目的文档。

```bash
# 拉取代码
git clone https://github.com/g122622/CQU-News-Web-Admin-Docs.git

# 安装依赖
pnpm install

# 运行文档
pnpm docs:dev

# 打包文档
pnpm docs:build
```

## 如何加入我们 ？

- [CQU-News-Web-Admin](https://github.com/g122622/CQU-News-Web-Admin) 目前还在持续更新中，本项目欢迎并鼓励你的参与，我们共同努力维护和改进它 💪。项目使用 MIT 开源协议，遵循免费原则，不会收取任何费用和版权费用，你可以放心使用它。
- 如果你想加入此项目，可以多提供一些好的建议或者提交 [Pull requests](https://github.com/g122622/CQU-News-Web-Admin-Docs/pulls)。

<script setup> 
const contributor = [
	{src:'https://avatars.githubusercontent.com/u/51069636?v=4',link:'https://github.com/g122622'},
]
</script>

## 主要维护者

<Avatar v-for="user in contributor" :src="user.src" :link="user.link"/>
