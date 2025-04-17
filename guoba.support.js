import Config from "./components/Config.js";
import lodash from "lodash";
import path from "path";
import { pluginRoot } from "./model/path.js";

export function supportGuoba() {
  return {
    pluginInfo: {
      name: 'imgS-plugin',
      title: '以图搜源插件',
      author: ['@erzaozi', '@CikeyQi'],
      authorLink: ['https://github.com/erzaozi', 'https://github.com/CikeyQi'],
      link: 'https://github.com/erzaozi/imgS-plugin',
      isV3: true,
      isV2: false,
      showInMenu: true,
      description: '基于 Yunzai 的以图搜源插件',
      // 显示图标，此为个性化配置
      // 图标可在 https://icon-sets.iconify.design 这里进行搜索
      icon: 'twemoji:magnifying-glass-tilted-left',
      // 图标颜色，例：#FF0000 或 rgb(255, 0, 0)
      iconColor: '#d19f56',
      // 如果想要显示成图片，也可以填写图标路径（绝对路径）
      iconPath: path.join(pluginRoot, 'resources/readme/girl.png'),
    },
    configInfo: {
      schemas: [
        {
          component: "Divider",
          label: "基础 相关配置",
          componentProps: {
            orientation: "left",
            plain: true,
          },
        },
        {
          field: "default",
          label: "默认搜图引擎",
          bottomHelpMessage: "选择默认搜图引擎",
          component: "Select",
          componentProps: {
            options: [
              { label: "SauceNAO", value: 'SauceNAO' },
              { label: "Ascii2d", value: "Ascii2d" },
              { label: "IqDB", value: "IqDB" },
              { label: "Yandex", value: "Yandex" },
              { label: "TraceMoe", value: "TraceMoe" },
              { label: "AnimeTrace", value: "AnimeTrace" },
              { label: "EHentai", value: "EHentai" },
              { label: "Baidu", value: "Baidu"},
              { label: "Google", value: "Google"},
              { label: "NHentai", value: "NHentai"}
            ],
          },
        },
        {
          field: 'next',
          label: '自动切换搜图引擎',
          component: "Select",
          bottomHelpMessage: '选择无结果时切换的搜图引擎',
          componentProps: {
            allowAdd: true,
            allowDel: true,
            mode: 'multiple',
            options: [
              { label: "SauceNAO", value: 'SauceNAO' },
              { label: "Ascii2d", value: "Ascii2d" },
              { label: "IqDB", value: "IqDB" },
              { label: "Yandex", value: "Yandex" },
              { label: "TraceMoe", value: "TraceMoe" },
              { label: "AnimeTrace", value: "AnimeTrace" },
              { label: "EHentai", value: "EHentai" },
              { label: "Baidu", value: "Baidu"},
              { label: "Google", value: "Google"},
              { label: "NHentai", value: "NHentai"}
            ],
          },
        },
        {
          field: "send_choice",
          label: "发送切换引擎信息",
          bottomHelpMessage: "不建议选择多个搜图引擎时开启，会导致刷屏",
          component: "Switch",
        },
        {
          field: "safe_mode",
          label: "安全模式",
          bottomHelpMessage: "开启安全模式不会发送预览图，搜图速度更快",
          component: "Switch",
        },
        {
          component: "Divider",
          label: "代理 相关配置",
          componentProps: {
            orientation: "left",
            plain: true,
          },
        },
        {
          field: "proxy.enable",
          label: "启用代理",
          bottomHelpMessage: "代理开关",
          component: "Switch",
        },
        {
          field: "proxy.host",
          label: "代理地址",
          bottomHelpMessage: "代理服务器地址",
          component: "Input",
          componentProps: {
            placeholder: '请输入代理地址',
          },
        },
        {
          field: "proxy.port",
          label: "代理端口",
          bottomHelpMessage: "代理服务器端口",
          component: "InputNumber",
          componentProps: {
            placeholder: '请输入代理端口',
            min: 1,
            max: 65535,
            step: 1,
          },
        },
        {
          component: "Divider",
          label: "SauceNAO 相关配置",
          componentProps: {
            orientation: "left",
            plain: true,
          },
        },
        {
          field: "SauceNAO.similarity",
          label: "相似度限制",
          bottomHelpMessage: "当结果小于此值时，将舍弃该结果（0-100）",
          component: "InputNumber",
          componentProps: {
            placeholder: '请输入相似度限制',
            min: 0,
            max: 100,
            step: 1,
          },
        },
        {
          field: "SauceNAO.hide",
          label: "隐藏敏感内容",
          bottomHelpMessage: "是否隐藏敏感内容",
          component: "Switch",
        },
        {
          component: "Divider",
          label: "Ascii2d 相关配置",
          componentProps: {
            orientation: "left",
            plain: true,
          },
        },
        {
          field: "Ascii2d.results",
          label: "结果数限制",
          bottomHelpMessage: "仅显示前 N 个结果",
          component: "InputNumber",
          componentProps: {
            placeholder: '请输入结果数限制',
            min: 0,
            max: 100,
            step: 1,
          },
        },
        {
          field: "Ascii2d.type",
          label: "搜索模式",
          bottomHelpMessage: "选择搜索模式",
          component: "Select",
          componentProps: {
            options: [
              { label: "色彩搜索", value: 'color' },
              { label: "特征搜索", value: "bovw" },
            ],
          },
        },
        {
          field: "Ascii2d.proxy",
          label: "使用镜像站",
          bottomHelpMessage: "是否使用镜像站加速搜索",
          component: "Switch",
        },
        {
          component: "Divider",
          label: "IqDB 相关配置",
          componentProps: {
            orientation: "left",
            plain: true,
          },
        },
        {
          field: "IqDB.site",
          label: "站点设置",
          bottomHelpMessage: "选择搜索站点",
          component: "Select",
          componentProps: {
            options: [
              { label: "IqDB", value: '2d' },
              { label: "3D IqDB", value: '3d' },
            ],
          },
        },
        {
          field: "IqDB.similarity",
          label: "相似度限制",
          bottomHelpMessage: "当结果小于此值时，将舍弃该结果（0-100）",
          component: "InputNumber",
          componentProps: {
            placeholder: '请输入相似度限制',
            min: 0,
            max: 100,
            step: 1,
          },
        },
        {
          field: "IqDB.discolor",
          label: "搜索时去除颜色",
          bottomHelpMessage: "是否搜索时去除颜色",
          component: "Switch",
        },
        {
          component: "Divider",
          label: "Yandex 相关配置",
          componentProps: {
            orientation: "left",
            plain: true,
          },
        },
        {
          field: "Yandex.results",
          label: "结果数限制",
          bottomHelpMessage: "仅显示前 N 个结果",
          component: "InputNumber",
          componentProps: {
            placeholder: '请输入结果数限制',
            min: 0,
            max: 100,
            step: 1,
          },
        },
        {
          field: "Yandex.cookie",
          label: "Cookie",
          bottomHelpMessage: "用于绕过Yandex的人机验证",
          component: "Input",
          componentProps: {
            placeholder: '请输入Yandex的Cookie',
          },
        },
        {
          component: "Divider",
          label: "TraceMoe 相关配置",
          componentProps: {
            orientation: "left",
            plain: true,
          },
        },
        {
          field: "TraceMoe.similarity",
          label: "相似度限制",
          bottomHelpMessage: "当结果小于此值时，将舍弃该结果（0-100）",
          component: "InputNumber",
          componentProps: {
            placeholder: '请输入相似度限制',
            min: 0,
            max: 100,
            step: 1,
          },
        },
        {
          field: "TraceMoe.cutBorders",
          label: "裁剪图片边缘",
          bottomHelpMessage: "是否搜索时裁剪图片边缘",
          component: "Switch",
        },
        {
          component: "Divider",
          label: "AnimeTrace 相关配置",
          componentProps: {
            orientation: "left",
            plain: true,
          },
        },
        {
          field: "AnimeTrace.model",
          label: "搜索模型",
          bottomHelpMessage: "选择搜索模型",
          component: "Select",
          componentProps: {
            options: [
              { label: "通用识别场景[gochiusa]", value: 'large_model_preview' },
              { label: "低准确率动漫模型", value: "anime" },
              { label: "高级动画模型[lovelive]", value: "anime_model_lovelive" },
              { label: "高级动画模型[yamanosusume]", value: "pre_stable" },
              { label: "1号GalGame模型", value: "game" },
              { label: "2号GalGame模型[kirakira]", value: "game_model_kirakira" },
            ],
          },
        },
        {
          field: "AnimeTrace.mode",
          label: "搜索模式",
          bottomHelpMessage: "选择搜索模式",
          component: "Select",
          componentProps: {
            options: [
              { label: "单结果模式", value: 0 },
              { label: "多结果模式", value: 1 },
            ],
          },
        },
        {
          field: "AnimeTrace.preview",
          label: "预览模式",
          bottomHelpMessage: "开启后，结果携带剪裁后的角色图片",
          component: "Switch",
        },
        {
          component: "Divider",
          label: "EHentai 相关配置",
          componentProps: {
            orientation: "left",
            plain: true,
          },
        },
        {
          field: "EHentai.site",
          label: "站点设置",
          bottomHelpMessage: "选择搜索站点，Ex站点需要配置Cookie",
          component: "Select",
          componentProps: {
            options: [
              { label: "E-Hentai", value: 'eh' },
              { label: "ExHentai", value: 'ex' },
            ],
          },
        },
        {
          field: "EHentai.cover",
          label: "仅搜索封面",
          bottomHelpMessage: "开启后，仅搜索封面，不搜索内容",
          component: "Switch",
        },
        {
          field: "EHentai.deleted",
          label: "搜索已删除内容",
          bottomHelpMessage: "开启后，搜索结果会包含已删除内容",
          component: "Switch",
        },
        {
          field: "EHentai.similar",
          label: "搜索相似内容",
          bottomHelpMessage: "开启后，搜索结果会包含相似内容",
          component: "Switch",
        },
        {
          field: "EHentai.cookie",
          label: "Cookie",
          bottomHelpMessage: "用于访问ExHentai站点权限，请确保你的账号有权访问里站",
          component: "Input",
          componentProps: {
            placeholder: '请输入EHentai的Cookie',
          },
        },
        {
          component: "Divider",
          label: "Baidu 相关配置",
          componentProps: {
            orientation: "left",
            plain: true,
          },
        },
        {
          field: "Baidu.results",
          label: "结果数限制",
          bottomHelpMessage: "仅显示前 N 个结果",
          component: "InputNumber",
          componentProps: {
            placeholder: '请输入结果数限制',
            min: 0,
            max: 100,
            step: 1,
          },
        },
        {
          component: "Divider",
          label: "Google 相关配置",
          componentProps: {
            orientation: "left",
            plain: true,
          },
        },
        {
          field: "Google.results",
          label: "结果数限制",
          bottomHelpMessage: "仅显示前 N 个结果",
          component: "InputNumber",
          componentProps: {
            placeholder: '请输入结果数限制',
            min: 0,
            max: 100,
            step: 1,
          },
        },
        {
          component: "Divider",
          label: "NHentai 相关配置",
          componentProps: {
            orientation: "left",
            plain: true,
          },
        },
        {
          field: "NHentai.factor",
          label: "严格搜索模式",
          bottomHelpMessage: "开启后，使用严格搜索模式",
          component: "Switch",
        },
        {
          field: "NHentai.similarity",
          label: "相似度限制",
          bottomHelpMessage: "当结果小于此值时，将舍弃该结果（0-100）",
          component: "InputNumber",
          componentProps: {
            placeholder: '请输入相似度限制',
            min: 0,
            max: 100,
            step: 1,
          },
        },
        {
          field: "NHentai.results",
          label: "结果数限制",
          bottomHelpMessage: "仅显示前 N 个结果",
          component: "InputNumber",
          componentProps: {
            placeholder: '请输入结果数限制',
            min: 0,
            max: 100,
            step: 1,
          },
        },
      ],
      getConfigData() {
        let config = Config.getConfig()
        return config
      },

      setConfigData(data, { Result }) {
        let config = {}
        for (let [keyPath, value] of Object.entries(data)) {
          lodash.set(config, keyPath, value)
        }
        config = lodash.merge({}, Config.getConfig(), config)
        config.next = data['next']
        Config.setConfig(config)
        return Result.ok({}, '保存成功~')
      },
    },
  }
}
