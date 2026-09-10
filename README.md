# qeploy-templates

Qeploy 퍼블리싱 템플릿. **데모와 씨앗을 한 저장소에서 함께 관리한다.**

설계 배경은 백엔드 저장소의 `docs/template-architecture-design.md` 에 있다.

## 이 저장소가 내보내는 것

| 산출물 | URL | 쓰는 곳 |
|---|---|---|
| 카탈로그 | `/catalog.json` | BE 가 읽어 `GET /api/v1/templates` 로 서빙 |
| 데모 | `/t/<id>/` | FE 갤러리가 iframe 으로 띄운다 — 고르기 전에 조작해본다 |
| 씨앗 | `/src/<id>.tar.gz` | 첫 CODE 스텝에서 컨테이너가 받아 `/workspace/app` 에 푼다 |

기준 URL: `https://dvely.github.io/qeploy-templates`

`main` 에 머지되면 Pages 발행이 곧 배포다. **카탈로그가 즉시 바뀐다.**

## 구조

```
templates/<id>/
  template.json    매니페스트 (id·name·description·stack·contentHints)
  src/             실제 소스. 이 디렉터리가 통째로 사용자 프로젝트가 된다
scripts/build.mjs  templates/ → site/ 빌드
```

## 템플릿 추가

1. `templates/<id>/` 를 만든다. `<id>` 는 소문자·숫자·하이픈만 쓴다
2. `template.json` 을 쓴다 — `id` 는 **디렉터리명과 같아야 한다** (빌드가 막는다)
3. `src/` 에 소스를 넣는다. **진입 파일은 `index.html`** 이어야 한다
4. `node scripts/build.mjs` 로 확인한다

### 지켜야 할 것

- **`src/` 는 자기 완결이어야 한다.** 다른 템플릿의 파일을 참조하면 씨딩된 프로젝트에서 깨진다
- **외부 자산을 링크하지 않는다.** 이미지는 CSS 그라디언트나 인라인 SVG 로 그린다. 외부 URL 은 언젠가 죽고, 저작권도 따라온다
- **디자인 토큰을 `:root` 에 모은다.** "디자인을 살짝 손보기" 가 토큰 몇 줄 수정으로 끝난다
- **`contentHints` 를 성실히 쓴다.** 어디가 바꿔도 되는 "내용" 인지 알려주는 유일한 근거다. 없으면 코딩 에이전트가 추측한다

### ⚠️ 실제 브랜드를 쓰지 않는다

레이아웃보다 **상호·로고·카피·사진**이 위험하다. 실재하는 회사·가게·단체의 이름을 쓰면 그 단체의 공식 사이트로 오인될 수 있다. 예시 콘텐츠는 가상의 이름으로 짓고, 연락처는 `example.com` 을 쓴다.
