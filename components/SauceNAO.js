import fetch from 'node-fetch';
import { FormData } from 'formdata-polyfill/esm.min.js';
import { load } from 'cheerio';
import _ from 'lodash';
import Config from './Config.js';
import { HttpsProxyAgent } from 'https-proxy-agent';

const BASE_URL = 'https://saucenao.com';

async function SauceNAO(url) {
    let form = new FormData();
    form.append('url', url);

    const hide = await Config.getConfig().SauceNAO.hide;

    if (hide) form.append('hide', '3');

    let agent = null
    if (Config.getConfig().proxy.enable) {
        let proxy = 'http://' + Config.getConfig().proxy.host + ':' + Config.getConfig().proxy.port
        agent = new HttpsProxyAgent(proxy)
    }

    const response = await fetch(`${BASE_URL}/search.php`, {
        method: 'POST',
        body: form,
        agent: agent,
    }).then((res) => res.text());

    return parse(response);
}

function parse(body) {
    const $ = load(body, { decodeEntities: true });
    return _.map($('.result'), (result) => {
        const image = $('.resultimage img', result);
        const title = $('.resulttitle', result);
        const similarity = $('.resultsimilarityinfo', result);
        const misc = $('.resultmiscinfo > a', result);
        const content = $('.resultcontentcolumn > *', result);
        if (title.length <= 0) return;

        const imageUrl = image.attr('data-src2') ?? image.attr('data-src') ?? image.attr('src') ?? '';

        return {
            image: imageUrl,
            title: title.text(),
            similarity: parseFloat(similarity.text()),
            misc: _.map(misc, (m) => m.attribs.href),
            content: _.map(content, (element) => ({
                text: $(element).text(),
                link: element.attribs.href,
            })).filter(({ text }) => text.length > 0),
        };
    })
        .filter((value) => value !== undefined)
        .sort((a, b) => b.similarity - a.similarity);
}

export { SauceNAO };
