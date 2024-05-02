import fetch from 'node-fetch';
import { fileFromSync } from 'fetch-blob/from.js';
import { FormData } from 'formdata-polyfill/esm.min.js';
import downloadImage from '../utils/download.js';
import { load } from 'cheerio';
import _ from 'lodash';
import Config from './Config.js';
import { HttpsProxyAgent } from 'https-proxy-agent';

const BASE_URLs = {
    eh: 'https://upld.e-hentai.org/image_lookup.php',
    ex: 'https://exhentai.org/upld/image_lookup.php'
};

async function EHentai(url) {
    const imagePath = await downloadImage(url);

    const form = new FormData();
    form.append('sfile', fileFromSync(imagePath));
    return await request(form);
}

async function request(form) {

    const site = await Config.getConfig().EHentai.site;
    const cover = await Config.getConfig().EHentai.cover;
    const deleted = await Config.getConfig().EHentai.deleted;
    const similar = await Config.getConfig().EHentai.similar;
    const EH_COOKIE = await Config.getConfig().EHentai.cookie;

    let agent = null
    if (Config.getConfig().proxy.enable) {
        let proxy = 'http://' + Config.getConfig().proxy.host + ':' + Config.getConfig().proxy.port
        agent = new HttpsProxyAgent(proxy)
    }

    form.append('f_sfile', 'search');
    if (cover) form.append('fs_covers', 'on');
    if (similar) form.append('fs_similar', 'on');
    if (deleted) form.append('fs_exp', 'on');

    let response;
    if (site === 'eh') {
        response = await fetch(BASE_URLs['eh'], {
            method: 'POST',
            body: form,
            agent: agent,
        }).then(res => res.text());
    }

    if (site === 'ex') {
        response = await fetch(BASE_URLs['ex'], {
            method: 'POST',
            body: form,
            headers: { Cookie: EH_COOKIE || '' },
            agent: agent,
        }).then(res => res.text());
    }
    return parse(response);
}

function parse(body) {
    const $ = load(body);
    return _.map($('.gltc > tbody > tr'), (result, index) => {
        if (index !== 0) {
            const title = $('.glink', result),
                [image] = $('.glthumb img', result),
                [link] = $('.gl3c a', result),
                type = $('.gl1c .cn', result),
                date = $('.gl2c [id^=posted]', result).eq(0),
                tags = $('.gl3c .gt', result);
            return {
                title: title.text(),
                image: image.attribs.src,
                link: link.attribs.href,
                type: type.text().toUpperCase(),
                date: date.text(),
                tags: _.map(tags, tag => $(tag).text())
            };
        }
    }).filter(v => v !== undefined);
}

export { EHentai };