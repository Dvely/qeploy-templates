import {readdir,readFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
export const REVIEW_FILE='DISTRIBUTION-REVIEW.json';
export const forbiddenPath=/(?:^|\/)(?:_next|wp-content|wp-includes|use\.typekit\.net)(?:\/|$)|EverydayGothic|OndamSans|CJ_ONLYONE|OPPOSans|rs6\.min\.js/i;
const media=/\.(?:svg|png|jpe?g|gif|webp|avif|ico|mp4|webm|mp3|wav|ogg|pdf|woff2?|ttf|otf|eot)$/i;
const font=/\.(?:woff2?|ttf|otf|eot)$/i;
export const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export async function filesIn(directory,prefix='') {
 const result=[];
 for(const entry of (await readdir(path.join(directory,prefix),{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
  const file=path.posix.join(prefix,entry.name);
  if(entry.isSymbolicLink())throw new Error(`배포 경로의 심볼릭 링크는 허용하지 않습니다: ${file}`);
  if(entry.isDirectory())result.push(...await filesIn(directory,file));
  else if(entry.isFile()&&file!==REVIEW_FILE)result.push(file);
 }
 return result;
}
export async function verifyTemplateDirectory(directory,id) {
 const review=JSON.parse(await readFile(path.join(directory,REVIEW_FILE),'utf8'));
 if(review.project!==id||review.status!=='reviewed')throw new Error(`${id}: 배포 검토 기록 없음`);
 const files=await filesIn(directory),registered=Object.keys(review.files);
 if(files.length!==registered.length||files.some(file=>!Object.hasOwn(review.files,file)))throw new Error(`${id}: 검토하지 않은 파일이 추가되거나 삭제되었습니다`);
 const provenance=JSON.parse(await readFile(path.join(directory,'ASSET-PROVENANCE.json'),'utf8'));
 const assets=new Map((provenance.assets||[]).map(asset=>[asset.file,asset]));
 for(const file of files){
  if(forbiddenPath.test(file))throw new Error(`${id}: 배포 금지 원본 경로 ${file}`);
  const entry=review.files[file],bytes=await readFile(path.join(directory,file));
  if(hash(bytes)!==entry.sha256)throw new Error(`${id}: 검토 이후 변경된 파일 ${file}`);
  if(!entry.origin)throw new Error(`${id}: 제작/이용 근거 누락 ${file}`);
  if(media.test(file)){
   const asset=assets.get(file);
   if(!asset||!asset.origin)throw new Error(`${id}: 자산 출처 기록 없음 ${file}`);
   if(asset.sha256&&asset.sha256!==entry.sha256)throw new Error(`${id}: 자산 기록 해시 불일치 ${file}`);
   if(font.test(file)){
    if(asset.origin!=='open-font-license'||!asset.licenseFile)throw new Error(`${id}: 서체 이용 조건 누락 ${file}`);
    const license=await readFile(path.join(directory,asset.licenseFile),'utf8');
    if(!/SIL OPEN FONT LICENSE/i.test(license))throw new Error(`${id}: 서체 라이선스 전문 확인 필요 ${file}`);
   }
  }
 }
 return {project:id,files:files.length,assets:assets.size};
}
