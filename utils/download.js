import fetch from 'node-fetch';
import { writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { createHash } from 'crypto';
import { pluginResources } from '../model/path.js';

const downloadImage = async (url) => {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Image fetch failed: ${res.statusText}`);

        const arrayBuffer = await res.arrayBuffer();
        const buf = Buffer.from(arrayBuffer);
        const ext = res.headers.get('content-type').split('/')[1] || 'jpg';
        const filename = `${createHash('sha256').update(buf).digest('hex')}.${ext}`;
        const filepath = `${pluginResources}/cache/`;

        if (!existsSync(filepath)) {
            mkdirSync(filepath, { recursive: true });
        }

        writeFileSync(filepath + filename, buf);

        setTimeout(() => {
            if (existsSync(filepath + filename)) {
                unlinkSync(filepath + filename);
            }
        }, 60 * 1000);

        return filepath + filename;
    } catch (err) {
        logger.error('下载待搜索图片失败', err);
        return null;
    }
};

export default downloadImage;