import fetch from 'node-fetch';
import { fileFromSync } from 'fetch-blob/from.js';
import { FormData } from 'formdata-polyfill/esm.min.js';
import downloadImage from '../utils/download.js';
import Config from './Config.js';
import { HttpsProxyAgent } from 'https-proxy-agent';

const BASE_URL = 'https://api.trace.moe';

async function TraceMoe(url) {
    const imagePath = await downloadImage(url);

    const form = new FormData();
    form.append('image', fileFromSync(imagePath));
    return await request(form);
}

async function request(form) {

    let agent = null
    if (Config.getConfig().proxy.enable) {
        let proxy = 'http://' + Config.getConfig().proxy.host + ':' + Config.getConfig().proxy.port
        agent = new HttpsProxyAgent(proxy)
    }

    const cutBorders = Config.getConfig().TraceMoe.cutBorders
    const res = await fetch(`${BASE_URL}/search?anilistInfo=1${cutBorders ? '&cutBorders=1' : ''}`, {
        method: 'POST',
        body: form,
        agent: agent
    }).then(res => res.json());
    return parse(res);
}

function parse(res) {
    const { result } = res;
    return result
        .map(data => {
            data.similarity *= 100;
            data.from *= 1000;
            data.to *= 1000;
            data.image = replaceAmp(data.image);
            data.video = replaceAmp(data.video);
            return data;
        })
        .filter(v => v !== undefined)
        .sort((a, b) => b.similarity - a.similarity);
}

const replaceAmp = str => str ? str.replace(/&amp;/g, '&') : null;

export { TraceMoe };