import { access } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const ids=['samwonpaper','rosiel','daywell24','moav-live','ondam-foods','luon-studio','seon-apparel'];
export async function buildOriginalSites(root) {
 for (const id of ids) {
  const file=path.join(root,'templates',id,'src','original-build.mjs');
  try {await access(file);} catch {continue;}
  const {buildOriginalSite}=await import(pathToFileURL(file));
  console.log(`${id}: 독립 디자인 ${await buildOriginalSite(path.dirname(file))}개 화면 생성`);
 }
}
