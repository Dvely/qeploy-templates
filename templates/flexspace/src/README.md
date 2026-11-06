# FLEXSPACE · 플렉스스페이스

Stitch의 맞춤형 오피스 솔루션 홈·강남 지점·견적 계산기·투어 신청 시안을 바탕으로 만든 자기 완결형 정적 템플릿입니다. `index.html`을 정적 서버에서 열면 됩니다. 화면과 일러스트레이션·서체·스크립트는 모두 로컬 파일이며 외부 자산 요청이 필요하지 않습니다.

- `index.html`: 기업 맞춤 솔루션, 구축 과정과 사례, 상담 신청
- `flexspace-locations.html`, `flexspace-branch-*.html`, `flexspace-room-*.html`: 네 지점과 호실 상세
- `flexspace-solutions.html`, `flexspace-solution-*.html`: 네 오피스 솔루션 상세
- `flexspace-cases.html`, `flexspace-case-*.html`: 세 구축 사례
- `flexspace-benefits.html`, `flexspace-benefit-*.html`: 멤버 경험과 업무 인프라
- `flexspace-estimate.html`, `flexspace-quote.html`: 인원·지점·오피스 타입·기간·부가 옵션별 견적과 인쇄
- `flexspace-tour.html`, `flexspace-contact.html`, `flexspace-confirmation.html`: 조건을 이어 받는 투어·상담과 확인
- `flexspace-saved.html`: 브라우저에 보관한 관심 지점
- `flexspace-data.js`, `flexspace.js`, `flexspace.css`: 콘텐츠와 공통 동작·스타일
- `layouts/`: Stitch 상세 레이아웃 정본

콘텐츠를 바꾼 뒤 Node.js 22 이상에서 `node flexspace-build.mjs`를 실행하면 모든 하위 페이지를 다시 생성합니다. 추가 패키지는 필요하지 않습니다. 저장소 전체 빌드에서도 같은 생성기를 사용합니다.

브랜드·공간·입주사·요금·후기·공실·구축 기간은 화면 체험을 위한 예시입니다. 실제 계약·예약·상담 접수와 이메일 발송은 제공하지 않습니다. 인쇄 화면에서 브라우저의 PDF 저장 기능을 사용할 수 있습니다. 입력한 회사명·이름·이메일·전화번호·문의는 저장하거나 전송하지 않습니다. 관심 지점에는 지점 식별자만 저장하며, 신청 확인에는 지점·솔루션·일정 같은 선택 정보만 탭 세션에 남깁니다.

투어 날짜와 지난 시간은 서울 시간 기준으로 확인합니다. 견적은 예시 요율로 계산하므로 실제 공실·세금·운영 조건과 별도 확인이 필요합니다.

## 일러스트레이션 자산 안내

2026-11-06에 출처와 이용 허락을 확인할 수 없었던 사진·지도·썸네일 래스터 파일을 제거하고, Qeploy contributors가 직접 작성한 독창적인 SVG 일러스트레이션으로 교체했습니다. 원본 사진의 픽셀이나 외부 SVG 경로를 변환·복사하지 않았습니다. 이미지 영역은 이제 실제 인물·장소·상품 또는 진료 결과의 사진이 아닌 설명용 그림입니다. 지도형 그림은 실제 길찾기 용도가 아닌 개념도입니다.

새 SVG에는 상업적 이용·수정·소스 템플릿 재배포를 허용합니다. 파일별 교체 기록과 범위는 `ASSET-PROVENANCE.json`을 확인하세요. 이 안내는 새 그림에만 적용되며, 사이트 전체나 제3자 코드·서체·디자인에 대한 법적 검토 완료를 뜻하지 않습니다. 기존 설명에서 사진으로 지칭하던 영역은 이 일러스트레이션으로 대체됐습니다.
