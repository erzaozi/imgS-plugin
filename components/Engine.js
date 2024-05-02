import { Ascii2d } from './Ascii2d.js';
import { SauceNAO } from './SauceNAO.js';
import { IqDB } from './IqDB.js';
import { Yandex } from './Yandex.js';
import { TraceMoe } from './TraceMoe.js';
import { AnimeTrace } from './AnimeTrace.js';
import { EHentai } from './EHentai.js';
import { Baidu } from './Baidu.js';
import { Google } from "./Google.js";

const Engine = {
    Ascii2d,
    SauceNAO,
    IqDB,
    Yandex,
    TraceMoe,
    AnimeTrace,
    EHentai,
    Baidu,
    Google,
    A2: Ascii2d,
    SN: SauceNAO,
    IQ: IqDB,
    YD: Yandex,
    TM: TraceMoe,
    AT: AnimeTrace,
    EH: EHentai,
    BD: Baidu,
    GL: Google
};

export default Engine;