export const categories = [
  { id: 'kitchen', name: '주방', icon: 'kitchen', photo: 'paper', detail: '조리하고 정리하는 데 필요한 도구' },
  { id: 'bath', name: '욕실', icon: 'drop', photo: 'soap', detail: '씻고 닦는 일에 손이 가는 용품' },
  { id: 'home', name: '생활', icon: 'home', photo: 'towels', detail: '빨래와 일상 정리를 위한 기본용품' },
  { id: 'food', name: '먹거리', icon: 'food', photo: 'oats', detail: '찬장에 두고 자주 꺼내는 식료품' },
];

export const products = [
  { id: 'paper', category: 'kitchen', title: '도톰한 주방 종이타월', size: '150매 × 2롤', price: 3900, was: 4900, best: true, description: '손질한 채소의 물기를 닦거나 조리대에 튄 물을 닦기 좋은 엠보싱 종이타월입니다.' },
  { id: 'soap', category: 'bath', title: '유자향 거품 손세정제', size: '300mL', price: 5200, was: 6400, best: true, description: '펌프를 누르면 거품이 나오는 손세정제입니다. 세면대나 싱크대 곁에 두고 쓰기 좋은 크기입니다.' },
  { id: 'brush', category: 'bath', title: '작은 헤드 칫솔 세트', size: '3개입', price: 4500, fresh: true, description: '작은 헤드와 부드러운 모를 사용한 칫솔 세트입니다. 손잡이 색으로 칫솔을 구분할 수 있습니다.' },
  { id: 'oats', category: 'food', title: '아침에 먹는 압착 귀리', size: '450g', price: 5800, was: 6900, best: true, description: '우유나 물에 끓여 오트밀로 먹거나, 요거트에 곁들일 수 있는 압착 귀리입니다.' },
  { id: 'towels', category: 'home', title: '물빛 코튼 타월', size: '40 × 80cm · 3장', price: 12900, was: 15900, best: true, description: '차분한 물빛의 면 수건 세 장을 한 세트로 묶었습니다. 욕실이나 손님용 수건으로 쓰기 좋은 크기입니다.' },
  { id: 'laundry', category: 'home', title: '무향 데일리 세탁세제', size: '1L', price: 7900, fresh: true, description: '향을 더하지 않은 액상 세탁세제입니다. 손잡이가 달린 용기와 계량 뚜껑으로 구성했습니다.' },
  { id: 'seaweed', category: 'food', title: '바삭한 구운 김', size: '4g × 8봉', price: 4600, fresh: true, description: '한 끼에 먹기 좋은 크기로 나눈 구운 김입니다. 밥이나 주먹밥에 바로 곁들이기 편합니다.' },
  { id: 'tea', category: 'food', title: '순하게 우린 보리차', size: '500mL', price: 1900, description: '구운 보리를 우려 만든 보리차입니다. 냉장고에 두었다가 식사에 곁들여 보세요.' },
];

export const won = amount => new Intl.NumberFormat('ko-KR').format(amount) + '원';
