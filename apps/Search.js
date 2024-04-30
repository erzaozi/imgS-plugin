import plugin from '../../../lib/plugins/plugin.js'
import Config from '../components/Config.js'
import Engine from '../components/Engine.js'
import Init from '../model/init.js'

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
                    reg: '^[/#]?搜图$',
                    /** 执行方法 */
                    fnc: 'search'
                }
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
        if (!e.img) {
            await e.reply("请发送图片或回复图片");
            return true;
        } else {
            const msg = await this.load(e.img[0])
            if (msg.length === 0) {
                await e.reply("未找到相关图片")
                return true;
            }
            e.reply(Bot.makeForwardMsg(msg))
            return true;
        }
    }

    async load(url) {
        let engine = await Config.getConfig().default;
        let safe_mode = await Config.getConfig().safe_mode;
        const response = await Engine[engine](url)
        logger.info(response)
        let messages = []
        switch (engine) {
            case "SauceNAO":
                response.forEach(async item => {
                    const simLimit = await Config.getConfig().SauceNAO.similarity;
                    if (item.similarity < simLimit) return;

                    let msg = [];
                    if (!safe_mode) {
                        messages.push({ message: [segment.image(item.image)] });
                    }

                    msg.push(`${item.title}\n\n`);
                    msg.push(`图片相似度：${item.similarity}%\n\n`);
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
                    msg.push(`图片相似度：${item.similarity}%\n`);
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

            default:
                break;
        }
        return messages;
    }
}