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
        }
    }

    async load(url) {
        const response = await Engine[await Config.getConfig().default](url)
        console.log(response)
    }
}