export const cats = {all:'전체 상품',beauty:'뷰티',scent:'향수',fashion:'패션',travel:'여행용품',sale:'혜택 상품'};
export const items = [
  {id:'glass',brand:'베르드 폼',name:'그린 글라스 오 드 퍼퓸 50 mL',cat:'scent',image:'scent.jpg',tone:'#e3eee3',price:4600,list:5800,rank:1,options:['50 mL'],spec:'50 mL · 유리 보틀',desc:'그린 글라스라는 가상의 향을 투명한 초록 유리와 차분한 무광 캡으로 표현했습니다. 빛이 닿을 때 병의 두께와 색이 드러나는 구성이 특징입니다.'},
  {id:'mist',brand:'아쿠아 노트',name:'포그 미스트 80 mL',cat:'beauty',image:'mist.svg',tone:'#e6f1e8',price:1700,list:2300,rank:2,options:['민트 에디션','아이보리 에디션'],spec:'80 mL · 미스트 용기',desc:'맑은 공기에서 떠올린 색과 원통형 용기를 결합한 미스트 콘셉트입니다. 이동 중에도 손에 들기 편한 형태를 상상했습니다.'},
  {id:'cream',brand:'아쿠아 노트',name:'라일락 크림 50 mL',cat:'beauty',image:'cream.svg',tone:'#ece7f3',price:2400,list:3000,rank:4,options:['50 mL'],spec:'50 mL · 둥근 용기',desc:'낮은 비례와 라일락색 뚜껑이 특징인 가상의 크림 패키지입니다. 비슷한 톤의 여행용 파우치와 나란히 놓이는 장면을 그렸습니다.'},
  {id:'pouch',brand:'오프데크',name:'데이 패스 파우치',cat:'travel',image:'pouch.svg',tone:'#f2e9db',price:1900,list:2400,rank:5,options:['샌드','차콜'],spec:'180 × 120 mm · 지퍼 파우치',desc:'작은 소지품을 한곳에 담을 수 있도록 간결하게 디자인한 파우치입니다. 직물의 결, 부드러운 모서리와 작은 지퍼 고리가 특징입니다.'},
  {id:'case',brand:'오프데크',name:'웨이브 캐빈 케이스',cat:'travel',image:'case.jpg',tone:'#f4e4d7',price:12900,list:15500,rank:3,options:['웜 샌드'],spec:'하드 셸 · 스피너 휠 4개',desc:'따뜻한 모래색과 부드러운 가로 결을 더한 가상의 여행 가방입니다. 실제 크기 및 항공사 기내 반입 기준과는 무관한 디자인 예시입니다.'},
  {id:'glasses',brand:'라운드 프레임',name:'터미널 선글라스',cat:'fashion',image:'glasses.svg',tone:'#f0e6d4',price:6800,list:7900,rank:6,options:['토터스'],spec:'아세테이트 프레임 콘셉트 · 케이스',desc:'둥근 모서리와 짙은 브라운을 조합한 프레임 디자인입니다. 렌즈 성능을 보증하는 실제 상품은 아닙니다.'},
  {id:'balm',brand:'멜로 랩',name:'코랄 틴트 밤 3 g',cat:'beauty',image:'balm.svg',tone:'#fae5e0',price:1200,list:1200,rank:7,options:['소프트 코랄'],spec:'3 g · 스틱 용기',desc:'여행의 밝은 색을 담은 코랄 스틱 패키지입니다. 제품 정보는 콘셉트 설명이며 실제 화장품의 효능이나 사용법을 안내하지 않습니다.'},
  {id:'tag',brand:'오프데크',name:'포레스트 러기지 태그',cat:'travel',image:'tag.svg',tone:'#e8ede0',price:900,list:900,rank:8,options:['포레스트 그린'],spec:'직조 태그 · 메탈 버클',desc:'가방을 알아보기 쉽게 색과 질감으로 구분하는 태그를 상상했습니다. 짙은 녹색 직물과 간결한 버클을 한데 묶었습니다.'}
];
export const campaigns=[
 {id:'green',label:'여행 전 뷰티 에디트',tag:'THE GREEN EDIT',title:'여행의 첫 향을\n고르는 시간',lead:'초록빛 향과 가벼운 뷰티 아이템을 한자리에.',image:'campaign.jpg',tone:'green',products:['glass','mist','cream','balm'],body:'아침 빛이 드는 창가에서 출발하는 장면을 그렸습니다. 초록빛 유리, 부드러운 라일락, 따뜻한 코랄을 한 흐름으로 둘러보세요.'},
 {id:'cabin',label:'가볍게 떠나는 준비',tag:'CABIN ESSENTIALS',title:'가볍게 담고,\n조금 더 멀리',lead:'캐빈 케이스부터 파우치까지 여행의 작은 준비.',image:'case.jpg',tone:'sand',products:['case','pouch','tag','glasses'],body:'출발 전 챙길 물건을 정리하는 순간에 주목했습니다. 바퀴와 지퍼, 태그의 작은 디테일을 살펴보세요.'},
 {id:'fragrance',label:'향수 컬렉션',tag:'A SCENT TO GO',title:'한 병에 담은\n여행의 기억',lead:'햇빛과 숲의 색을 담은 그린 글라스.',image:'scent.jpg',tone:'mint',products:['glass','mist','balm'],body:'소재와 빛으로 향을 표현한 가상의 컬렉션입니다. 그린 글라스와 가방에 넣기 좋은 작은 뷰티 소품을 함께 소개합니다.'}
];
export const byId=id=>items.find(item=>item.id===id);
export const discount=p=>Math.round((p.list-p.price)/p.list*100);
