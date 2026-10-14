# PLAYFORGE · 플레이포지

Stitch의 테크니컬 스포츠 장비·모임 플랫폼 시안을 적용한 정적 템플릿입니다. 홈, 핑퐁 모임, 탁구대 구성, 기관 견적, 풋살 모임, 매치 라운지의 여섯 주요 화면과 장비 탐색·장바구니·저널·멤버십·호스트·가이드·문의·정책 화면을 연결했습니다. 정적 서버에서 `index.html`을 열면 됩니다. 사진과 Chivo·Hanken Grotesk·Space Mono 폰트, 스타일과 스크립트는 모두 로컬 파일입니다.

- `index.html`: 홈의 모임·장비 카드, 종목 필터와 탐색 버튼
- `playforge-product.html`: PRO-8 탁구대 사진·색상·추가 구성·가격, 장바구니 및 견적 연결
- `playforge-gear.html`, `playforge-cart.html`: 네 장비 탐색과 구성·수량별 바구니
- `playforge-clubs.html`: 종목·지역·시간·레벨·옵션으로 좁히는 모임 목록
- `playforge-pingpong.html`, `playforge-futsal.html`: 모임 상세와 참가 선택 확인
- `playforge-estimate.html`: 기관 유형·설비 수량·행정 결제 방식과 공급가·VAT·총액, 견적서 인쇄
- `playforge-host.html`, `playforge-contact.html`: 모임 개설 및 기관 문의 체험
- `playforge-stories.html`, `playforge-membership.html`, `playforge-guide.html`, `playforge-safety.html`: 플레이어 이야기·멤버십·가이드·안전 안내
- `playforge-privacy.html`, `playforge-terms.html`: 체험 정보 처리와 이용 안내
- `playforge-data.js`, `playforge.js`, `playforge.css`: 콘텐츠, 공통 동작과 테마·반응형 배치

모바일 메뉴는 브랜드·장바구니·멤버십과 같은 줄에 44px 버튼으로 배치했습니다. 카드와 폼은 폭에 맞춰 쌓이고, 견적 표는 해당 영역 안에서 가로로 살펴볼 수 있습니다. `aria-current`, 선택 상태, 키보드 포커스와 기본 대화상자 닫기를 지원합니다.

브랜드·모임·장비·가격·재고·인증·조달코드·후기는 디자인 예시입니다. 실제 결제, 조달 계약, 참가 접수와 직인·행정 증빙·이메일 발행은 진행하지 않습니다. 견적서는 브라우저 인쇄에서 PDF로 저장할 수 있습니다. 사진에는 시안의 기본 구성을 사용하며 선택한 색상의 실제 사진을 별도로 생성하지 않았습니다.

장바구니에는 제품 식별자·색상·추가 구성·수량만 현재 브라우저에 저장합니다. 같은 구성은 최대 20개, 견적 설비는 품목당 100개까지 선택할 수 있습니다. 문의와 참가 화면에 입력한 이름·이메일·연락처·내용은 저장하거나 전송하지 않습니다. 모임 등록 날짜는 서울 시간 기준으로 오늘 이후에 선택할 수 있습니다.

브랜드 경로는 `playforge`입니다. 이전 브랜드의 장바구니 저장값은 새 값이 없을 때 읽어 구성과 수량을 유지하고, 다음 변경부터 `playforge:cart`에 저장합니다.
