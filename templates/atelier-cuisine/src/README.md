# ATELIER CUISINE 아틀리에 퀴진

세계 요리 레시피, 셰프 조리 노트, 식재료 마켓을 연결하는 자기 완결형 템플릿입니다. 정적 서버에서 `index.html`을 열면 별도 설치나 외부 서비스 연결 없이 이용할 수 있습니다.

- `index.html`: Stitch 시안의 미식 큐레이션 홈.
- `atelier-recipe-*.html`: 레시피 20개의 재료·인분·조리 단계·타이머·관련 상품.
- `atelier-product-*.html`: 상품 7개의 소개·수량·가격·관련 레시피.
- `atelier-class-master.html`: 시안의 셰프 클래스. 실제 영상 파일을 대신하는 이미지와 조리 노트 미리보기, 챕터 선택·자동 넘김·메모·FAQ를 제공합니다.
- `atelier-world-*.html`: 국가별 퀴진 8개의 레시피 아카이브.
- `atelier-chef-*.html`: 셰프 3명의 컬렉션.
- `atelier-cart.html` → `atelier-checkout.html` → `atelier-confirmation.html`: 구성 단위로 상품을 담고 수량·합계를 확인하는 체험 주문.
- `atelier-enroll.html`, `atelier-studio.html` → `atelier-confirmation.html`: 무료 클래스와 공간 대관의 체험 신청.
- `atelier-scrapbook.html`: 보관한 레시피와 클래스.
- 검색·마켓·에디토리얼·셰프 질문·원고 투고·요리 기록·제휴·이용 안내도 별도 페이지로 이어집니다.

콘텐츠 정본은 `atelier-cuisine-data.js`입니다. 수정 후 `node atelier-cuisine-build.mjs`로 상세 화면을 갱신합니다(Node.js 22 이상, 추가 패키지 불필요). 저장소의 `npm run build`도 같은 생성기를 호출합니다. `layouts/`는 원본 시안의 레시피·클래스·상품 상세 레이아웃이며 직접 탐색하는 화면이 아닙니다. 실제 주소 목록은 `atelier-routes.json`에 있습니다.

`atelier-cuisine.js`는 인분별 계량, 타이머 시작·일시정지·재개·초기화, 스크랩북, 장바구니, 주문과 신청을 처리합니다. `atelier-cuisine.css`의 `:root`에서 색·폰트·라운드 토큰을 조정합니다. 모든 이미지와 폰트는 로컬 파일이며 라이선스는 `fonts/`와 `licenses/`에 포함되어 있습니다.

인물·상품·공간과 후기는 가상의 예시입니다. 실제 결제·배송·접수는 진행하지 않습니다. 이름·이메일·주소·원고·질문은 저장하거나 전송하지 않습니다. 장바구니의 상품 ID·수량과 스크랩 항목만 현재 브라우저에 보관하고, 확인 화면의 선택 정보는 탭 세션 동안만 유지합니다. 타이머는 참고용이며 재료가 충분히 익었는지 확인해야 합니다.
