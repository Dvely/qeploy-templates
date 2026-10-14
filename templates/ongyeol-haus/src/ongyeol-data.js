export const categories = [
  {id:'door', name:'도어', en:'DOOR', image:'door', note:'방과 방 사이, 나만의 분위기를 만드는 문.', types:['시그니처 도어','트렌드 도어','ABS 도어','타공 도어','멤브레인 도어','키즈 도어','원목 도어','하드웨어','프레임']},
  {id:'partition', name:'중문', en:'PARTITION', image:'door', note:'공간을 나누고, 빛과 시선은 이어주는 경계.', types:['양개 도어','온결 슬라이딩 도어','글라스 도어','하드웨어','프레임']},
  {id:'moulding', name:'몰딩', en:'MOULDING', image:'hero', note:'작은 선 하나로 완성하는 공간의 균형.', types:['온결 몰딩','기타 몰딩']},
  {id:'film', name:'시트 · 인테리어필름', short:'시트', en:'INTERIOR FILM', image:'materials', note:'익숙한 표면에 새로운 색과 질감을 더합니다.', types:['UV 페이퍼 시트','페이퍼 시트','인테리어필름','그 외 인테리어필름']},
  {id:'board', name:'보드', en:'BOARD', image:'materials', note:'자연스러운 질감으로 깊어지는 벽의 표정.', types:['프리미엄 보드','힐링월 보드','원목 보드','입체 보드','기타 보드','욕실천장재']},
  {id:'floor', name:'마루', en:'FLOOR', image:'hero', note:'발끝에 닿는 편안함, 일상을 받치는 바탕.', types:['내추럴 마루','콤비 강마루']},
  {id:'window', name:'창호', en:'WINDOW', image:'window', note:'집 안의 고요함과 집 밖의 풍경을 연결합니다.', types:['시스템 창호']},
  {id:'timber', name:'목재', en:'TIMBER', image:'craft', note:'자연의 결을 건축과 생활의 재료로.', types:['특수목','건축자재','중목구조']}
];
const names=['오크 브리즈','샌드 라인','아이보리 쉐이드','루미 글라스','소프트 그레인','리틀 포레스트','내추럴 오크','브라스 라인','슬림 엣지','듀오 클리어','슬라이드 라이트','뮤트 글라스','라운드 핸들','씬 프레임','플랫 라인','코너 라인','페일 오크','코튼 그레이','웜 샌드','스톤 베이지','테라 텍스처','노트 월','월넛 그레인','리브드 오크','미스트 라인','클라우드 화이트','데일리 오크','콤비 내추럴','파노라마 윈도','애쉬 원목','구조 합판','팀버 프레임'];
export const products=categories.flatMap((c,ci)=>c.types.map((type,ti)=>({
  id:`${c.id}-${ti+1}`, category:c.id, typeIndex:ti, type, name:names[categories.slice(0,ci).reduce((n,x)=>n+x.types.length,0)+ti], image:c.image,
  code:`OG-${String(ci+1).padStart(2,'0')}${String(ti+1).padStart(2,'0')}`, finish:ti%2?'웜 베이지':'내추럴 오크',
  description:`${c.note} ${type}의 형태를 담백하게 정리하고, 주변 소재와 자연스럽게 어우러지는 ${ti%2?'차분한 톤':'나무의 결'}을 제안합니다.`,
  size:c.id==='door'||c.id==='partition'?'공간에 맞춘 주문 제작':c.id==='window'?'현장 실측 후 제작':'구성 및 면적에 따라 상담',
  use:['주거 공간','라운지 · 상업 공간','공용 공간'][ti%3]
})));
export const projects=[
 {id:'quiet-home', title:'빛이 천천히 머무는 집', image:'hero', type:'INTERIOR', text:'밝은 나무의 결과 부드러운 패브릭을 연결해, 가족의 일상이 편안하게 흐르는 거실을 그렸습니다.', products:['door-1','floor-1','board-3']},
 {id:'open-boundary', title:'열린 경계, 이어지는 풍경', image:'window', type:'INTERIOR', text:'가느다란 창호의 선과 자연을 향한 시선. 안과 밖의 경계를 가볍게 정리한 공간 제안입니다.', products:['window-1','partition-2','floor-2']},
 {id:'material-library', title:'손끝에서 시작되는 공간', image:'materials', type:'COLLECTION', text:'오크의 따뜻함, 월넛의 깊이, 담백한 아이보리. 소재를 나란히 두고 공간의 색과 질감을 함께 살펴봅니다.', products:['film-1','board-4','timber-1']},
 {id:'timber-studio', title:'나무의 결을 잇는 작업실', image:'craft', type:'EXTERIOR', text:'재료가 가진 표정을 읽는 시간. 공간에 쓰일 나무를 살펴보고 마감의 방향을 선택하는 작업을 담았습니다.', products:['timber-1','timber-3','moulding-1']}
];
export const brandLinks=[['브랜드','ongyeol-brand.html'],['스토리','ongyeol-story.html'],['갤러리','ongyeol-gallery.html'],['쇼룸','ongyeol-showroom.html']];
export const supportLinks=[['카탈로그','ongyeol-catalog.html'],['자주 묻는 질문','ongyeol-faq.html'],['A/S 접수','ongyeol-service.html'],['시공 매뉴얼','ongyeol-manual.html'],['대리점 문의','ongyeol-partner.html']];
export const image=(id)=>`images/ongyeol-${id}.png`;
export const categoryUrl=(id)=>`ongyeol-category-${id}.html`;
export const typeUrl=(id,index)=>`ongyeol-collection-${id}-${index+1}.html`;
export const productUrl=(id)=>`ongyeol-product-${id}.html`;
export const projectUrl=(id)=>`ongyeol-gallery-${id}.html`;
export const faqs=[
 ['제품 색상은 화면과 동일한가요?','화면 설정과 조명에 따라 실제 자재의 색이 다르게 보일 수 있습니다. 최종 선택 전 샘플이나 쇼룸에서 질감과 색을 함께 확인해 주세요.'],
 ['사이즈를 변경할 수 있나요?','도어·중문·창호는 설치 공간과 개구부에 따라 구성이 달라집니다. 상담 시 가로·세로 치수와 현장 사진을 준비하면 필요한 정보를 정리하기 쉽습니다.'],
 ['처음 자재를 고를 때 무엇부터 준비하나요?','시공 공간, 선호하는 분위기, 기존 바닥과 벽의 색을 정리해 주세요. 컬렉션에서 마음에 드는 제품을 선택한 뒤 상담 화면으로 이어갈 수 있습니다.'],
 ['쇼룸은 예약해야 하나요?','방문 상담 화면에서 날짜와 관심 제품을 선택할 수 있습니다. 이 템플릿의 예약은 화면 시연용이며 실제 예약이나 외부 전송은 이루어지지 않습니다.'],
 ['자재의 관리 방법이 궁금해요.','시공 매뉴얼에서 제품별 준비 사항과 관리 팁을 확인할 수 있습니다. 실제 사용 제품은 공급사의 시방서와 관리 지침을 먼저 확인해 주세요.']
];
