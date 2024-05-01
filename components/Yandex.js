import fetch from 'node-fetch';
import { load } from 'cheerio';
import _ from 'lodash';
import Config from './Config.js';
import { HttpsProxyAgent } from 'https-proxy-agent';

const BASE_URL = 'https://yandex.com/';

async function Yandex(url) {

    let agent = null
    if (Config.getConfig().proxy.enable) {
        let proxy = 'http://' + Config.getConfig().proxy.host + ':' + Config.getConfig().proxy.port
        agent = new HttpsProxyAgent(proxy)
    }

    const cookie = await Config.getConfig().Yandex.cookie

    const requestUrl = `${BASE_URL}images/search?cbir_page=similar&rpt=imageview&url=${encodeURIComponent(url)}`;

    const response = await fetch(requestUrl, {
        headers: { cookie: cookie ?? '' },
    }).then((res) => res.text());

    if (response.includes('Please confirm that you are not a robot')) {
        throw new Error(`Request failed, request URL: ${requestUrl}`);
    }

    return parse(response);
}

function parse(body) {
    const $ = load(body, { decodeEntities: true });
    return _.map($('.serp-list .serp-item'), (item) => {
        return JSON.parse($(item).attr('data-bem'))['serp-item'];
    }).filter((value) => value !== undefined);
}

export { Yandex };
