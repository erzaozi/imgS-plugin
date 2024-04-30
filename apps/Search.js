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
        const response = await Engine[engine](url)
        logger.info(response)
        let messages = []
        switch (engine) {
            case "SauceNAO":
                response.forEach(item => {
                    if (item.similarity < 60) return;

                    let message = []
                    message.push(segment.image(item.image))
                    message.push(item.title + '\n\n')
                    message.push('图片相似度：' + item.similarity + '\n\n')
                    message.push('图片来源：\n')
                    let result = '';
                    item.content.forEach((element, index) => {
                        if (index % 2 === 0) {
                            result += element.text
                            if (item.content[index + 1]) {
                                result += item.content[index + 1].text;
                            }
                            result += '\n';
                        } else {
                            if (element.link) {
                                result += element.link + '\n';
                            }
                        }
                    });
                    message.push(result)
                    messages.push({ message: message })
                })
                break;
            case "Ascii2d":
                break;
            case "IqDB":
                break;
            case "Yandex":
                break;

            default:
                break;
        }
        return messages;
    }
}