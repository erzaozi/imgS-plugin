import fetch from 'node-fetch';
import { fileFromSync } from 'fetch-blob/from.js';
import { FormData } from 'formdata-polyfill/esm.min.js';
import downloadImage from '../utils/download.js';
import Config from './Config.js';
import { HttpsProxyAgent } from 'https-proxy-agent';
import Jimp from 'jimp';

const BASE_URL = 'https://api.animetrace.com/v1/search';

async function AnimeTrace(url) {
    const imagePath = await downloadImage(url);

    const form = new FormData();
    form.append('image', fileFromSync(imagePath));
    return await request(form, imagePath);
}

async function request(form, imagePath) {

    let agent = null
    if (Config.getConfig().proxy.enable) {
        let proxy = 'http://' + Config.getConfig().proxy.host + ':' + Config.getConfig().proxy.port
        agent = new HttpsProxyAgent(proxy)
    }

    const model = Config.getConfig().AnimeTrace.model;
    const mode = Config.getConfig().AnimeTrace.mode;

    const response = await fetch(
        `${BASE_URL}?model=${model ? model : 'anime'}&force_one=${mode ? mode : 1}`,
        {
            method: 'POST',
            body: form
        }
    ).then(res => res.json());

    if (response.code === 0) {
        return await parse(response.data, imagePath);
    } else {
        console.log(response);
        throw new Error('请求失败');
    }
}

async function parse(response, imagePath) {
    if (await Config.getConfig().AnimeTrace.preview) {
        let image;
        try {
            image = await Jimp.read(imagePath);
            const width = image.getWidth();
            const height = image.getHeight();
            for (let i = 0; i < response.length; i++) {
                const box = response[i].box;
                const newImage = image.clone();
                // 裁切图片
                newImage.crop(
                    width * box[0],
                    height * box[1],
                    width * (box[2] - box[0]),
                    height * (box[3] - box[1])
                );
                response[i].preview = (await newImage.getBase64Async(Jimp.AUTO)).split(',')[1];
            }
        } catch (error) {
            for (let i = 0; i < response.length; i++) {
                response[i].preview = 'fail unsupport image type';
            }
        }
    }
    return response;
}

export { AnimeTrace };
