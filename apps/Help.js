import plugin from '../../../lib/plugins/plugin.js'
import Render from '../components/Render.js'
import { style } from '../resources/help/imgs/config.js'
import _ from 'lodash'

export class help extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'imgS-插件帮助',
            /** 功能描述 */
            dsc: '搜图帮助',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 1009,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '^(/|#)?(img[Ss]|搜图)帮助$',
                    /** 执行方法 */
                    fnc: 'help'
                }
            ]
        })
    }

    async help(e) {
        const helpCfg = {
            "themeSet": false,
            "title": "imgS帮助",
            "subTitle": "搜图帮助",
            "colWidth": 265,
            "theme": "all",
            "themeExclude": [
                "default"
            ],
            "colCount": 2,
            "bgBlur": true
        }
        const helpList = [
            {
                "group": "以图搜图",
                "list": [
                    {
                        "icon": 3,
                        "title": "#搜图",
                        "desc": "使用默认搜图引擎搜图，可在锅巴配置中修改默认搜图引擎"
                    }
                ]
            },
            {
                "group": "指定引擎",
                "list": [
                    {
                        "icon": 1,
                        "title": "#sn搜图",
                        "desc": "SauceNAO 引擎支持广泛的数据库，是寻找插画和艺术作品的好帮手"
                    },
                    {
                        "icon": 5,
                        "title": "#a2搜图",
                        "desc": "Ascii2d 引擎以颜色和特征检索作品，特别擅长于寻找二次元图片源"
                    },
                    {
                        "icon": 7,
                        "title": "#iq搜图",
                        "desc": "IqDB 引擎简单易用的二次元图片搜索引擎，以相似度匹配图片"
                    },
                    {
                        "icon": 11,
                        "title": "#yd搜图",
                        "desc": "Yandex 引擎强大的逆向图片搜寻能力，擅长于找到各种图片的不同版本和来源"
                    },
                    {
                        "icon": 54,
                        "title": "#tm搜图",
                        "desc": "TraceMoe 引擎针对动画片段的搜寻，可以识别动画中的场景和角色"
                    },
                    {
                        "icon": 86,
                        "title": "#at搜图",
                        "desc": "AnimeTrace 引擎专注于动画相关内容的图片搜索，便于追溯角色和场景"
                    },
                    {
                        "icon": 3,
                        "title": "#eh搜图",
                        "desc": "EHentai 引擎主要用于搜寻成人向的漫画和艺术作品，有着丰富的内容库"
                    },
                    {
                        "icon": 38,
                        "title": "#bd搜图",
                        "desc": " Baidu 引擎面向中文用户的图片搜索服务，支持复杂的图像识别和搜索"
                    },
                    {
                        "icon": 39,
                        "title": "#gg搜图",
                        "desc": "Google 引擎全球知名的强大搜索引擎，以算法和广泛的索引库提供精准的图片搜寻结果"
                    }
                ],
            }
        ]
        let helpGroup = []
        _.forEach(helpList, (group) => {
            _.forEach(group.list, (help) => {
                let icon = help.icon * 1
                if (!icon) {
                    help.css = 'display:none'
                } else {
                    let x = (icon - 1) % 10
                    let y = (icon - x - 1) / 10
                    help.css = `background-position:-${x * 50}px -${y * 50}px`
                }
            })
            helpGroup.push(group)
        })

        let themeData = await this.getThemeData(helpCfg, helpCfg)
        return await Render.render('help/index', {
            helpCfg,
            helpGroup,
            ...themeData,
            element: 'default'
        }, { e, scale: 1.6 })
    }

    async getThemeCfg() {
        let resPath = '{{_res_path}}/help/imgs/'
        return {
            main: `${resPath}/main.png`,
            bg: `${resPath}/bg.jpg`,
            style: style
        }
    }

    async getThemeData(diyStyle, sysStyle) {
        let helpConfig = _.extend({}, sysStyle, diyStyle)
        let colCount = Math.min(5, Math.max(parseInt(helpConfig?.colCount) || 3, 2))
        let colWidth = Math.min(500, Math.max(100, parseInt(helpConfig?.colWidth) || 265))
        let width = Math.min(2500, Math.max(800, colCount * colWidth + 30))
        let theme = await this.getThemeCfg()
        let themeStyle = theme.style || {}
        let ret = [`
          body{background-image:url(${theme.bg});width:${width}px;}
          .container{background-image:url(${theme.main});width:${width}px;}
          .help-table .td,.help-table .th{width:${100 / colCount}%}
          `]
        let css = function (sel, css, key, def, fn) {
            let val = (function () {
                for (let idx in arguments) {
                    if (!_.isUndefined(arguments[idx])) {
                        return arguments[idx]
                    }
                }
            })(themeStyle[key], diyStyle[key], sysStyle[key], def)
            if (fn) {
                val = fn(val)
            }
            ret.push(`${sel}{${css}:${val}}`)
        }
        css('.help-title,.help-group', 'color', 'fontColor', '#ceb78b')
        css('.help-title,.help-group', 'text-shadow', 'fontShadow', 'none')
        css('.help-desc', 'color', 'descColor', '#eee')
        css('.cont-box', 'background', 'contBgColor', 'rgba(43, 52, 61, 0.8)')
        css('.cont-box', 'backdrop-filter', 'contBgBlur', 3, (n) => diyStyle.bgBlur === false ? 'none' : `blur(${n}px)`)
        css('.help-group', 'background', 'headerBgColor', 'rgba(34, 41, 51, .4)')
        css('.help-table .tr:nth-child(odd)', 'background', 'rowBgColor1', 'rgba(34, 41, 51, .2)')
        css('.help-table .tr:nth-child(even)', 'background', 'rowBgColor2', 'rgba(34, 41, 51, .4)')
        return {
            style: `<style>${ret.join('\n')}</style>`,
            colCount
        }
    }
}

