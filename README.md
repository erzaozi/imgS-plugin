![imgS-plugin](https://socialify.git.ci/erzaozi/imgS-plugin/image?description=1&font=Raleway&forks=1&issues=1&language=1&name=1&owner=1&pattern=Circuit%20Board&pulls=1&stargazers=1&theme=Auto)

<img decoding="async" align=right src="https://cdn.jsdelivr.net/gh/erzaozi/imgS-plugin/resources/readme/girl.png" width="35%">

# IMGS-PLUGIN 🌰

- 一个适用于 [Yunzai 系列机器人框架](https://github.com/yhArcadia/Yunzai-Bot-plugins-index) 的以图搜源插件

- 涵盖了多领域、多引擎的专业搜图插件。多个搜图引擎，可自定义搜索参数，开箱即用

- **使用中遇到问题请加 QQ 群咨询：[707331865](https://qm.qq.com/q/TXTIS9KhO2)**

> [!TIP]
> [CikeyQi](https://github.com/CikeyQi) 马上就要参加高考了，这是她高考前最后一款插件，希望大家能喜欢。这款插件无需配置，开箱即用。当然，在后台设置中也能设置每个搜图引擎的自定义参数。涵盖多个领域，搜插画、搜动漫角色、搜番剧、搜Coser、搜本子，这款插件都可以胜任！

## 安装插件

#### 1. 克隆仓库

```
git clone https://github.com/erzaozi/imgS-plugin.git ./plugins/imgS-plugin
```

> [!NOTE]
> 如果你的网络环境较差，无法连接到 Github，可以使用 [GitHub Proxy](https://mirror.ghproxy.com/) 提供的文件代理加速下载服务
>
> ```
> git clone https://mirror.ghproxy.com/https://github.com/erzaozi/imgS-plugin.git ./plugins/imgS-plugin
> ```

#### 2. 安装依赖

```
pnpm install --filter=imgS-plugin
```

## 插件配置

安装好插件后直接使用 `#搜图` 即可开始以图搜图。如需切换搜图引擎，请查看 `#imgS帮助` ，如需更改默认引擎，请查看更改配置文件

> [!WARNING]
> 非常不建议手动修改配置文件，本插件已兼容 [Guoba-plugin](https://github.com/guoba-yunzai/guoba-plugin) ，请使用锅巴插件对配置项进行修改

## 支持引擎

请使用 `#imgS帮助` 获取完整帮助

- [x] SauceNAO
- [x] Ascii2d
- [x] IqDB
- [x] TraceMoe
- [x] AnimeTrace
- [x] Yandex
- [x] E-Hentai
- [x] ExHentai
- [x] Baidu
- [x] Google
- [ ] 3D IqDB

## 常见问题

1. 哪些搜图引擎需要配置？
   - `Yandex` 容易遇到验证码，建议配置Cookie
   - `ExHentai` 需要里站账号，需要配置Cookie

## 支持与贡献

如果你喜欢这个项目，请不妨点个 Star🌟，这是对开发者最大的动力， 当然，你可以对我 [爱发电](https://afdian.net/a/sumoqi) 赞助，呜咪~❤️

有意见或者建议也欢迎提交 [Issues](https://github.com/erzaozi/imgS-plugin/issues) 和 [Pull requests](https://github.com/erzaozi/imgS-plugin/pulls)。

## 相关项目

- [ImageSearcher-ts](https://github.com/huankong233/ImageSearcher-ts)

## 许可证

本项目使用 [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) 作为开源许可证。
