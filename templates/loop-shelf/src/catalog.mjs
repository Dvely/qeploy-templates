export const categories={all:'전체 상품',new:'신상품',albums:'음반',vinyl:'바이닐',goods:'굿즈',books:'포토북'};
export const products=[
 {id:'blue-room',artist:'폴디드 노트',title:'블루 룸',format:'컬러 바이닐',category:'vinyl',price:36000,asset:'hero-record.jpg',tone:'#f5ed9c',fresh:true,pick:true,options:['코발트 블루','투명 블루'],spec:'12인치 레코드 · 슬리브 · 아트 인서트',copy:'늦은 오후의 색을 소리로 옮긴다는 설정에서 출발한 가상의 음반입니다. 코발트색 슬리브에 둥글게 겹친 파형을 담았습니다.'},
 {id:'moon-step',artist:'모노 파도',title:'달의 보폭',format:'바이닐 EP',category:'vinyl',price:32000,asset:'cover-moon.svg',tone:'#d6d5f4',fresh:true,pick:false,options:['미드나잇 에디션'],spec:'12인치 레코드 · 슬리브 · 가사 카드',copy:'밤길에 발걸음의 속도가 달라지는 순간을 추상적인 곡선으로 풀었습니다. 남색 표면 위에 겹친 달의 궤적을 감상해 보세요.'},
 {id:'signal',artist:'신호정원',title:'스몰 시그널',format:'미니 앨범 CD',category:'albums',price:18500,asset:'cover-signal.svg',tone:'#f8d3ca',fresh:true,pick:true,options:['코랄 버전','아이보리 버전'],spec:'CD · 24쪽 소책자 · 그래픽 카드 1장',copy:'짧은 전자음의 모양에서 출발한 미니 앨범 콘셉트입니다. 코랄과 아이보리 색면이 조각조각 이어지는 패키지입니다.'},
 {id:'wave-key',artist:'루프 에디션',title:'파형 키링 세트',format:'아크릴 굿즈',category:'goods',price:14500,asset:'goods-set.jpg',tone:'#ded3f5',fresh:true,pick:true,options:['라일락 + 버터'],spec:'아크릴 참 2개 · 금속 링 · 직조 스트랩',copy:'손바닥 안에 들어오는 작은 소리의 모양. 투명한 파형과 코발트 원, 노란 스트랩을 한 세트로 구성한 디자인 예시입니다.'},
 {id:'echo',artist:'모노 파도',title:'여운의 풍경',format:'아트 포토북',category:'books',price:26000,asset:'book-echo.svg',tone:'#dce6d3',fresh:false,pick:true,options:['기본 에디션'],spec:'152 × 190 mm · 64쪽 · 무광 표지',copy:'선과 여백으로 풍경의 높낮이를 기록한 아트북입니다. 산의 윤곽과 잔잔한 파동을 닮은 그림을 모았습니다.'},
 {id:'wave-cards',artist:'폴디드 노트',title:'파동 아트 카드',format:'그래픽 카드 세트',category:'goods',price:9500,asset:'card-wave.svg',tone:'#e8d9fa',fresh:false,pick:true,options:['라일락 세트'],spec:'55 × 85 mm · 아트 카드 4장',copy:'다른 속도로 흐르는 네 개의 선을 카드에 담았습니다. 앨범 옆에 놓거나 작은 액자에 꽂아 보는 수집품 콘셉트입니다.'},
 {id:'soft-hours',artist:'스튜디오 온도',title:'느린 시간',format:'정규 앨범 CD',category:'albums',price:21800,asset:'cover-hours.svg',tone:'#f4d8a8',fresh:false,pick:true,options:['앰버 버전'],spec:'CD · 32쪽 북클릿 · 인서트 1장',copy:'빛이 기울며 색이 천천히 바뀌는 오후를 주제로 삼았습니다. 앰버색과 브라운의 짧은 선으로 시간의 변화를 표현했습니다.'},
 {id:'little-index',artist:'루프 에디션',title:'작은 소리의 목록',format:'아카이브 북',category:'books',price:19500,asset:'cover-index.svg',tone:'#cde5df',fresh:false,pick:false,options:['민트 에디션'],spec:'140 × 175 mm · 56쪽 · 무선 제본',copy:'마음에 남은 곡의 제목과 한 줄 메모를 모으는 작은 기록집입니다. 어디서 무엇을 들었는지 적을 수 있도록 여백을 남겼습니다.'}
];
export const artists=[
 ['폴디드 노트','도시의 빛과 일상에서 만나는 작은 장면을 음반 패키지로 옮기는 가상의 듀오입니다.','blue-room'],
 ['모노 파도','밤 산책과 풍경의 선을 모티프로 삼은 가상 프로젝트입니다.','moon-step'],
 ['신호정원','짧은 전자음과 색면의 관계를 탐구하는 가상의 신스 팝 팀입니다.','signal'],
 ['스튜디오 온도','느리게 변하는 빛과 시간을 소재로 삼은 가상의 연주 프로젝트입니다.','soft-hours']
];
export const events=[
 {id:'listening',tag:'리스닝 에디트',title:'코발트빛 리스닝 룸',desc:'한 장의 음반을 고르고, 그날의 색과 감상을 한 줄로 남기는 전시를 상상했습니다.',product:'blue-room',steps:['코발트 색의 음반과 패키지를 둘러봅니다.','기억에 남는 소리나 색을 한 줄로 적어 봅니다.','좋아하는 아트 카드를 골라 나만의 선반을 구성합니다.']},
 {id:'collecting',tag:'컬렉션 에디트',title:'작은 물건의 파동',desc:'키링과 아트 카드가 음반 옆에 놓이는 순간을 살펴보는 굿즈 기획전입니다.',product:'wave-key',steps:['파형 모양의 참과 직조 스트랩을 살펴봅니다.','카드의 색과 선을 비교하며 취향을 정리합니다.','굿즈 목록에서 관심 상품을 찜하거나 장바구니에 담아 봅니다.']}
];
export const money=n=>new Intl.NumberFormat('ko-KR').format(n)+'원';
export const byId=id=>products.find(p=>p.id===id);
