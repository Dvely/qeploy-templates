import {writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {pages,header,footer,render} from './ongyeol-views.js';
import {categories,products} from './ongyeol-data.js';
const root=path.dirname(fileURLToPath(import.meta.url));
await mkdir(path.join(root,'downloads'),{recursive:true});
for(const [file,page,title,key=''] of pages){
  const html=`<!doctype html>
<html lang="ko" id="top">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} | ONGYEOL HAUS 온결 하우스</title>
<meta name="description" content="온결 하우스의 ${title}. 나무의 결과 빛을 담은 인테리어 소재, 도어·중문·창호·보드·목재 컬렉션.">
<meta name="theme-color" content="#f3f3f3">
<link rel="icon" href="images/ongyeol-mark.svg" type="image/svg+xml">
<link rel="stylesheet" href="ongyeol.css">
<link rel="stylesheet" href="ongyeol-mobile.css">
<link rel="stylesheet" href="ongyeol-print.css" media="print">
${page==='home'?'<link rel="preload" href="images/ongyeol-hero.png" as="image">':''}
</head>
<body data-page="${page}" data-key="${key}">
${header(page)}
${render(page,key)}
${footer()}
<script type="module" src="ongyeol.js"></script>
</body>
</html>\n`;
  await writeFile(path.join(root,file),html);
}
for(const c of categories){
 const guide=`ONGYEOL HAUS | ${c.name} 선택 가이드\n\n${c.note}\n\n제품 구성\n${products.filter(p=>p.category===c.id).map(p=>`${p.code} ${p.name} / ${p.type}`).join('\n')}\n\n선택 전 확인\n1. 공간과 치수를 확인합니다.\n2. 주변 마감과 색상 샘플을 함께 비교합니다.\n3. 현장 조건에 맞는 구성을 상담합니다.\n4. 실제 시공은 공급사의 시방서와 전문 작업자의 지침을 확인합니다.\n\n온결 하우스는 가상 브랜드입니다. 제품 정보는 템플릿 시연용 예시입니다.\n`;
 await writeFile(path.join(root,'downloads',`ongyeol-${c.id}-guide.txt`),guide);
}
console.log(`온결 하우스 ${pages.length}개 화면 · ${categories.length}개 분류 · ${products.length}개 제품 생성`);
