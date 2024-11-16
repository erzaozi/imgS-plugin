import fetch from 'node-fetch';
import { load } from 'cheerio';
import FormData from 'form-data';
import Config from './Config.js';

const BASE_URL = 'https://soutubot.moe';
const API_SEARCH_URL = `${BASE_URL}/api/search`;
const DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    "authority": "soutubot.moe",
    "origin": BASE_URL,
    "referer": BASE_URL,
    "x-requested-with": "XMLHttpRequest"
};

let M = null;

async function NHentai(url) {
    const form = new FormData();
    form.append('file', Buffer.from(await fetch(url).then(res => res.arrayBuffer())), { filename: "image" });
    form.append("factor", Config.getConfig().NHentai.factor ? 1.4 : 1.2);
    return await request(form);
}

async function request(form) {
    const html = await fetch(BASE_URL).then(res => res.text());
    const $ = load(html);
    const eles = $("script");
    for (const ele of eles) {
        const h = $(ele).html() || "";
        if (!h.includes("window.GLOBAL")) continue;
        const match = h
            .replace(/window\.GLOBAL =/g, "")
            .replace(/JSON\.parse\(.+\)/g, "''")
            .replace(/ |\n|\r/g, "")
            .trim()
            .match(/{siteConfig:'',m:(?<M>\d+),}/);
        M = Number(match?.groups?.M);
    }

    DEFAULT_HEADERS['x-api-key'] = Buffer.from((Math.pow(Math.floor(Date.now() / 1000), 2) + Math.pow(DEFAULT_HEADERS["User-Agent"].length, 2) + M).toString()).toString('base64').split('').reverse().join('').replace(/=/g, '');

    const result = await fetch(API_SEARCH_URL, {
        method: "POST",
        headers: { ...form.getHeaders(), ...DEFAULT_HEADERS },
        body: form,
    }).then(res => res.json());
    return parse(result);
}

function parse(result) {
    return result['data']
}

export { NHentai };