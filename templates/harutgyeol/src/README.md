# HARUTGYEOL · 하룻결

`index.html`을 시작으로 숙소·저널·기획전 상세, 숙소 탐색, 찜 목록과 예약 문의가 이어지는 정적 사이트입니다. 이미지·글꼴·스타일·스크립트는 이 폴더에 함께 있습니다.

## 내용 수정

숙소의 이름·지역·인원·가격·시설, 저널의 본문, 기획전 구성은 `harutgyeol-data.js`에서 관리합니다. 내용 수정 후 Node.js 22 이상에서 다음 명령으로 홈 카드와 28개 하위 페이지를 갱신합니다. 추가 패키지는 필요하지 않습니다.

```sh
node harutgyeol-build.mjs
```

Qeploy 템플릿 저장소에서는 `npm run build`가 위 과정을 함께 실행합니다.

헤더·푸터·히어로 문구는 `index.html`, 공통 색상·글꼴은 `harutgyeol.css`, 하위 페이지 배치는 `harutgyeol-pages.css`에서 수정합니다. 상세 페이지 구성을 바꾸려면 `harutgyeol-build.mjs`를 수정한 뒤 다시 생성합니다.

## 페이지 연결

- 숙소 12개: `harutgyeol-stay-<id>.html`
- 저널 3개: `harutgyeol-journal-<id>.html`
- 기획전 7개: `harutgyeol-collection-<id>.html`
- 전체 숙소·기획전·저널: `harutgyeol-stays.html`, `harutgyeol-collections.html`, `harutgyeol-journals.html`
- 찜·예약 문의·브랜드 소개: `harutgyeol-saved.html`, `harutgyeol-booking.html`, `harutgyeol-about.html`

검색한 날짜와 인원은 페이지 주소를 통해 상세와 예약 문의 화면으로 전달합니다. 찜한 숙소는 브라우저의 `harutgyeol:saved-stays` 목록을 모든 페이지에서 공유합니다. 각 상세 페이지는 검색 결과에서 바로 접근할 수 있고, 새로고침해도 내용을 그대로 표시합니다.

숙소·가격·시설은 예시입니다. 예약 문의 양식의 연락처는 저장하거나 전송하지 않으며, 실제 예약이나 결제는 이루어지지 않습니다. 글꼴 라이선스는 `fonts/`에 있습니다.

## 일러스트레이션 자산 안내

2026-11-06에 출처와 이용 허락을 확인할 수 없었던 사진·지도·썸네일 래스터 파일을 제거하고, Qeploy contributors가 직접 작성한 독창적인 SVG 일러스트레이션으로 교체했습니다. 원본 사진의 픽셀이나 외부 SVG 경로를 변환·복사하지 않았습니다. 이미지 영역은 이제 실제 인물·장소·상품 또는 진료 결과의 사진이 아닌 설명용 그림입니다. 지도형 그림은 실제 길찾기 용도가 아닌 개념도입니다.

새 SVG에는 상업적 이용·수정·소스 템플릿 재배포를 허용합니다. 파일별 교체 기록과 범위는 `ASSET-PROVENANCE.json`을 확인하세요. 이 안내는 새 그림에만 적용되며, 사이트 전체나 제3자 코드·서체·디자인에 대한 법적 검토 완료를 뜻하지 않습니다. 기존 설명에서 사진으로 지칭하던 영역은 이 일러스트레이션으로 대체됐습니다.
