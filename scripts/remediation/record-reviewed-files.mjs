// 검토와 자산 정리를 마친 뒤 명시적으로 실행한다. 일반 빌드는 검토 기록을 갱신하지 않는다.
import {readFile,writeFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {filesIn,hash,REVIEW_FILE,forbiddenPath} from './verify-distribution.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const requested=process.argv.slice(2);
if(!requested.length)throw new Error('검토를 마친 프로젝트 ID를 명시하세요.');
for(const id of requested){
 if(!/^[a-z0-9-]+$/.test(id))throw Error('올바르지 않은 ID');
 const directory=path.join(root,'templates',id,'src');
 const provenance=JSON.parse(await readFile(path.join(directory,'ASSET-PROVENANCE.json'),'utf8'));
 const assets=new Map(provenance.assets.map(asset=>[asset.file,asset]));
 const files={};
 for(const file of await filesIn(directory)){
  if(forbiddenPath.test(file))throw Error(`${id}: 원본 자산 경로가 남아 있습니다: ${file}`);
  const asset=assets.get(file);
  files[file]={sha256:hash(await readFile(path.join(directory,file))),origin:asset?.origin||'reviewed-project-source'};
 }
 await writeFile(path.join(directory,REVIEW_FILE),JSON.stringify({schemaVersion:1,project:id,status:'reviewed',reviewDate:new Date().toISOString().slice(0,10),scope:'현재 파일 목록과 제작/라이선스 기록. 법률상 비침해나 상표 등록 가능성의 보증이 아님.',files},null,2)+'\n');
 console.log(`${id}: ${Object.keys(files).length}개 파일 검토 기록`);
}
