/* Fictional local map content in the original store-search frame. No external map or geolocation requests. */
(function () {
  const container=document.getElementById('map');
  if(!container)return;
  const stores=[{name:'데이웰 성수 스튜디오점',area:'성수',x:43,y:46},{name:'데이웰 가든 라운지점',area:'마곡',x:22,y:58},{name:'데이웰 연남 데일리점',area:'연남',x:66,y:32},{name:'데이웰 서초 온유점',area:'서초',x:73,y:68}];
  container.innerHTML='<div class="daywell-map"><svg viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-label="가상 매장 위치도"><rect width="1200" height="900" fill="#f5f3e8"/><g fill="#e0eacb"><path d="M0 0h320v160H0ZM890 0h310v260H890ZM800 620h400v280H800ZM0 540h190v360H0Z"/></g><g stroke="white" stroke-width="36" fill="none"><path d="M-40 270L1240 590M280-40l130 980M730-40l-190 980M0 130l1200 100M0 760l1200-80"/></g><path d="M-50 470Q300 680 630 570t680-110" stroke="#badce8" stroke-width="95" fill="none"/><g font-family="Arial,sans-serif" fill="#858581" font-size="24"><text x="330" y="150">DAILY TOWN</text><text x="830" y="380">GARDEN DISTRICT</text><text x="250" y="800">DAYWELL NEIGHBORHOOD</text></g></svg><div class="daywell-map-controls"><button type="button" aria-label="지도 확대">＋</button><button type="button" aria-label="지도 축소">−</button></div><p class="daywell-map-label">데이웰24 · 가상 매장 안내</p></div>';
  const map=container.firstElementChild;
  stores.forEach(store=>{const pin=document.createElement('button');pin.type='button';pin.className='daywell-store-pin';pin.style.left=store.x+'%';pin.style.top=store.y+'%';pin.textContent='24';pin.setAttribute('aria-label',store.name);pin.onclick=()=>map.querySelector('.daywell-map-label').textContent=store.name+' · 커피 / 택배 / 데일리 푸드';map.append(pin);});
  let scale=1;
  map.querySelectorAll('.daywell-map-controls button').forEach((button,index)=>button.onclick=()=>{scale=Math.max(1,Math.min(2,scale+(index===0?.2:-.2)));map.querySelector('svg').style.transform=`scale(${scale})`;});
  const input=document.querySelector('.searchBar');
  const query=new URLSearchParams(location.search).get('search')||'';
  if(input)input.value=query;
  function search(){const term=(input?.value||'').trim();let matches=stores.filter(s=>(s.name+s.area).includes(term));map.querySelector('.daywell-map-label').textContent=matches.length?matches.map(s=>s.name).join(' · '):'검색 결과가 없습니다. 성수·연남·마곡·서초로 찾아보세요.';map.querySelectorAll('.daywell-store-pin').forEach((pin,index)=>pin.hidden=!matches.includes(stores[index]));}
  input?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();search();}});
  document.querySelector('.searchBtn')?.addEventListener('click',search);
  document.querySelectorAll('.choiceServiceTag .tag').forEach(tag=>tag.addEventListener('click',()=>tag.classList.toggle('focus')));
  document.querySelectorAll('.choicePlaceItem').forEach((item,index)=>{
    const list=item.querySelector('.valueList');
    const regions=index===0?['전체','서울']:['전체','성수','연남','마곡','서초'];
    regions.forEach(region=>{const option=document.createElement('li');option.textContent=region;option.onclick=event=>{event.stopPropagation();item.querySelector('.choiceVal').textContent=region;list.classList.remove('open');if(input){input.value=region==='서울'||region==='전체'?'':region;search();}};list.append(option);});
    item.querySelector('.placeHolderWrap').addEventListener('click',event=>{event.stopPropagation();list.classList.toggle('open');});
  });
  if(query)search();
})();
