import plugin from '../../../lib/plugins/plugin.js'
import Config from '../components/Config.js'
import Engine from '../components/Engine.js'
import Init from '../model/init.js'

const setEngine = {};

const lnk = {
    'SauceNAO': ['sao', 'sn'],
    'Ascii2d': ['as2d', 'a2d', 'a2'],
    'IqDB': ['iqb', 'iq'],
    'Yandex': ['ydx', 'yd'],
    'TraceMoe': ['trace', 'tm'],
    'AnimeTrace': ['atr', 'at'],
    'EHentai': ['exhentai', 'eh', 'ex'],
    'Baidu': ['bd'],
    'Google': ['gg', 'gl', 'go'],
}

export class Search extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'imgS-以图搜源',
            /** 功能描述 */
            dsc: '以图搜源',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 1009,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '^[/#]?.*搜图$',
                    /** 执行方法 */
                    fnc: 'search'
                },
            ]
        })
    }

    async search(e) {
        if (!e.img) {
            if (e.source) {
                let reply;
                if (e.isGroup) {
                    reply = (await e.group.getChatHistory(e.source.seq, 1)).pop()?.message;
                } else {
                    reply = (await e.friend.getChatHistory(e.source.time, 1)).pop()?.message;
                }
                if (reply) {
                    for (const val of reply) {
                        if (val.type == "image") {
                            e.img = [val.url];
                            break;
                        }
                    }
                }
            }
            if (e.reply_id) {
                let reply = (await e.getReply(e.reply_id)).message;
                for (const val of reply) {
                    if (val.type === "image") {
                        e.img = [val.url];
                        break;
                    }
                }
            }
        }

        setEngine[e.user_id] = Object.keys(Engine).find(key => e.msg.toLowerCase().includes(key.toLowerCase())) || Object.keys(lnk).find(key => lnk[key].some(alias => e.msg.toLowerCase().includes(alias.toLowerCase()))) || await Config.getConfig().default;

        if (!e.img) {
            this.setContext("getImage", e.isGroup, 60, "操作已超时，请重新发送搜图指令");
            return this.reply("未能获取到图片，请发送你要搜索的图片")
        } else {
            const msg = await this.load(e.img[0])
            if (msg.length === 0) {
                await e.reply("当前搜索引擎[" + setEngine[e.user_id] + "]未找到相关图片，换个搜索引擎试试吧？")
                return true;
            }
            await e.reply(Bot.makeForwardMsg(msg))
            return true;
        }
    }

    async getImage() {
        this.finish("getImage");
        if (!this.e.img) {
            return this.reply("未能获取到图片，请重新发送搜图指令")
        } else {
            const msg = await this.load(this.e.img[0])
            if (msg.length === 0) {
                await this.e.reply("当前搜索引擎[" + setEngine[this.e.user_id] + "]未找到相关图片，换个搜索引擎试试吧？")
                return true;
            }
            await this.e.reply(Bot.makeForwardMsg(msg))
        }
    }

    async load(url) {
        let messages = [];
        try {
            let safe_mode = await Config.getConfig().safe_mode;
            const response = await Engine[setEngine[this.e.user_id]](url)
            switch (setEngine[this.e.user_id]) {
                case "SauceNAO":
                    response.forEach(async item => {
                        const simLimit = await Config.getConfig().SauceNAO.similarity;
                        if (item.similarity < simLimit) return;

                        let msg = [];
                        if (!safe_mode) {
                            messages.push({ message: [segment.image(item.image)] });
                        }

                        msg.push(`${item.title}\n\n`);
                        msg.push(`图片相似度：${item.similarity.toFixed(2)}%\n`);
                        msg.push('图片来源：\n');

                        let src = item.content
                            .map((el, idx) => {
                                if (idx % 2 === 0) {
                                    return el.text + (item.content[idx + 1] ? item.content[idx + 1].text : '');
                                } else {
                                    return el.link ? `${el.link}\n` : '';
                                }
                            })
                            .join('\n');

                        msg.push(src);
                        messages.push({ message: msg.join('') });
                    });
                    break;
                case "Ascii2d":
                    response.slice(0, await Config.getConfig().Ascii2d.results).forEach(async item => {
                        let msg = [];

                        if (!safe_mode) {
                            messages.push({ message: [segment.image(item.image)] });
                        }

                        msg.push(`${item.hash}\n`);
                        msg.push(`${item.info}\n`);

                        if (item.source) {
                            msg.push('\n图片来源：\n');
                            msg.push(`${item.source.text}\n`);
                            msg.push(`${item.source.link}\n`);
                        }

                        if (item.author) {
                            msg.push('\n图片作者：\n');
                            msg.push(`${item.author.text}\n`);
                            msg.push(`${item.author.link}\n`);
                        }

                        messages.push({ message: msg.join('') });
                    });
                    break;
                case "IqDB":
                    response.forEach(async item => {
                        const simLimit = await Config.getConfig().IqDB.similarity;
                        if (item.similarity < simLimit) return;

                        let msg = [];
                        if (!safe_mode) {
                            messages.push({ message: [segment.image(item.image)] });
                        }

                        msg.push(`${item.resolution}\n`);
                        msg.push(`图片相似度：${item.similarity.toFixed(2)}%\n`);
                        msg.push(`图片评级：${item.level}\n\n`);
                        msg.push('图片来源：\n');
                        msg.push(`${item.url}\n`);

                        messages.push({ message: msg.join('') });
                    })
                    break;
                case "Yandex":
                    response.slice(0, await Config.getConfig().Yandex.results).forEach(async item => {
                        let msg = [];

                        if (!safe_mode) {
                            messages.push({ message: [segment.image(`https:${item.thumb.url}`)] });
                        }

                        msg.push(`${item.snippet.title}\n`);
                        msg.push(`图片地址：${item.snippet.url}\n`);
                        msg.push(`图片直链：${item.img_href}\n\n`);

                        if (item.dups) {
                            msg.push('\n相似图片：\n');
                            item.dups.forEach(el => {
                                msg.push(`[${el.w}×${el.h}] ${el.url}\n`);
                            });
                        }

                        messages.push({ message: msg.join('') });
                    })
                    break;
                case "TraceMoe":
                    response.forEach(async item => {
                        const simLimit = await Config.getConfig().IqDB.similarity;
                        if (item.similarity < simLimit) return;

                        let msg = [];
                        if (!safe_mode) {
                            messages.push({ message: [segment.video(item.video)] });
                        }

                        msg.push(`图片相似度：${item.similarity.toFixed(2)}%\n`);
                        msg.push(`${item.filename}\n`);
                        msg.push(`章节：${item.episode ? item.episode : '未知章节'}\n\n`);
                        msg.push(`${item.anilist.isAdult ? '[18+] 小孩子不给看' : '[全年龄] 一点都不涩'}\n\n`);

                        msg.push('图片来源：\n');
                        msg.push(`${item.anilist.title.native}\n`);
                        msg.push(`英文名：${item.anilist.title.english}\n`);
                        msg.push(`罗马字名：${item.anilist.title.romaji}\n`);
                        msg.push(`${stamp2hms(item.from)} - {stamp2hms(item.to)}\n`);

                        function stamp2hms(stamp) {
                            const iso = new Date(stamp).toISOString();
                            const [, timeZ] = iso.split('T');
                            const [time] = timeZ.split('Z');
                            return time;
                        }

                        messages.push({ message: msg.join('') });
                    })
                    break;
                case "AnimeTrace":
                    response.forEach(async item => {
                        let msg = [];
                        if (item.preview) {
                            messages.push({ message: [segment.image('base64://' + item.preview)] });
                        }

                        item.char.forEach(el => {
                            msg.push(`╔ 角色：${el.name}\n╠ 来自动漫：${el.cartoonname}\n╚ 相似度：${el.acc.toFixed(2)}\n`);
                        })

                        messages.push({ message: msg.join('') });
                    })
                    break;
                case "EHentai":
                    response.forEach(async item => {
                        let msg = [];
                        if (!safe_mode) {
                            messages.push({ message: [segment.image(item.image)] });
                        }

                        msg.push(`${item.title}\n`);
                        msg.push(`${item.link}\n\n`);
                        msg.push(`类型：${item.type}\n`);
                        msg.push(`上传日期：${item.tag}\n`);
                        msg.push(`标签：\n`);
                        msg.push(item.tags.join(', '));

                        messages.push({ message: msg.join('') });
                    })
                    break;
                case "Baidu":
                    response.slice(0, await Config.getConfig().Baidu.results).forEach(async item => {
                        let msg = [];

                        if (!safe_mode) {
                            messages.push({ message: [segment.image(item.thumbUrl)] });
                        }
                        msg.push(`图片大小：${item.width} × ${item.height}\n`);
                        msg.push(`图片地址：${item.fromUrl}\n`);

                        messages.push({ message: msg.join('') });
                    })
                    break;
                case "Google":
                    response.forEach(async item => {
                        if (!safe_mode) {
                            messages.push({ message: [segment.image('base64://' + item.pic.replace('data:image/jpeg;base64,', ''))] });
                        }
                        messages.push({ message: [`${item.title}\n` + (item.url ? `${item.url}` : '')] })
                    })
                    break;

                default:
                    break;
            }
        } catch (error) {
            logger.error('[' + setEngine[this.e.user_id] + '] 返回错误：' + error);
        }
        return messages;
    }
}