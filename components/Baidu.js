import fetch from 'node-fetch';
import { fileFromSync } from 'fetch-blob/from.js';
import { FormData } from 'formdata-polyfill/esm.min.js';
import downloadImage from '../utils/download.js';
import Config from './Config.js';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { load } from 'cheerio';

const BAIDU_GRAPH_URL = 'https://graph.baidu.com/upload';

function extractCardData(html) {
    const $ = load(html);
    const scriptContent = $('script').filter((_, script) => $(script).html().includes('window.cardData')).html();
    const match = scriptContent?.match(/window\.cardData\s*=\s*(.*?);/s);
    return match ? JSON.parse(match[1]) : null;
}

async function Baidu(url) {
    const imagePath = await downloadImage(url);
    let response, cardData;

    const form = new FormData();
    form.append('image', fileFromSync(imagePath));

    let agent = null
    if (Config.getConfig().proxy.enable) {
        let proxy = 'http://' + Config.getConfig().proxy.host + ':' + Config.getConfig().proxy.port
        agent = new HttpsProxyAgent(proxy)
    }

    try {
        response = await fetch(BAIDU_GRAPH_URL, {
            method: 'POST',
            body: form,
            agent: agent,
        });

        const jsonResponse = await response.json();
        if (jsonResponse.status !== 0) {
            throw new Error('返回状态异常 ' + jsonResponse.status);
        }

        const nextUrl = jsonResponse.data.url + '&tpl_from=pc';

        response = await fetch(nextUrl, { method: 'GET', agent: agent });
        cardData = extractCardData(await response.text());

        if (!cardData) {
            return [];
        }

        for (const card of cardData) {
            if (card.cardName === 'same') {
                return card.tplData.list
            }
        }
        return [];
    } catch (error) {
        throw new Error(error.message);
    }
}

export { Baidu };