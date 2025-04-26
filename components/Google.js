import { FormData } from 'formdata-polyfill/esm.min.js';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import Config from './Config.js';

const BASE_URL = 'https://lens.google.com';
async function Google(url) {
    let form = new FormData()
    form.append('url', url);
    form.append('hl', 'zh-CN');
    form.append('re', 'df');
    form.append('st', Date.now());
    form.append('vpw', 1052);
    form.append('vph', 1348);
    form.append('ep', 'gsbubu');

    let params = new URLSearchParams(form).toString();

    let launchParam = {
        headless: 'new',
        args: [
            '--disable-blink-features=AutomationControlled',
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.5410.0 Safari/537.36',
            '--no-sandbox'
        ],
    };
    if (Config.getConfig().proxy.enable) {
        launchParam.args.push('--proxy-server=http://' + Config.getConfig().proxy.host + ':' + Config.getConfig().proxy.port);
    }

    const browser = await puppeteer.launch(launchParam);
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/uploadbyurl?${params}`, { waitUntil: 'networkidle0' });
    await page.setViewport({ width: 1080, height: 1920 });
    const content = await page.content();
    await browser.close();

    return parse(content);
}

async function parse(body) {
    const $ = cheerio.load(body, { decodeEntities: false });
    const results = [];

    $('.srKDX.cvP2Ce > .kb0PBd.cvP2Ce').each((_, el) => {
        const $el = $(el);
        const result = {
            title: $el.find('.Yt787').text().trim(),
            image: $el.find('img').attr('src').replace('data:image/jpeg;base64,', ''),
            link: ($el.find('.LBcIee').attr('href') || '')
        };

        if (result.title
            && result.image?.startsWith('/9j/')
            && result.link?.startsWith('http')
        ) {
            results.push(result);
        }
    });

    return results;
}

export { Google }
