# PAGES 페이지스

도서 큐레이션, 북클럽, 작가 북토크를 연결하는 자기 완결형 서점 템플릿입니다. 이 폴더를 정적 서버에서 그대로 열 수 있으며 별도 설치나 외부 서비스 연결이 필요하지 않습니다.

- `index.html`: 서점 홈, 도서·모임 검색, 도서 분류, 문장 미리보기.
- `pages-book.html`, `pages-book-quiet.html` 등: 도서 5권의 고유한 소개·목차·문장·작가와 관련 모임.
- `pages-club.html`, `pages-club-classics.html` 등: 북클럽 5개의 고유한 일정·진행자·커리큘럼·가격.
- `pages-event.html`, `pages-event-reading.html`: 북토크와 원서 낭독회 상세.
- `pages-lounge-*.html`, `pages-author-*.html`, `pages-journal-*.html`: 공간 2곳, 작가 7명의 서재, 에디토리얼 3편.
- `pages-search.html`: 도서·작가·북클럽·북토크를 함께 찾는 검색 화면.
- `pages-books.html`, `pages-clubs.html`, `pages-events.html`, `pages-collection-*.html`: 검색·분류·가격 정렬을 제공하는 목록과 테마 서가 8개.
- `pages-cart.html` → `pages-checkout.html` → `pages-confirmation.html`: 수량·합계를 반영한 체험 주문.
- `pages-booking.html`, `pages-reservation.html` → `pages-confirmation.html`: 무료 모임·현장/온라인 티켓·공간 대관 선택과 체험 신청.
- `pages-mypage.html`, `pages-login.html`, `pages-signup.html`: 보관한 도서·모임을 관리하는 서재와 체험 로그인.
- 멤버십·호스트 지원·큐레이션 문의·제휴·기업 프로그램·원고 투고·혜택·이용 안내도 별도 페이지로 연결됩니다.
- `pages-data.js`: 도서·모임·행사·공간·작가·에디토리얼·테마 서가의 콘텐츠 정본.
- `pages.js`: 홈의 필터·문장 미리보기·장바구니 담기.
- `pages-details.js`: 상세 페이지의 검색·정렬·보관함·주문·신청·확인 기능.
- `pages.css`: 공통 디자인 토큰과 홈 스타일. `pages-details.css`: 상세 페이지의 배치.
- `pages-routes.json`: 생성되는 상세·탐색·신청 화면 58개의 주소 목록.

상세 내용은 `pages-data.js`를 수정한 뒤 `node pages-build.mjs`로 갱신합니다. 별도 패키지 설치가 필요하지 않습니다(Node.js 22 이상). 저장소의 `npm run build`도 같은 생성기를 호출합니다. 기존 `?book=`, `?program=` 주소는 해당 고유 페이지로 연결됩니다.

구매와 참가 신청은 체험용입니다. 이름·이메일·주소·질문·원고는 서버로 보내거나 저장하지 않습니다. 장바구니와 보관한 도서·클럽만 현재 브라우저의 `pages:` 저장 공간에 남습니다. 확인 화면을 위한 항목·수량·선택 옵션과 금액, 체험 로그인 여부는 탭을 닫으면 끝나는 세션에만 보관합니다. 마이페이지에서 보관함과 장바구니를 비울 수 있습니다.

이미지와 폰트는 모두 로컬 파일입니다. 화면에서 사용하지 않는 이전 서점 이미지와 외부 CDN 의존성은 제거했습니다. 폰트 및 스타일 라이선스는 `fonts/`와 `licenses/`에 포함되어 있습니다.

사용자가 지정한 Stitch PAGES 시안의 홈·도서·북클럽·북토크 네 화면을 바탕으로 구성했습니다. 도서·인물·연락처와 사업자 정보는 가상의 예시 콘텐츠입니다.
