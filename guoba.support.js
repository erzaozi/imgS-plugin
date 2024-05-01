import Config from "./components/Config.js";
import lodash from "lodash";
import path from "path";
import { pluginRoot } from "./model/path.js";

export function supportGuoba() {
  return {
    pluginInfo: {
      name: 'imgS-plugin',
      title: 'imgS-plugin',
      author: ['@erzaozi', '@CikeyQi'],
      authorLink: ['https://github.com/erzaozi', 'https://github.com/CikeyQi'],
      link: 'https://github.com/erzaozi/imgS-plugin',
      isV3: true,
      isV2: false,
      description: '基于Yunzai-Bot的以图搜图插件，整合图片识别API，用于以图搜源',
      // 显示图标，此为个性化配置
      // 图标可在 https://icon-sets.iconify.design 这里进行搜索
      icon: 'mdi:stove',
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
              { label: "TraceMoe", value: "TraceMoe"}
            ],
          },
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
          field: 'IqDB.services',
          label: '图片数据来源',
          component: "Select",
          bottomHelpMessage: '选择图片数据来源',
          componentProps: {
            allowAdd: true,
            allowDel: true,
            mode: 'multiple',
            options: [
              { label: "Danbooru（动漫艺术作品）", value: 'danbooru' },
              { label: "Konachan（动漫壁纸）", value: 'konachan' },
              { label: "yande.re（高分辨率扫描）", value: 'yandere' },
              { label: "Gelbooru（动漫艺术作品）", value: 'gelbooru' },
              { label: "Sankaku Channel（动漫/漫画/游戏图像）", value: 'sankaku_channel' },
              { label: "e-shuushuu（动漫/漫画/游戏图像）", value: 'e_shuushuu' },
              { label: "Zerochan（动漫图片和壁纸）", value: 'zerochan' },
              { label: "Anime-Pictures（动漫图片和壁纸）", value: 'anime_pictures' },
            ],
          },
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
        config.IqDB.services = data['IqDB.services']
        Config.setConfig(config)
        return Result.ok({}, '保存成功~')
      },
    },
  }
}
