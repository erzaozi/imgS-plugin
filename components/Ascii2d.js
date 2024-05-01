import fetch from 'node-fetch';
import { FormData } from 'formdata-polyfill/esm.min.js';
import { load } from 'cheerio';
import { fileFromSync } from 'fetch-blob/from.js';
import downloadImage from '../utils/download.js';
import _ from 'lodash';
import Config from './Config.js';
import { HttpsProxyAgent } from 'https-proxy-agent';

const PROXY_URL = 'https://ascii2d.obfs.dev';
const BASE_URL = 'https://ascii2d.net';

async function Ascii2d(url) {
    const imagePath = await downloadImage(url);

    const form = new FormData();
    form.append('file', fileFromSync(imagePath));

    let agent = null
    if (Config.getConfig().proxy.enable) {
        let proxy = 'http://' + Config.getConfig().proxy.host + ':' + Config.getConfig().proxy.port
        agent = new HttpsProxyAgent(proxy)
    }

    const type = await Config.getConfig().Ascii2d.type;
    const proxy = await Config.getConfig().Ascii2d.proxy;

    const colorResponse = await fetch(
        `${proxy ? PROXY_URL : BASE_URL}/search/file`,
        {
            method: 'POST',
            body: form,
            agent: agent,
        }
    );

    if (colorResponse.status === 200) {
        let response;
        if (type === 'color') {
            response = await colorResponse.text();
        } else {
            const bovwUrl = colorResponse.url.replace('/color/', '/bovw/');
            response = await fetch(bovwUrl).then((res) => res.text());
        }
        return parse(response);
    } else {
        throw new Error('[Ascii2d] 请求失败，可能触发了Cloudflare的验证机制，请稍后再试');
    }
}

function parse(body) {
    const $ = load(body, { decodeEntities: true });
    return _.map($('.item-box'), (item) => {
        const detail = $('.detail-box', item),
            hash = $('.hash', item),
            info = $('.info-box > .text-muted', item),
            [image] = $('.image-box > img', item),
            [source, author] = $('a[rel=noopener]', detail);

        if (!source && !author) return;

        return {
            hash: hash.text(),
            info: info.text(),
            image: new URL(image.attribs['src'] ?? image.attribs['data-cfsrc'], BASE_URL).toString(),
            source: source ? { link: source.attribs.href, text: $(source).text() } : undefined,
            author: author ? { link: author.attribs.href, text: $(author).text() } : undefined,
        };
    }).filter((value) => value !== undefined);
}

export { Ascii2d };