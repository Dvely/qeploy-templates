# 루프선반 소스

정적 HTTP 서버에서 `index.html`을 엽니다. `node build.mjs`는 상품 데이터에서 17개 HTML 화면과 SVG 패키지 이미지 2개를 생성합니다.

- `catalog.mjs`: 가상의 상품 8개·아티스트·기획전 2개
- `build.mjs`: 공유 레이아웃과 정적 페이지
- `site.css`, `site.js`: 디자인과 탐색·장바구니 동작
- `ASSET-PROVENANCE.json`, `image-prompts.json`, `assets/vector-notes.md`: 제작 자료와 해시

찜과 장바구니는 브라우저 저장소에만 보관하며 개인 정보나 결제 정보를 받지 않습니다. 주소는 학습용 예시입니다.
