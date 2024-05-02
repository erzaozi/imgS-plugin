import { FormData } from 'formdata-polyfill/esm.min.js'
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import Config from './Config.js';

const BASE_URL = 'https://www.google.com'

async function Google(url) {
    let form = new FormData()
    form.append('image_url', url)
    form.append('sbisrc', 1)
    form.append('safe', Config.getConfig().Google.safe ? 'on' : 'off')
    let params = new URLSearchParams(form).toString()

    let launchParam = { headless: 'new', args: ['--lang=zh-CN'] }
    if (Config.getConfig().proxy.enable) {
        launchParam.args.push('--proxy-server=http://' + Config.getConfig().proxy.host + ':' + Config.getConfig().proxy.port)
    }

    const browser = await puppeteer.launch(launchParam)
    const page = await browser.newPage()
    await page.goto(`${BASE_URL}/searchbyimage?${params}`, { waitUntil: 'networkidle0' })
    await page.setViewport({ width: 1080, height: 1920 })

    const content = await page.content()
    await browser.close()

    logger.warn(content)
    return parse(content)
}

async function parse(body) {
    const $ = cheerio.load(body, { decodeEntities: false });

    let resultList = []

    if ($('.normal-header div').first()?.text() === "包含匹配图片的页面") {
        const parentsDivs = $('.normal-header').parent().children('div')
        parentsDivs.each((i, elem) => {
            const className = $(elem).attr('class')
            if (className && className !== "normal-header") {
                const title = $(elem).find('h3').text()
                const url = $(elem).find('a').attr('href')
                const pic = $(elem).find('a').children('div').children('img').attr('src')
                resultList.push({ title, url, pic })
            }
        })
        return resultList
    }
    return []
}

export { Google }
