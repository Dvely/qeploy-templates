export const categories={all:'전체 상품',best:'베스트',gift:'선물세트',tuna:'참치',salmon:'연어',seafood:'수산물',pantry:'곁들임'};
export const products=[
 {id:'table-tuna',artist:'파도 셀렉트',title:'참다랑어 한상 모둠',category:'tuna',format:'모둠 콘셉트',price:42900,list:52000,asset:'campaign.jpg',tone:'#d9e5e4',fresh:true,pick:true,options:['300 g','300 g · 선물 포장'],spec:'참다랑어 모둠 300 g',intro:'짙은 붉은 살과 밝은 분홍색 부위를 한 접시에 놓은 모둠입니다. 접시에 담았을 때 색이 대비되는 모습을 보여주는 창작 상품입니다.'},
 {id:'salmon',artist:'파도 데일리',title:'노르딕 연어 필렛',category:'salmon',format:'가열용 콘셉트',price:23900,list:29000,asset:'salmon.jpg',tone:'#f1e0d8',fresh:true,pick:true,options:['400 g'],spec:'연어 필렛 400 g',intro:'레몬과 허브를 더한 연어 한 접시를 상상했습니다. 사진은 조리 연출 예시이며 가열용 상품 콘셉트입니다.'},
 {id:'gift',artist:'파도 셀렉트',title:'바다 한상 선물 상자',category:'gift',format:'참치·연어 구성',price:64900,list:78000,asset:'gift.jpg',tone:'#e6e3d8',fresh:true,pick:true,options:['기본 선물 상자'],spec:'참다랑어 300 g · 연어 400 g',intro:'짙은 파란 상자에 참치와 연어 구성을 나눠 담았습니다. 소중한 날 차릴 식탁을 생각하며 만든 선물 콘셉트입니다.'},
 {id:'akami',artist:'파도 데일리',title:'참다랑어 붉은살',category:'tuna',format:'손질 블록 콘셉트',price:27900,list:33000,asset:'akami.svg',tone:'#e5e8eb',fresh:false,pick:true,options:['250 g'],spec:'참다랑어 붉은살 250 g',intro:'루비색 살결을 길게 담은 손질 블록 콘셉트입니다. 질감과 색을 감상할 수 있도록 그림으로 구성했습니다.'},
 {id:'buri',artist:'파도 셀렉트',title:'방어 순살 한 팩',category:'seafood',format:'순살 콘셉트',price:32900,list:39000,asset:'buri.svg',tone:'#dcece8',fresh:false,pick:true,options:['300 g'],spec:'방어 순살 300 g',intro:'옅은 분홍빛과 탄탄한 형태를 살린 가상의 방어 구성입니다. 작은 접시에 곁들이기 좋은 양을 상상했습니다.'},
 {id:'shrimp',artist:'파도 데일리',title:'손질 새우 한 팩',category:'seafood',format:'가열용 콘셉트',price:16900,list:19900,asset:'shrimp.svg',tone:'#fae6da',fresh:false,pick:false,options:['250 g'],spec:'손질 새우 250 g',intro:'가볍게 볶거나 샐러드에 곁들이는 장면을 담은 손질 새우 콘셉트입니다. 실제 상품 및 원산지 표시는 아닙니다.'},
 {id:'sauce',artist:'파도 키친',title:'유자 간장과 허브 소스',category:'pantry',format:'소스 2종',price:9900,list:9900,asset:'sauce.svg',tone:'#f1e6d6',fresh:false,pick:false,options:['2종 세트'],spec:'유자 간장 120 mL · 허브 소스 120 mL',intro:'은은한 유자 향과 푸른 허브 색을 나란히 보여주는 가상의 소스 세트입니다.'},
 {id:'steak',artist:'파도 키친',title:'참치 스테이크 컷',category:'tuna',format:'가열용 콘셉트',price:21900,list:25900,asset:'steak.svg',tone:'#e1e5ef',fresh:false,pick:false,options:['200 g'],spec:'참치 스테이크 컷 200 g',intro:'팬에서 굽는 한 접시를 생각해 두툼하게 그린 참치 패키지입니다. 가열용 디자인 예시입니다.'}
];
export const recipes=[
 {id:'lemon',tag:'오븐 요리',title:'레몬 허브 연어구이',lead:'노릇하게 구운 연어와 산뜻한 레몬을 한 접시에.',product:'salmon',ingredients:['연어 필렛','레몬','딜 또는 파슬리','올리브유'],steps:['레몬을 얇게 썰고 허브를 준비합니다.','연어에 올리브유와 허브를 더하고 포장 조리 안내에 따라 충분히 익힙니다.','따뜻한 접시에 담고 레몬과 허브를 곁들입니다.']},
 {id:'pan',tag:'팬 요리',title:'구운 참치와 채소 한 접시',lead:'두툼한 참치와 구운 채소를 곁들인 한 끼.',product:'steak',ingredients:['가열용 참치 스테이크 컷','양파','파프리카','올리브유'],steps:['채소를 먹기 좋게 썰어 팬에서 굽습니다.','가열용 참치는 포장의 조리 안내에 따라 속까지 충분히 익힙니다.','구운 채소와 함께 담고 올리브유를 조금 더합니다.']},
 {id:'shrimp',tag:'한 그릇',title:'새우 유자 샐러드',lead:'충분히 익힌 새우에 아삭한 채소와 유자 간장을 더해요.',product:'shrimp',ingredients:['가열용 손질 새우','샐러드 채소','오이','유자 간장'],steps:['새우를 포장 안내에 따라 충분히 익힙니다.','씻은 채소의 물기를 빼고 오이를 얇게 썹니다.','새우와 채소를 접시에 담고 유자 간장을 기호에 맞게 곁들입니다.']}
];
export const notes=[
 {id:'cut',tag:'SEAFOOD NOTE',title:'색으로 보는 참치 한 접시',lead:'루비색과 분홍색, 한 접시에 놓인 서로 다른 빛.',product:'table-tuna',body:['붉은색 부위와 밝은 분홍색 부위를 번갈아 배치하면 접시의 색이 또렷해집니다.','무광 도자기와 푸른 잎을 곁들이면 담는 색은 간결해지고, 재료의 무늬가 잘 보입니다.']},
 {id:'gift',tag:'TABLE NOTE',title:'선물 상자에 담는 한 끼',lead:'함께 식탁을 차리는 시간을 생각한 구성.',product:'gift',body:['선물 상자는 무엇을 담는지 한눈에 알아볼 수 있도록 종류와 중량을 먼저 보여주었습니다.','이 페이지는 포장과 상품 화면을 설명하는 창작 노트입니다. 실제 주문이나 배송은 운영하지 않습니다.']}
];
export const money=n=>new Intl.NumberFormat('ko-KR').format(n)+'원';
export const byId=id=>products.find(p=>p.id===id);
