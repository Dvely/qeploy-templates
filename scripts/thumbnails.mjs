// site/t/<id>/ 데모를 헤드리스 브라우저로 찍어 site/t/<id>/thumbnail.jpg 를 만든다.
// build.mjs 다음에 돈다(site/t/ 가 있어야 한다).
//
// 왜 손으로 넣지 않는가: 썸네일을 커밋해 두면 템플릿을 고칠 때 같이 고치지 않아 반드시 어긋난다.
// 데모에서 찍으면 템플릿이 곧 정본이고, 어긋날 여지가 없다.
//
// 왜 file:// 이 아니라 로컬 서버인가: 데모는 상대 경로로 자산을 받고 스크립트도 돈다. file:// 은
// 오리진 규칙이 달라 실제 서빙과 다르게 동작할 수 있다 — 실제와 같은 http 로 찍는다.
//
// 왜 .jpg 인가: 이 저장소에 이미 확장자와 실제 형식이 어긋난 파일이 79개 있다(.png 인데 JPEG).
// 같은 실수를 새로 만들지 않는다 — JPEG 로 찍고 이름도 .jpg 로 둔다.
import { createServer } from 'node:http';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = path.resolve(import.meta.dirname, '..');
const SITE = path.join(ROOT, 'site');
const DEMOS = path.join(SITE, 't');

// 카드용 썸네일이므로 첫 화면만 찍는다. 전체 페이지를 찍으면 5000px 짜리 띠가 되어 카드에서
// 알아볼 수 없다. scale 0.5 로 640x400 을 만들어 바이트를 줄인다(데모 이미지 총량이 24MB 다).
const VIEWPORT = { width: 1280, height: 800 };
const SCALE = 0.5;
const QUALITY = 78;

const MIME = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon',
    '.woff': 'font/woff', '.woff2': 'font/woff2',
};

const server = createServer(async (req, res) => {
    try {
        const url = new URL(req.url, 'http://127.0.0.1');
        let file = path.join(SITE, decodeURIComponent(url.pathname));
        // site/ 밖으로 나가는 경로는 거부한다(정적 서버의 기본 위생).
        if (!file.startsWith(SITE)) {
            res.writeHead(403).end();
            return;
        }
        if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
        res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' });
        res.end(await readFile(file));
    } catch {
        res.writeHead(404).end();
    }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const ids = (await readdir(DEMOS, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
if (ids.length === 0) throw new Error('site/t/ 가 비었다 — build.mjs 를 먼저 돌려야 한다');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: SCALE });

for (const id of ids) {
    const response = await page.goto(`${base}/t/${id}/`, { waitUntil: 'load' });
    if (!response?.ok()) throw new Error(`${id}: 데모를 열지 못했다 (${response?.status()})`);
    // 히어로 이미지·웹폰트가 올라오기 전에 찍으면 빈 상자만 남는다. 둘 다 기다린다.
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
        path: path.join(DEMOS, id, 'thumbnail.jpg'),
        type: 'jpeg',
        quality: QUALITY,
        // fullPage 를 켜지 않는다 — 첫 화면만이 카드에서 의미가 있다.
    });
    const { size } = await stat(path.join(DEMOS, id, 'thumbnail.jpg'));
    console.log(`  ${id}  ${Math.round(size / 1024)}KB`);
}

await browser.close();
server.close();
console.log(`썸네일 ${ids.length}종 생성`);
