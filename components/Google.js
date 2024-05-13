import { FormData } from 'formdata-polyfill/esm.min.js';
import cheerio from 'cheerio';
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

    let launchParam = { headless: 'new', args: ['--lang=zh-CN'] };
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

    let resultList = []
    $('img').each(function (i, elem) {
        if ($(this).attr('alt') === '产品的来源网域的网站图标。') {
            const info = $(this).parent().parent().parent();
            resultList.push({ title: info.attr('data-item-title'), url: info.attr('data-action-url'), pic: info.attr('data-thumbnail-url') });
        }
    });
    return resultList;
}

export { Google }