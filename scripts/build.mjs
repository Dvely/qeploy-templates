// templates/ 를 읽어 Pages 로 발행할 site/ 를 만든다.
//
// 산출물 셋:
//   site/catalog.json          BE 가 카탈로그 API 로 서빙하는 정본
//   site/t/<id>/               데모. FE 갤러리가 iframe 으로 띄운다
//   site/src/<id>.tar.gz       씨앗. 첫 CODE 스텝에서 컨테이너가 받아 푼다
//
// 씨딩을 tarball 로 주는 이유: 컨테이너 안에서 파일 목록을 몰라도 한 번의 GET + tar 로 끝난다.
// raw URL 을 파일마다 받으면 목록을 어딘가에 또 적어야 하고 그 목록이 실제와 어긋난다.
import { readdir, readFile, mkdir, cp, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const run = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'templates');
const OUT = path.join(ROOT, 'site');
const BASE = process.env.PAGES_BASE_URL ?? 'https://dvely.github.io/qeploy-templates';

const REQUIRED = ['id', 'name', 'description', 'stack', 'contentHints'];

const ids = (await readdir(SRC, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

if (ids.length === 0) throw new Error('templates/ 가 비어 있다');

await mkdir(path.join(OUT, 't'), { recursive: true });
await mkdir(path.join(OUT, 'src'), { recursive: true });

const catalog = [];

for (const id of ids) {
    const dir = path.join(SRC, id);
    const manifest = JSON.parse(await readFile(path.join(dir, 'template.json'), 'utf8'));

    // 매니페스트가 디렉터리명과 어긋나면 데모 URL 과 씨앗 URL 이 서로 다른 것을 가리킨다.
    if (manifest.id !== id) throw new Error(`${id}: template.json 의 id 가 디렉터리명과 다르다 (${manifest.id})`);
    for (const key of REQUIRED) {
        if (manifest[key] === undefined) throw new Error(`${id}: template.json 에 ${key} 가 없다`);
    }

    const src = path.join(dir, 'src');
    await cp(src, path.join(OUT, 't', id), { recursive: true });
    // -C 로 src 안에서 묶어야 압축 해제 시 경로에 src/ 가 끼지 않는다.
    await run('tar', ['-czf', path.join(OUT, 'src', `${id}.tar.gz`), '-C', src, '.']);

    catalog.push({
        ...manifest,
        demoUrl: `${BASE}/t/${id}/`,
        sourceUrl: `${BASE}/src/${id}.tar.gz`,
    });
}

await writeFile(
    path.join(OUT, 'catalog.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), templates: catalog }, null, 2) + '\n',
);

// Jekyll 이 _ 로 시작하는 경로를 삼키는 것을 막는다.
await writeFile(path.join(OUT, '.nojekyll'), '');

const cards = catalog
    .map(
        (t) => `      <li>
        <a href="t/${t.id}/">
          <strong>${t.name}</strong>
          <span>${t.description}</span>
          <code>${t.id}</code>
        </a>
      </li>`,
    )
    .join('\n');

await writeFile(
    path.join(OUT, 'index.html'),
    `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Qeploy 템플릿</title>
<style>
  :root { color-scheme: light; }
  body { margin: 0; padding: 3rem 1.5rem; font: 16px/1.6 system-ui, -apple-system, "Apple SD Gothic Neo", sans-serif;
         color: #16181d; background: #f7f8fa; }
  main { max-width: 52rem; margin: 0 auto; }
  h1 { font-size: 1.5rem; margin: 0 0 .5rem; }
  p.lead { margin: 0 0 2.5rem; color: #5b6472; }
  ul { list-style: none; padding: 0; margin: 0; display: grid; gap: .75rem; }
  a { display: grid; gap: .25rem; padding: 1.1rem 1.25rem; border: 1px solid #e2e5ea; border-radius: .75rem;
      background: #fff; text-decoration: none; color: inherit; }
  a:hover { border-color: #9aa4b2; }
  strong { font-size: 1.05rem; }
  span { color: #5b6472; font-size: .925rem; }
  code { font-size: .8rem; color: #8b95a3; }
</style>
</head>
<body>
  <main>
    <h1>Qeploy 템플릿</h1>
    <p class="lead">클릭해서 직접 조작해볼 수 있습니다. 카탈로그 정본은 <a href="catalog.json">catalog.json</a>.</p>
    <ul>
${cards}
    </ul>
  </main>
</body>
</html>
`,
);

console.log(`템플릿 ${catalog.length}종 빌드: ${catalog.map((t) => t.id).join(', ')}`);
