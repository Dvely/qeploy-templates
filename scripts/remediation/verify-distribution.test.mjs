import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {verifyTemplateDirectory,REVIEW_FILE,hash} from './verify-distribution.mjs';
async function fixture(){
 const dir=await mkdtemp(path.join(tmpdir(),'qeploy-rights-'));
 const assets={assets:[{file:'art.svg',origin:'original-vector'}]};
 const contents={'index.html':'<!doctype html><title>Independent demo</title>','art.svg':'<svg xmlns="http://www.w3.org/2000/svg"><circle r="5"/></svg>','ASSET-PROVENANCE.json':JSON.stringify(assets)};
 const review={project:'demo',status:'reviewed',files:Object.fromEntries(Object.entries(contents).map(([file,value])=>[file,{sha256:hash(Buffer.from(value)),origin:'original'}]))};
 for(const [file,value] of Object.entries(contents))await writeFile(path.join(dir,file),value);
 await writeFile(path.join(dir,REVIEW_FILE),JSON.stringify(review));
 return {dir,review};
}
test('기록한 소스와 자산만 배포 허용',async t=>{const {dir}=await fixture();t.after(()=>rm(dir,{recursive:true,force:true}));assert.equal((await verifyTemplateDirectory(dir,'demo')).assets,1);});
test('검토 이후 소스 변경은 배포 차단',async t=>{const {dir}=await fixture();t.after(()=>rm(dir,{recursive:true,force:true}));await writeFile(path.join(dir,'index.html'),'changed');await assert.rejects(verifyTemplateDirectory(dir,'demo'),/검토 이후 변경/);});
test('추가한 미검토 폰트는 배포 차단',async t=>{const {dir}=await fixture();t.after(()=>rm(dir,{recursive:true,force:true}));await writeFile(path.join(dir,'unreviewed.woff2'),'font');await assert.rejects(verifyTemplateDirectory(dir,'demo'),/검토하지 않은 파일/);});
test('해시가 있어도 출처 없는 자산은 배포 차단',async t=>{const {dir,review}=await fixture();t.after(()=>rm(dir,{recursive:true,force:true}));const contents=JSON.stringify({assets:[]});await writeFile(path.join(dir,'ASSET-PROVENANCE.json'),contents);review.files['ASSET-PROVENANCE.json'].sha256=hash(Buffer.from(contents));await writeFile(path.join(dir,REVIEW_FILE),JSON.stringify(review));await assert.rejects(verifyTemplateDirectory(dir,'demo'),/자산 출처 기록 없음/);});
