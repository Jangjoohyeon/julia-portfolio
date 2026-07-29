# JULIA Portfolio — 빌드 규칙 (CLAUDE.md)

이 문서는 이 폴더(`영감/`)에서 포트폴리오 웹사이트를 빌드할 때 따라야 하는 규칙이다.
대상: AI로 만든 이미지·영상 작업물을 보여주는 개인 포트폴리오 사이트.

---

## 0. 콘텐츠 확정 값

- 표기 이름: **JULIA**
- 소개 문구(태그라인): **2026-07-28부터 영문으로 교체됨** — "Hello, I'm Juhyun Jang, a designer who creates creative visual experiences. I combine graphic, 3D, and motion design to shape the visual language and tone of content, aiming to expand it into a cohesive and refined experience." (이전 한국어 문구 "안녕하세요. 창의적인 시각 경험을 만드는 디자이너 장주현입니다...."는 더 이상 어디에도 쓰이지 않는다). About 카드(`.about-quote`)의 폰트도 이때 함께 확인/보강했다 — 이미 `font-family:var(--font-mono); font-style:italic;`였지만, `index.html`의 Google Fonts 링크가 JetBrains Mono의 `ital` 축을 요청하지 않고 있어서 브라우저가 진짜 이탤릭 글리프 대신 합성(fake) 기울임을 그리고 있었다. `family=JetBrains+Mono:wght@400;500;700;800` → `family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;0,800;1,400`로 바꿔서 실제 이탤릭 폰트 파일을 받아오게 했다.
- 이 두 값 외의 실제 프로젝트 제목/설명/연락처 정보는 처음엔 없었으나, 2026-07-29 안에 `works.json`의 `title` 10개 전부가 실제 값으로 교체 완료됐다(아래 각 항목 참고) — 더 이상 `"PLACEHOLDER — 제목 입력"`을 쓰는 카드는 없다. 앞으로 제목이 다시 바뀌면 `assets/work/works.json`의 `title` 필드만 교체하면 된다 (이미지는 아래 참고, 이미 실제 자산으로 교체됨).
- **Hero 배경은 2026-07-28에 사진에서 영상으로 교체됐다** — `assets/hero/hero.mp4`(사용자 제공 파일 `hf_20260728_113810_a018dd09-fe3a-4ccb-ab1a-05691cdfab76.mp4`, 실제 길이 약 7초). `index.html`의 `.hero-photo`는 이제 `<img>`가 아니라 `<video autoplay muted loop playsinline disablePictureInPicture disableRemotePlayback>`이고, `controls` 속성은 없다(재생바/컨트롤 UI 완전히 숨김). `css/style.css`의 `.hero-photo video` 규칙은 기존 `.hero-photo img`와 동일한 `width/height:100%; object-fit:cover;`를 공유하고 `pointer-events:none`을 추가해 클릭/호버로 인한 어떤 상호작용(정지, PiP 버튼 등)도 차단한다.
  - **발견한 이슈**: `autoplay` 속성만으로는 (적어도 이 환경의 자동화된 Chrome 테스트에서) 안정적으로 자동재생이 시작되지 않는 경우가 있었다 — 콘솔 에러도 없고 브라우저 자동재생 정책 차단도 아니었음(수동 `video.play()` 호출은 즉시 성공), 원인은 특정 안 됨. 방어적으로 `js/main.js` 최상단에 `.hero-photo video`를 찾아 로드 시 `play()`를 명시적으로 한 번 더 호출하고 `visibilitychange` 시에도 재시도하는 폴백을 추가했다(음소거 자동재생은 제스처 없이 항상 허용되므로 안전). 실제 브라우저에서는 원래도 잘 작동했을 가능성이 높지만, 폴백을 넣어 두면 어느 환경에서도 안전하다.
  - 이전에 쓰이던 정적 사진(`assets/hero/hero.jpg`, Figma 노드 `13:70`)은 자산 폴더에 그대로 남아 있다 — 다시 사진으로 되돌리려면 `<video>` 블록을 `<img src="assets/hero/hero.jpg" alt="...">`로 되돌리면 된다.
- **Work Gallery 이미지 6장도 같은 동기화로 실제 자산이 확보됐다** (`work-01, 02, 04, 05, 07, 08`). Figma 노드 → 파일 매핑:
  | 파일 | Figma 노드 | 원본 이름 |
  |---|---|---|
  | work-01.jpg | 17:35 | 노션 1 |
  | work-02.jpg | 17:33 | u7468227155_Ultra_high-fashion_editorial... |
  | work-04.jpg | 17:31 | 장주현_CH3 도전과제(일러스트)_콘셉트 리디자인 1 |
  | work-05.jpg | 17:34 | iclearrrr 1 |
  | work-07.jpg | 17:30 | 장주현_legodt moodboard 1 |
  | work-08.jpg | 17:32 | hf_20260405_155511... |

  5장은 Figma 콜라주 안에서 카드 라벨(카테고리/제목) 없이 흩어져 있어 슬롯 대응이 명시적이지 않았다 — 화면상 위치를 위→아래 순으로 읽어 남은 이미지 슬롯(01·04·05·07·08)에 순서대로 배정했다 (work-02만 "AI IMAGE — 02" 라벨이 붙은 카드에 명시적으로 들어 있어 확정). 실제 제목/카테고리는 아직 안 왔으므로 `title`은 여전히 플레이스홀더 텍스트를 유지하고 `alt`만 실제 내용에 맞게 갱신했다 — 정확한 순서/제목이 정해지면 `works.json`만 수정하면 된다.
  - **2026-07-29 `work-01` 제목 확정**: 썸네일 이미지 안에 실제로 박혀있는 로고 텍스트("vūm")와 일치하도록 `title`을 플레이스홀더에서 `"VŪM"`(대문자, 매크론 포함)으로 갱신했다. `category`/`alt`/`featured`/`link`는 그대로 유지.
  - **2026-07-29 `work-08`/`work-09`/`work-10` 제목 확정**: 세 카드 모두 플레이스홀더였던 `title`을 각 프로젝트의 실제 이름으로 갱신했다 — `work-08`: `"Not This Time"`(§2.4 `work-08.html`의 영상 파일명과 동일한 프로젝트명), `work-09`: `"해결설비"`(§2.4 `work-09.html`/§0 썸네일과 같은 배관 설비 업체 웹디자인 프로젝트), `work-10`: `"법률사무소 선진"`(§2.4 `portfolio-10.html`이 iframe으로 보여주는 라이브 사이트의 실제 업체명). 세 카드 모두 `category`/`alt`/`featured`/`link`는 변경 없이 유지.
  - **2026-07-29 `work-02`/`work-04`/`work-05`/`work-07` 제목 확정**: 남아있던 플레이스홀더 4개도 실제 프로젝트명으로 갱신 — `work-02`: `"DYSTOPIA: the moon & RECOVERY"`(`work-02.html`의 영상 aria-label에 이미 적혀 있던 "디스토피아: 달과 회복 컨셉의 하이패션 필름"과 일치하는 영문 타이틀), `work-04`: `"Disco fever"`(썸네일 자체가 디스코 파티 홍보 플라이어 디자인), `work-05`: `"Bow Lighter Holder Earring"`(썸네일이 그 문구가 적힌 캡차 스타일 이미지), `work-07`: `"LEGODT"`(기존 `alt`의 "legodt 무드보드"와 동일 프로젝트). 이제 `works.json` 10개 항목 전부 `title`이 실제 값으로 채워졌고 더 이상 `"PLACEHOLDER — 제목 입력"`을 쓰는 카드는 없다. `category`/`alt`/`featured`/`link`는 전부 변경 없이 유지.
- **`work-03`, `work-06`도 실제 자산이 확보됐다** — 둘 다 사용자가 직접 전달한 포스터 이미지로 교체했고 `title`/`category`/`alt`도 실제 값으로 갱신했다:
  - `work-03`: `assets/work/images/work-03.jpg`, "RUNNING WITH JESS — EP. 01" (TOVEN 브랜드 단편 필름 포스터), `category: "AI MOTION"` 유지.
  - `work-06`: `assets/work/images/work-06.jpg`, "오늘은 IPA다!" (맥주 프로젝트 제품 소개 포스터), `category`를 `"AI MOTION"`에서 `"AI IMAGE"`로 변경 (정적 포스터 디자인이라 모션이 아님).
  **둘 다 실제 영상 파일은 없어서 `type`을 `"video"`에서 `"image"`로 바꿨다** — 기존 제네릭 플레이스홀더 영상(`video-01.mp4`/`video-02.mp4`, 포스터와 무관한 추상 그라데이션 애니메이션)을 그대로 뒀다면 데스크탑에서 자동재생되면서 실제 포스터를 가려버리기 때문. 나중에 각각 실제 영상 파일이 오면 `type`을 다시 `"video"`로 바꾸고 `src`를 그 영상 경로로, `poster`를 지금의 이미지 경로로 설정할 것. (현재 이 방식으로 처리된 원래 "비디오 슬롯"은 `work-03`, `work-06` 둘 다 완료됐다 — 더 이상 남은 비디오 플레이스홀더 슬롯 없음.)

---

## 1. 레퍼런스 분석 요약

원본: https://spotlight.i-d.co/tyla (i-D × Tyla 인터뷰 스포트라이트 페이지)

관찰한 특징:

- **인트로**: 라임그린 단색 배경 위에 맥 브라우저 창(트래픽라이트 3개 + 파일명 탭) 목업을 여러 개 겹쳐서 "raw 영상 클립"들을 흩뿌려 놓음. 로고는 좌상단 고정.
- **타이포 대비**: 헤드라인은 초대형 세리프 볼드체(화면 폭을 거의 채움), 인터뷰 답변 본문은 모노스페이스 타자기체로 완전히 다른 질감을 사용. 두 서체군의 대비가 곧 이 사이트의 정체성.
- **강조 장치**: 핵심 문장에 밑줄, 인용구는 세리프 대형 텍스트로 별도 처리.
- **색 리듬**: 화이트 → 블랙 → 라임그린 배경이 섹션 단위로 전환되며 페이지의 리듬을 만듦. 색이 바뀔 때마다 톤(그레인 흑백 사진 vs 컬러 사진)도 함께 전환.
- **이미지 처리**: 인물 클로즈업 위주, 필름 그레인/노이즈 텍스처, 흑백과 컬러가 교차.
- **여백**: 매거진 인터뷰 레이아웃 특유의 넉넉한 여백과 좌측 고정 로고.
- **크레딧 블록**: 하단에 모노스페이스로 촬영/스타일링 등 크레딧 나열.

원본은 "패션 매거진 인터뷰"라는 맥락 때문에 라임그린 + 인물 사진 + 저널리즘 톤이 강하다. 우리는 이를 그대로 복제하지 않고 "AI 생성 이미지·영상"이라는 맥락에 맞게 변형한다 (2절 참고).

---

## 2. 디자인 규칙 (변형된 시스템)

### 2.1 컬러

원본(라임그린 + 흑백)의 차가운 대비 대신, 사용자가 제공한 레퍼런스 사진(옐로우 리넨 배경 위 매거진 화보 컷 — 코럴/핑크/옐로우 레이스, 파스텔 핑크 헤어, 그레인 있는 창백한 피부, 더스티 브라운 립)에서 팔레트 전체를 추출한다. 배경색·다크톤·시그널 컬러 모두 이 사진에서 나온 값이며, 차가운 뉴트럴(순수 흰색·순수 검정)은 쓰지 않는다.

| 토큰 | 값 | 추출 근거 | 용도 |
|---|---|---|---|
| `--bg-light` | `#F3E7D3` | 레이스의 크림빛 하이라이트 + 리넨 배경톤을 밝게 희석 | 라이트 섹션 배경 |
| `--bg-dark` | `#1F1512` | 립 컬러/스킨 폴드 그림자의 가장 어두운 톤 | 다크 섹션 배경 (순수 블랙 금지 — 항상 브라운 언더톤 유지) |
| `--accent` | `#DFA6A8` | 파스텔 핑크 헤어에서 추출한 더스티 로즈 | 시그널 컬러 — 강조 섹션 배경, 링크, 커서, 하이라이트 |
| `--accent-secondary` | `#C9A64F` | 옐로우 리넨 배경(우드/머스터드 톤)에서 추출 | 보조 시그널 컬러 — 절대 섹션 배경으로 쓰지 않고, 카테고리 태그/인덱스 숫자/밑줄 등 작은 디테일에만 제한적으로 사용 |
| `--ink-on-light` | `#2A1D17` | 스킨 폴드 그림자와 같은 계열의 딥 브라운 (순수 블랙 대신) | `--bg-light`, `--accent` 배경 위 텍스트 |
| `--ink-on-dark` | `#F3E7D3` | `--bg-light`와 동일한 크림톤 | `--bg-dark` 배경 위 텍스트 |

배경은 라이트 → 다크 → 액센트 → 라이트 순서로 섹션마다 전환하며 리듬을 만든다 (아래 2.3 참고). `--accent`는 전체 페이지에서 "과하지 않게" — 섹션 배경 1곳, 인터랙션 하이라이트(호버/커서/링크) 정도로 제한한다. 파스텔 톤이라 채도가 원색보다 낮으므로, 강조 섹션에서는 배경 전체보다 큰 색면(예: 헤드라인 하이라이트 블록, 버튼)에 써야 존재감이 살아난다. `--accent-secondary`(머스터드)는 그보다 더 절제해서 쓴다 — 레퍼런스 사진의 옐로우/코럴 쪽 온도를 아주 가끔 환기시키는 용도이며, 로즈(`--accent`)와 동시에 큰 면적으로 함께 쓰지 않는다.

모든 다크/라이트 톤에 브라운 언더톤을 유지해 사진 특유의 "필름 그레인 낀 웜톤 화보" 무드를 지킬 것 — 회색조·순색 무채색으로 치우치면 레퍼런스에서 멀어진다.

**Figma MCP 동기화 메모 (2026-07)**: Figma 파일 `uv7GQrRLL8Rhh1fMGEWtK9`의 노드 `11:30`을 `get_design_context`로 직접 읽어 색상/폰트/크기/간격을 코드에 반영했다 (스크린샷 추측이 아니라 실제 디자인 데이터 기준). 이때 Work Gallery 섹션 배경, Gen-Window Showcase 섹션 배경, Contact 제목/라벨 텍스트 색상이 각각 `#272727`로 나왔는데, 이 세 값은 **의도적으로 반영하지 않았다** — 위 회색조 금지 규칙과 정면으로 배치되고(브라운 언더톤이 없는 중립 그레이), 다른 요소들은 전부 정확히 변수(`var(--bg-dark)`, `var(--ink-on-light)` 등)에 바인딩되어 있는데 이 세 곳만 unbound raw fill로 나온 것으로 보아 Figma 쪽 편집 아티팩트일 가능성이 높다고 판단했다. 대신 기존 토큰(`--bg-dark`, `--ink-on-light`)을 유지했다 — 나중에 실제로 이 그레이 톤을 의도한 것이 맞다면 이 메모를 지우고 반영할 것.

### 2.2 타이포그래피

원본의 "세리프 대형 헤드라인 vs 모노스페이스 본문" 대비 구조는 유지하되 폰트 자체는 바꾼다.

- **디스플레이(히어로, 섹션 타이틀)**: 굵은 세리프 계열 (예: Fraunces, Georgia 대체 가능). `clamp(3rem, 11vw, 9rem)` 정도로 화면 폭에 반응하는 초대형 크기.
- **본문/라벨/메타데이터**: 모노스페이스 (예: JetBrains Mono, IBM Plex Mono). 프로젝트 태그, 날짜, 카테고리, 크레딧, 네비게이션에 사용. 대문자 + 자간(letter-spacing) 넓게.
- 대비 원칙: 한 화면 안에 반드시 "초대형 세리프 1개 + 소형 모노 1개"가 함께 보이도록 구성한다. 중간 크기의 평범한 산세리프 본문은 최소화.
- 밑줄 강조는 히어로/About의 핵심 문장 1~2곳에만 제한적으로 사용 (원본처럼 남발하지 않음). *(2026-07 개정: Hero가 사진 섹션이 되고 About 카드가 모노 이탤릭 본문(아래 참고)으로 바뀌면서 두 자리 모두에서 밑줄을 뺐다 — 현재는 어디에도 쓰이지 않는 장치다. `.mark` 클래스는 제거했으니 다시 강조가 필요해지면 새로 만들 것.)*
- **About 카드 본문은 예외적으로 디스플레이 세리프가 아니라 모노스페이스 이탤릭체를 쓴다** (`ROLE — DESIGNER` 라벨과 같은 글꼴, 크기만 키우고 기울임 처리) — 스트래들 카드 레퍼런스 목업을 그대로 따른 것이며, 2.5절 참고.

### 2.3 섹션 리듬

*(2026-07 개정: Figma 목업을 기준으로 Hero를 타이포 중심에서 사진 중심으로, gen-window 목업을 Hero 내부 장식에서 독립 섹션으로, About 카드를 Work↔About 경계에서 Hero↔Gen-Window 경계로 옮겼다. 아래는 현재 기준.)*

페이지는 배경(사진/색)이 전환되는 섹션들로 구성되며, 각 전환이 스크롤 리듬을 만든다.

1. **Hero** (사진, 실제 자산 확보 전까지 `--bg-dark` 톤 그라데이션 플레이스홀더) — 풀블리드 사진 위에 작은 비즈 시그니처 "Julia Jang"과 스크롤 유도 표시만 얹는다. 초대형 타이포 히어로는 더 이상 쓰지 않는다.
2. **About 카드** (`--bg-light`, 별도 섹션이 아니라 Hero와 Gen-Window Showcase 사이에 끼워진 스트래들 카드) — 2.5절 참고.
3. **Gen-Window Showcase** (2026-07-28부터 `--bg-dark` 대신 사용자 지정 `#4D4237` 고정 — 아래 참고) — 4개의 gen-window 목업이 흩뿌려진 독립 섹션. 2.4절 참고.
4. **Interactive Photo** (2026-07-28부터 사용자 지정 `#FFFFFF` 고정 — 3.1절 참고. 자체 팔레트는 텍스트 등 나머지에 그대로 적용) — 3.1절.
5. **Work Gallery** (2026-07-28부터 `--bg-light` 대신 사용자 지정 `#4D4237` 고정 — 아래 참고) — 균일한 그리드, 2.4절 참고.
6. **Contact** (2026-07-28부터 `--bg-light` 대신 사용자 지정 `#FFFFFF` 고정 — 아래 참고) — 초대형 CTA 타이포 + 모노 연락처/소셜 리스트. Footer는 여전히 `--bg-dark`라서 Contact(화이트)→Footer(다크) 전환이 새로운 리듬 포인트가 됐다.

`--accent`는 이제 전용 섹션 배경으로 쓰이지 않는다 (About이 액센트 풀섹션에서 라이트 카드로 바뀌었기 때문) — mono-list 라벨, 커스텀 커서 등 작은 디테일에서만 계속 쓰인다. 섹션 간 전환 시 배경색뿐 아니라 그리드/여백 밀도도 함께 바뀌어야 리듬이 느껴진다 (Hero·Contact는 여백 극대화, Gallery는 밀도 있게).

**2026-07-28 배경색 고정 메모**: 사용자 요청으로 Gen-Window Showcase와 Work Gallery의 배경만 `#4D4237`로, Contact 배경만 `#FFFFFF`로 고정했다(`css/style.css`의 `.gen-showcase[data-bg="dark"]`, `#work`, `#contact` — 공용 `section[data-bg]` 규칙보다 우선하도록 특정도를 높여 작성, 다른 `data-bg="dark"/"light"` 섹션(Hero)에는 영향 없음을 확인함). 텍스트 색·이미지·영상·레이아웃은 전부 그대로다. 이 세 섹션과 Interactive Photo(§3.1)는 이제 2.1절 토큰 팔레트(`--bg-dark`/`--bg-light`)를 따르지 않는 예외이니, 나중에 팔레트 전체를 바꾸는 작업을 하게 되면 이곳들은 별도로 다뤄야 한다는 점을 기억할 것.

**body 배경 통일**: Hero와 Gen-Window Showcase 사이의 `.about-straddle`은 자체 배경이 없는 투명 래퍼라서(§2.5), 그 틈으로 `body`의 배경색이 그대로 드러난다. 원래 `body { background: var(--bg-dark) }`(어두운 브라운, #1F1512)였는데 Gen-Window Showcase를 `#847769`(이후 `#4D4237`)로 바꾸면서 이 틈만 다른 색으로 남아 "갈색이 두 겹"으로 보이는 문제가 생겼다 → `body` 배경도 같은 값으로 통일해서 해결했다. Footer(`.site-footer`)는 자체 `background: var(--bg-dark)`를 갖고 있어 이 변경과 무관하게 여전히 어둡다.

**2026-07-28 재조정 + Work Gallery 텍스트 대비 수정**: 배경을 `#847769`(중간 밝기 브라운)에서 더 어두운 `#4D4237`로 다시 바꾸면서, Work Gallery(`#work`)는 원래 `section[data-bg="light"]`가 주는 어두운 텍스트 색(`--ink-on-light`, #2A1D17 — 밝은 배경 위에서 쓰도록 만든 색)을 그대로 상속하고 있어서 어두운 배경 위에서 텍스트가 거의 안 보이는 문제가 생겼다. `#work`에 `color: var(--ink-on-dark)`(#F3E7D3, 아이보리)를 추가해서 섹션 제목("WORK — SELECTED")과 카드 타이틀(`.work-card .title`, 별도 색 지정 없이 상속)을 밝게 바꿨고, 카드 카테고리 라벨(`.work-card .category`)은 자체적으로 `color: var(--accent-secondary-text)`(#79642F, 밝은 배경용 짙은 머스터드)를 지정하고 있어서 상속만으로는 안 바뀌므로 `#work .work-card .category { color: var(--ink-on-dark); opacity:.75; }`로 별도 override했다. Gen-Window Showcase는 원래부터 `data-bg="dark"`라 텍스트가 이미 밝은 색이었으므로 배경만 바꾸면 됐다(대비 문제 없음). 이미지/영상/레이아웃은 손대지 않았다.

### 2.4 작업물(이미지·영상) 처리 방식 — 원본에서 가장 크게 변형되는 지점

원본은 "raw 영상 파일"을 브라우저 창 목업으로 흩뿌려 놓아 촬영 원본(unedited footage)이라는 인상을 준다. 우리는 촬영본이 아니라 **AI로 생성/렌더링된 결과물**이므로 같은 장치를 다른 의미로 재사용한다.

- 브라우저 창 목업의 파일명 탭을 `tyla raw 1.mp4` 같은 "촬영 원본" 네이밍이 아니라 **생성 과정을 암시하는 네이밍**으로 바꾼다: `gen_output_v1.mp4`, `render_final.mov`, `frame_0042.png` 등. AI 워크플로우(버전, 렌더, 프레임)를 은근히 드러내는 라벨.
- **gen-window 목업 4개는 Hero 바로 다음의 독립된 `.gen-showcase` 섹션(`data-bg="dark"`)에 흩뿌려 배치한다** (2026-07 개정 전에는 Hero 내부에 겹쳐 두었으나, Hero가 사진 전용 섹션이 되면서 분리했다). 실제 작업물 전시는 Work Gallery의 일반 그리드로 분리한다 (원본처럼 인터뷰 전체에 반복 노출하지 않음).
  - **2026-07-28 개정: 4개 카드 전부 영상으로 교체했다** (이전엔 영상 2개 + 정지 프레임 이미지 2개 혼합). 사용자가 제공한 `1.mp4~4.mp4`를 `assets/gen-showcase/`로 옮기고, DOM 순서(`.gen-window--a→d`)대로 1→4번 배정했다. 파일명 라벨도 `gen_output_v1.mp4`/`frame_0042.png`/`render_final.mov`/`frame_0107.png` 같은 개별 네이밍에서 `baddie 1.mp4`~`baddie 4.mp4`로 통일했다(사용자 요청). 각 `<video>`는 `muted loop autoplay playsinline disablePictureInPicture disableRemotePlayback`, `controls` 없음, CSS에서 `.gen-window-body video`에 `pointer-events:none`을 줘서 클릭/호버로 인한 정지·PiP 버튼 노출을 막는다(드래그는 `.gen-window`가 이벤트를 받으므로 영향 없음). `autoplay` 속성만으로는 자동재생이 불안정할 수 있어(§0 Hero 영상 항목 참고) `js/main.js`의 재생 폴백이 `.hero-photo video`와 `.gen-window-body video`를 함께 처리한다.
  - **2026-07-28 추가 수정**: 영상이 반투명하게 보이던 원인 두 가지를 제거했다 — `.gen-window`의 `opacity:0.9`를 `1`로, 그리고 4개 카드에 걸려 있던 `.grain` 클래스(은은한 노이즈 오버레이, §2.4)를 HTML에서 뗐다(다른 섹션의 그레인 효과는 그대로 유지). **쌓임 순서를 고정**해달라는 요청으로 `.gen-window--a~d`에 각각 `z-index:1~4`를 명시했다(a=baddie-1이 제일 아래, d=baddie-4가 제일 위 — 원래도 DOM 순서상 이게 기본값이었지만, 드래그 시작 시 `js/main.js`가 `el.style.zIndex = String(++topZ)`로 맨 위로 끌어올리던 로직이 있어서 클릭한 카드가 계속 순서를 흐트러뜨렸다). 그 zIndex 갱신 줄을 제거해서 드래그로 위치는 옮겨도 쌓임 순서는 항상 CSS에 고정된 1~4 그대로 유지된다.
  - **2026-07-28 프레임 크기 수정**: 사용자가 "영상 가장자리에 여백이 보인다"고 신고했는데, 확인해보니 `object-fit:cover` 자체에는 CSS 레벨 gap이 없었다(getBoundingClientRect로 body와 video 경계가 완전히 일치함을 확인) — 대신 `.gen-window`가 고정 `aspect-ratio:0.55`(세로로 긴 비율)를 쓰고 있었는데 실제 영상 파일의 네이티브 비율은 훨씬 완만했다(`video.videoWidth/videoHeight`로 확인: 1/2/4.mp4는 848×1056=0.803, 3.mp4는 880×1040=0.846). `cover`가 이 비율 차이를 전부 크롭으로 메꾸다 보니 프레임 자체가 실제 영상 내용보다 "쓸데없이 길어" 보이는 게 사용자가 말한 여백의 정체였다. 고쳐서 `.gen-window`에서 `aspect-ratio:0.55`를 빼고, 대신 `.gen-window-body`가 각 영상의 실제 비율을 갖도록 개별 지정했다(`.gen-window--a/b/d .gen-window-body{aspect-ratio:848/1056}`, `.gen-window--c .gen-window-body{aspect-ratio:880/1040}`) — 이제 프레임 세로 길이가 영상 내용에 정확히 맞고 크롭이 사실상 없다. 새 영상으로 다시 교체하게 되면 이 비율 값도 그 영상의 실제 `videoWidth/videoHeight`로 다시 맞춰야 한다.
  - **위치 상향 조정**: `.gen-window--a~d`의 `top` 값을 원래(Figma 기준) 값에서 전부 9%p씩 낮춰서(예: a는 27.24%→18.24%) 카드 4개 전체를 위로 올렸다 — 서로 간의 상대적 스태거(계단식 배치)는 그대로 유지하면서, 섹션 하단에 여백이 더 남도록.
  - **2026-07-28 재수정 — 16:9 고정으로 되돌림**: 바로 위 "네이티브 비율에 맞춤" 방식은 사용자가 다시 요청해서 뒤집었다 — `.gen-window--a/b/d`, `.gen-window--c`에 각각 걸려있던 개별 `aspect-ratio` 오버라이드를 지우고, `.gen-window-body { aspect-ratio: 16/9; }` 하나로 통일했다. `object-fit:cover`는 그대로라 16:9와 다른 원본 비율(0.80~0.85, 세로가 긴 인물 영상)은 가장자리가 크롭되어 프레임을 꽉 채운다. 상단 타이틀바(`.gen-window-bar`)·레이어 순서(z-index 1~4)·자동재생/루프/음소거/컨트롤없음은 이번에도 손대지 않았다. 이 섹션의 프레임 비율은 최근 두 번 요청으로 바뀌었으니(네이티브 비율 → 16:9), 다음에 또 바뀔 수 있다는 점 참고.
  - **2026-07-28 섹션 컴팩트화 + 위치 재조정**: `.gen-showcase`의 `min-height`를 `90svh → 55svh`로 줄였다("섹션이 차지하는 세로 공간이 너무 크다"는 요청). 동시에 `.gen-window--a~d`의 `top`도 `18.24/10.78/18.24/12.79%` → `30/22.54/30/24.55%`로 올려서(카드 4개 사이 상대적 스태거 간격은 유지) 더 아래쪽에 배치했다 — 컨테이너 자체가 작아졌으므로 같은 %값이라도 절대 위치가 달라진다는 점에 유의해서, 실제 픽셀 기준(`getBoundingClientRect`)으로 카드들이 섹션 상/하단 여백 안에 잘리지 않고 들어오는지 확인 후 값을 확정했다. 16:9 비율·레이어 순서(z-index 1~4)·자동재생/루프/음소거/컨트롤없음·타이틀바는 이번에도 그대로.
  - **2026-07-28 재조정 — ABOUT 앵커 스크롤 시 다음 섹션 비침 수정**: 55svh가 "너무 줄었다"는 후속 피드백으로 `min-height`를 `100svh`로 다시 올렸다. 문제 상황은 상단 내비 `ABOUT`(`href="#about"`, About 스트래들 카드 래퍼) 클릭 시 — `#about`은 이 섹션보다 한참 위(About 카드가 Hero 쪽으로 겹치는 지점)에 있어서, 그 위치로 스크롤하면 `.gen-showcase`는 이미 몇백 px 지나친 채로 화면에 걸쳐 있었고, 섹션 높이가 부족하면 화면 하단에 다음 섹션(Interactive Photo, 흰 배경)이 살짝 보였다. 처음엔 클릭+스크롤 애니메이션이 끝나길 기다렸다가 `getBoundingClientRect`로 측정했는데, `scroll-behavior:smooth`와 반복 네비게이션이 섞이면서 스크롤 위치가 매번 다르게 안착해 측정값이 들쭉날쭉했다(192px 비침 → 163px → 0px 등 재현 안 됨) — **디버깅 교훈**: 이런 앵커 스크롤 검증은 클릭 후 대기하는 대신, `document.getElementById('about').getBoundingClientRect().top + window.scrollY`로 최종 안착 위치를 직접 계산해서 `window.scrollTo({top, behavior:'instant'})`로 순간 이동시켜 측정해야 애니메이션 타이밍에 흔들리지 않는 확정적인 값이 나온다. 이 방법으로 재검증한 결과 `100svh`만으로 이미 충분히 남는다(측정 시점 뷰포트 935px 기준 섹션 바닥이 뷰포트 아래로 400px 이상 남음) — 추가 buffer 없이 `min-height:100svh` 그대로 확정.
  - **데스크탑(마우스)에서는 이 4개 카드를 드래그로 자유롭게 움직일 수 있어야 한다.** `pointerdown/pointermove/pointerup`으로 구현하고, 드래그를 시작한 카드가 최상단(z-index)으로 올라오게 한다. 커서는 기본 `grab`, 드래그 중 `grabbing`. 컨테이너(`.gen-showcase`)에 `overflow:hidden`을 둬 카드가 섹션 밖으로 시각적으로 튀어나가지 않게 한다.
  - **모바일/터치에서는 드래그를 비활성화**한다 (스크롤 제스처와 충돌 방지). 화면이 좁아지므로 카드 수도 2개로 줄여 노출한다.
- 이미지/영상 모두 은은한 그레인 텍스처를 오버레이해 원본의 필름 그레인 질감을 계승하되, 색은 채도 있는 디지털 톤으로.
- 영상은 자동재생·무음·루프, `object-fit: cover`. 모바일에서는 자동재생 대신 탭하여 재생하는 방식도 고려 (데이터 절약).
- **Work Gallery는 4열 기준 그리드다** (`.work-grid { display:grid; grid-template-columns:repeat(4,1fr); align-items:start; }`, 태블릿 ≤1023px은 2열, 모바일 ≤767px은 1열). 카드는 두 가지 크기/비율을 섞어 쓴다 (2026-07 재개정 6차):
  - **`featured:true`인 카드**(`work-01,02,07,08,09,10`)는 `grid-column:span 2`로 4열 중 2칸을 차지하고, `.media`는 기본 가로(landscape) 비율 `21/10`을 쓴다 — 이전 2열 그리드 시절과 똑같은 크기/모양을 유지하기 위한 장치다. `featured`는 더 이상 "풀와이드 배너" 전용이 아니라 그냥 **"이 카드는 2칸을 차지한다"**는 뜻으로 일반화됐다.
  - **`orientation:"portrait"`인 카드**(`work-03,04,05,06`)는 `grid-column`을 지정하지 않아 4열 중 1칸만 차지하고, `.media`는 `.work-card[data-orientation="portrait"] .media { aspect-ratio:4/5 }`로 세로가 더 긴 비율을 쓴다. 4칸이라 정확히 한 줄에 4개가 나란히 들어간다. (`orientation` 미지정 시 JS가 `'landscape'`로 기본 처리 — `js/main.js`의 `article.dataset.orientation = work.orientation || 'landscape'`.)
  - `.work-grid`에 `align-items:start`를 줘서, 세로 카드 줄과 가로 카드 줄이 섞여도 짧은 쪽 카드가 억지로 늘어나지 않는다.
  - 현재 배치(문서 순서 그대로): `01,02`(각 2칸, 한 줄) → `03,04,05,06`(각 1칸, 세로, 한 줄) → `07,08`(각 2칸, 한 줄) → `09,10`(각 2칸, 한 줄). **`work-11`, `work-12`는 제거했다** (플레이스홀더 이미지 파일도 삭제) — 자리를 다시 채우고 싶으면 `works.json`에 `work-11`/`work-12`(또는 그 이후 번호)를 새로 추가하고 §2.4 생성 스크립트로 이미지를 새로 만들면 된다. `work-09`, `work-10`은 여전히 실제 자산이 없는 플레이스홀더(생성 스크립트: PIL로 그레이디언트+큰 인덱스 숫자+"PLACEHOLDER" 문구, `work-03`/`06`과 같은 스타일)이니 실제 작업물이 오면 해당 이미지 파일만 교체하면 된다.
  - **2026-07-29 하단 여백 조정**: `.work`의 `padding`을 상하좌우 동일값(`clamp(4rem,8vw,7rem) clamp(1.25rem,4vw,2.5rem)`)에서 3-value shorthand(top | left-right | bottom)로 바꿔 **하단만** 살짝씩 두 차례 키웠다 — top/left-right는 원래 값 그대로, bottom만 `clamp(6rem,10vw,9rem)` → `clamp(7.5rem,12vw,11rem)`로. 다음 섹션(Contact)이 흰 배경이라 Work(#4D4237, 어두운 브라운)와 맞닿는 경계에 여백을 줘서 리듬을 살렸다.
- 각 워크 카드에는 모노스페이스 메타 라벨(인덱스 숫자만, 예: `03`)을 원본의 의상/메이크업 크레딧 라벨 자리에 대응해 넣는다. **이 인덱스는 배열 위치가 아니라 `work.id`의 숫자에서 뽑는다** (`js/main.js`의 `createWorkCard`, `work.id.match(/(\d+)$/)`) — 병합/삭제로 배열에 빈 자리가 생겨도 라벨이 파일명과 어긋나지 않도록 하기 위함. `works.json`에 항목을 추가/삭제할 때 `id`만 `work-XX` 규칙을 지키면 라벨은 자동으로 맞다.
  - **2026-07-29 카테고리 접두어 제거**: 원래 라벨은 `${work.category} — ${인덱스}`(예: `AI IMAGE — 03`) 형태였는데, 사용자 요청으로 카테고리 문구를 빼고 두 자리 인덱스 숫자만 남겼다(`js/main.js`의 `category.textContent = String(num).padStart(2, '0')` 한 줄로 단순화). `works.json`의 `category` 필드 자체는 그대로 두었다(데이터 스키마는 유지, 화면에 렌더링만 안 함) — 나중에 다시 카테고리를 보여주고 싶으면 이 한 줄만 원래대로 되돌리면 된다. `work-06`의 `.category` 다크모드 색상 override(§2.3 "Work Gallery 텍스트 대비 수정") 등 `.category` 클래스에 걸린 기존 CSS는 텍스트 내용과 무관하게 그대로 적용된다.
- **2026-07-29 추가 — 카드에 외부 링크 연결 (`link` 필드)**: `works.json` 스키마에 선택적 `"link"` 필드를 추가했다 (4절 스키마에도 반영). `js/main.js`의 `createWorkCard`가 `work.link`가 있으면 `.media`(이미지/영상)를 `<a class="media-link" href="{link}" target="_blank" rel="noopener noreferrer">`로 감싸 렌더링한다 — `article.append(media, meta)` 대신 `article.append(mediaLink, meta)`. `.work-card .media-link { display:block; cursor:pointer; }`만 CSS에 추가했고(`cursor:pointer`는 사실 `<a>`의 기본값이라 없어도 되지만 명시적으로 남김), `.work-card .media`의 기존 스타일(`aspect-ratio:21/10` 등)은 자손 선택자라 래퍼가 하나 더 생겨도 그대로 적용된다.
  - **적용 사례**: `work-01`(AI IMAGE — 01)에 `"link": "/assets/documents/portfolio.pdf"`를 넣어 클릭 시 PDF 포트폴리오가 새 탭으로 열리게 했다. 원본 PDF는 사용자 다운로드 폴더의 `장주현 포트폴리오 최종 Jang Ju-hyeon Portfolio의 사본611.pdf`(한글+공백 파일명, 웹에서 인코딩 문제 소지)를 `assets/documents/portfolio.pdf`로 **복사**(원본은 그대로 둠)해서 영문 경로로 통일했다.
  - **2026-07-29 파일 교체**: 사용자가 새 PDF `장주현 포트폴리오 Jang Juhyun Portfolio 611.pdf`(다운로드 폴더, 6페이지, 이전 파일과 다른 내용 — md5 확인)로 교체를 요청 — `works.json`의 `link` 경로(`/assets/documents/portfolio.pdf`)와 `js/main.js`의 링크 로직은 그대로 두고, **경로가 가리키는 파일 내용만** 새 PDF로 덮어썼다(같은 파일명이라 복사 자체가 곧 이전 파일 교체 = 삭제). 프로젝트 안에는 이 경로 하나만 존재했으므로 별도로 지울 옛 사본은 없었다.
  - **2026-07-29 두 번째 카드에도 적용 — `work-06`**: `work-06`("오늘은 IPA다!", AI IMAGE — 06)에도 같은 패턴으로 `"link": "/assets/documents/portfolio-2021.pdf"`를 추가했다. 원본은 다운로드 폴더의 `장주현 포트폴리오 Jang Juhyun Portfolio2021.pdf`(2페이지, 5.4MB)를 복사한 것 — `work-01`이 이미 `portfolio.pdf`를 쓰고 있어서 파일명 충돌을 피하려고 `portfolio-2021.pdf`로 이름 붙였다. 코드 변경은 전혀 없었다(`createWorkCard`가 `work.link` 존재 여부만으로 범용 처리하므로) — `works.json`에 필드 하나 추가 + PDF 파일 하나 복사가 전부. 라이브 클릭으로 새 탭 오픈·연속 스크롤·`cursor:pointer` 모두 확인 완료. **디버깅 메모**: `works.json`을 고친 직후 `fetch()`로 곧장 확인하면 브라우저가 이전 응답을 캐시에서 재사용해 새 `link` 필드가 반영 안 된 것처럼 보일 수 있었다(Python `http.server`가 별도 캐시 헤더를 안 주는데도 발생) — `location.reload(true)`로 강제 리로드하니 정상 반영됨을 확인. 향후 `works.json` 수정 후 라이브 검증할 때는 하드 리로드를 거칠 것.
  - **2026-07-29 네 번째 카드 — `work-07`**: `work-07`("legodt 무드보드", AI IMAGE — 07)에도 같은 패턴으로 `"link": "/assets/documents/portfolio-15.pdf"`를 추가했다(원본은 다운로드 폴더의 `장주현 포트폴리오 Jang Juhyun Portfolio15.pdf`, 1페이지, 2.1MB — 내용도 실제 LEGODT 무드보드 프로젝트라 카드의 기존 alt 텍스트와 정확히 일치). 파일명은 이미 쓰인 `portfolio.pdf`/`portfolio-2021.pdf`/`portfolio2.pdf`와 겹치지 않게 `portfolio-15.pdf`로 지정. 마찬가지로 코드 변경 없이 `works.json` 필드 추가 + PDF 복사만으로 완결. **`read_page`(interactive 필터) 관련 메모**: 이 도구는 현재 뷰포트 근처의 인터랙티브 요소만 반환하는 것으로 보인다 — 화면 밖(스크롤 안 된) 카드의 링크는 목록에 안 잡혔고, `element.scrollIntoView()`로 카드를 뷰포트에 넣은 뒤 다시 호출하니 잡혔다. 페이지 하단부 요소를 ref로 클릭해야 할 때는 먼저 스크롤부터 시킬 것.
  - **2026-07-29 다섯 번째 카드 — `work-04`**: `work-04`("일러스트 과제 — 콘셉트 리디자인 작업", AI IMAGE — 04)에도 같은 패턴으로 `"link": "/assets/documents/portfolio-1620.pdf"`를 추가했다(원본은 다운로드 폴더의 `장주현 포트폴리오 Jang Juhyun Portfolio1620.pdf`, 5페이지, 17MB — 실제로 "콘셉트 리디자인 포스터 제작" 프로젝트라 카드의 기존 alt 텍스트와 정확히 일치). 파일명은 `portfolio-1620.pdf`로 지정(기존 `portfolio.pdf`/`portfolio-2021.pdf`/`portfolio-15.pdf`/`portfolio2.pdf`/`portfolio3.pdf`와 겹치지 않게). **버그 아님 — 자동화 도구 특성 메모**: 이번엔 `read_page`로 얻은 ref를 `computer` 툴로 클릭했을 때(두 번 재시도) 새 탭이 열리지 않다가, 같은 요소를 화면 좌표(스크린샷에서 실제 카드가 보이는 픽셀 위치)로 직접 클릭하니 바로 열렸다 — 이전 세션에서 문서화된 "JS `.click()`은 팝업 차단됨, 좌표 클릭만 신뢰 가능" 패턴과 유사하게, **ref 기반 클릭도 이 환경에서 가끔 실제 새 탭 열기에는 충분히 신뢰할 수 없을 때가 있다는 사례가 하나 추가됨** — PDF/외부 링크 검증 시 ref 클릭이 안 먹히면 스크린샷에서 좌표를 다시 잡아 좌표 클릭으로 재시도할 것.
  - **PDF 연속 스크롤 뷰어는 따로 안 만들었다** — Chrome 기본 PDF 뷰어가 새 탭에서 열릴 때 이미 위→아래 연속 스크롤을 기본 제공한다(직접 새 탭 열어서 15틱 스크롤해 1페이지→6페이지까지 끊김 없이 넘어가는 것 확인). 커스텀 뷰어는 불필요한 과설계라 판단해 만들지 않았다.
  - 다른 워크 카드(PDF든 외부 URL이든)에도 같은 방식으로 `works.json`에 `link` 필드만 추가하면 마크업 수정 없이 동일하게 동작한다 (4절의 "코드는 works.json을 읽어 렌더링" 원칙 유지).
  - **2026-07-29 세 번째 패턴 — 전용 포트폴리오 페이지(`work-02.html`)**: `link`가 항상 PDF나 외부 URL일 필요는 없다 — `work-02`("AI IMAGE — 02")는 **브라우저 기본 PDF 뷰어 대신 사이트 안의 전용 정적 페이지**로 연결했다. `works.json`의 `link`는 그냥 `"/work-02.html"`이라는 사이트 내부 페이지 경로일 뿐이고, `createWorkCard`의 `link` 처리 로직은 대상이 PDF인지 HTML 페이지인지 전혀 구분하지 않는다(그래서 이 케이스를 계기로 `mediaLink`의 aria-label 문구를 `"— PDF 포트폴리오 새 탭에서 열기"`에서 `"— 포트폴리오 새 탭에서 열기"`로 일반화했다 — PDF 전용 문구가 이제 항상 맞는 건 아니라서).
    - **구성**: 영상(`assets/documents/portfolio2-video.mp4`, 원본은 프로젝트 루트에 사용자가 미리 둔 `장주현_최종 마린세르.mp4`) + PDF 2페이지를 **정적 JPEG로 미리 렌더링**한 이미지(`assets/documents/portfolio2-pages/page-1.jpg`, `page-2.jpg`, PyMuPDF로 2x 줌·JPEG q88 변환, 원본 PDF는 `assets/documents/portfolio2.pdf`로 별도 보관)를 위→아래로 세로로 이어 붙인 것. **PDF.js 같은 클라이언트 렌더링 라이브러리는 쓰지 않았다** — 정적 이미지로 미리 구워두는 쪽이 이 프로젝트의 "빌드 도구 없는 정적 사이트" 원칙(7절)에 맞고, 어차피 스크롤 연속성만 필요하므로 과설계가 아니다.
    - **폭 통일**: 영상 원본이 1920×1080, PDF 페이지가 1440×810 — 우연히 둘 다 16:9라 별도 크롭 없이 세 요소 모두 `.pf-media { width:100%; height:auto; }`로 부모 컨테이너(`.pf-page`, `max-width:68.75rem`) 폭에 맞춰 스케일되게만 하면 자동으로 폭이 통일된다(실측 `getBoundingClientRect`로 세 요소 모두 정확히 같은 너비임을 확인).
    - **새 파일 두 개**: `work-02.html`(루트, `<head>`에 최소한의 title/description만, `site-header`/nav 없이 `<main class="pf-page">` 하나에 `<video>` + `<img>` 두 개만 들어있음 — "불필요한 UI 없이 콘텐츠만"이라는 요청을 문자 그대로 반영해 뒤로가기 링크조차 넣지 않았다)와 `css/portfolio-page.css`(전역 `css/style.css`를 재사용하지 않고 완전히 별도 — site-header/섹션 스타일이 섞여 들어오는 걸 피하려는 의도). 배경은 `#F3E7D3`(`--bg-light`와 같은 값이지만 변수 자체는 `style.css`에만 정의돼 있어 재사용 대신 하드코딩).
    - 영상은 여기서도 `autoplay muted loop playsinline disablePictureInPicture disableRemotePlayback`, `controls` 없음, `pointer-events:none` — 메인 사이트의 Hero/Gen-Window 영상과 동일한 안전장치. `autoplay` 폴백(§0 참고)도 페이지 자체에 인라인 스크립트로 최소 버전을 넣었다(`main.js`를 불러오지 않는 독립 페이지라서).
    - **디버깅 메모 — 스크린샷 도구의 스크롤 위치 지연**: 이 페이지를 검증하면서 `window.scrollTo`/`getBoundingClientRect`로는 스크롤이 정확히 맨 아래(video/page-1/page-2 경계가 계산과 정확히 일치)까지 갔다고 나오는데, 그 직후 찍은 스크린샷은 여전히 이전 스크롤 위치의 콘텐츠를 보여주는 현상이 있었다 — DOM 측정값(좌표·크기)은 신뢰할 수 있지만 이 브라우저 자동화 도구의 스크린샷이 실제 렌더링을 즉시 반영하지 못할 때가 있다는, 이전에도 한 번 문서화됐던(§ "Browser scroll/screenshot flakiness" 계열) 동일한 종류의 한계로 판단 — 이런 경우 스크린샷보다 `getBoundingClientRect` 등 DOM 측정값을 우선 신뢰할 것.
  - **2026-07-29 같은 패턴을 두 번째 카드에 적용 — `work-05` (`work-05.html`)**: `work-05`("iclearrrr 프로젝트 비주얼", AI IMAGE — 05)에도 동일한 "전용 포트폴리오 페이지" 방식을 적용했다 — `works.json`의 `link`를 `"/work-05.html"`로, 영상은 `assets/documents/portfolio3-video.mp4`(원본 `장주현_무빙포스터_블렌더.mp4`, 프로젝트 루트에 사용자가 미리 둠, 1080×1350 **세로(4:5)** 비율, 22초), PDF는 `assets/documents/portfolio3.pdf`(원본 다운로드 폴더의 `장주현 포트폴리오 Jang Juhyun Portfolio12.pdf`, 1페이지) → `assets/documents/portfolio3-pages/page-1.jpg`로 미리 렌더링(PyMuPDF 2x줌·JPEG q88, 1440×810 16:9). **파일명 충돌 주의**: 사용자가 요청 메시지에서 예시로 든 파일명(`portfolio2-video.mp4`/`portfolio2.pdf`)이 `work-02`가 이미 쓰고 있는 이름과 그대로 겹쳤다 — 매번 예시 그대로 쓰지 말고 이미 존재하는 `assets/documents/` 파일 목록을 확인해 충돌 없는 이름(`portfolio3-*`)을 골라야 한다. **비율이 서로 다른 케이스**: `work-02`(영상·PDF 둘 다 16:9)와 달리 이번엔 영상이 세로(4:5)라 PDF의 가로(16:9)와 비율이 다르다 — 그래도 `.pf-media{width:100%;height:auto}`는 각 요소가 자기 원본 비율을 유지한 채 컨테이너 폭에만 맞추므로, "가로 폭 통일"(요청 3번 조건)은 그대로 성립하고 세로 높이만 요소별로 달라진다(실측: 두 요소 모두 정확히 1100px 폭, video 1375px / page-1 618.75px 높이, 경계에 gap 없이 이어붙음). CSS/JS 변경 없이 `work-02.html`과 동일한 `css/portfolio-page.css`를 그대로 재사용했다.
    - **요청 중 오타 정정 사례**: 최초 요청에는 PDF가 `장주현 포트폴리오 Jang Juhyun Portfolio45.pdf`(=`work-02`가 이미 쓰고 있는 바로 그 PDF)로 적혀 있었는데, 다운로드 폴더를 확인하려던 중 사용자가 스스로 `Portfolio12.pdf`로 정정한 재요청을 보내왔다 — 이전 요청을 복붙하면서 파일명을 안 바꾼 실수로 추정. 앞으로 이런 요청에서 PDF/영상 파일명이 직전 카드에 쓴 파일과 우연히 동일하면 그대로 진행하지 말고 사용자에게 확인할 것.
    - **2026-07-29 후속 수정 — 영상 크기 축소**: 세로(4:5) 영상을 컨테이너 폭 100%로 두니 1375px 높이까지 커져서 PDF 페이지(619px)에 비해 과하게 크다는 피드백 → "PDF 크기에 맞추지 말고 비율만 유지한 채 더 작게"라는 요청대로, `css/portfolio-page.css`에 `.pf-media.pf-media--compact { width:50%; margin:0 auto; }` 모디파이어를 추가하고 `work-05.html`의 `<video>`에만 `pf-media--compact` 클래스를 얹었다(`width:50%`는 `.pf-media`의 `width:100%`보다 클래스 2개라 명시적 오버라이드 없이도 자연스럽게 이김). 결과: 영상 550×687.5px(비율 그대로 0.8 유지)로 축소되고 가운데 정렬, 폭이 줄어든 만큼 좌우로 배경(#F3E7D3)이 보인다. **CSS가 `work-02.html`과 공유되므로 새 클래스를 모디파이어로 분리**해 `work-02`의 영상(16:9, 원래도 폭 100%가 적절)은 전혀 건드리지 않았다 — 실측으로 `work-02.html` 쪽 video/img 3개 모두 여전히 1100px 폭 그대로임을 재확인.
    - **2026-07-29 세 번째 수정 — PDF 풀블리드 + 영상 섹션 배경색**: "PDF를 여백없이 화면에 꽉 차게(비율 유지), 영상이 있는 배경은 `#212121`로" 요청 → `work-05.html`에만 두 가지를 적용했다:
      1. **PDF 이미지를 뷰포트 끝까지 채움**: 처음엔 흔한 `width:100vw; margin-left:calc(50% - 50vw);` 풀블리드 트릭을 썼는데, 이 페이지는 세로 스크롤바가 항상 존재해서(영상+PDF 합치면 뷰포트보다 김) `100vw`가 스크롤바 폭까지 포함해 계산되는 바람에 실측 좌우 경계가 7.5px씩 어긋났다(왼쪽은 -7.5px 흘러나가고 오른쪽은 7.5px 못 미침 — `overflow-x:hidden`으로 안 보이게는 막았지만 완전히 "여백없이 꽉 참"은 아니었음). **CSS Grid 방식으로 교체**해 해결: `body`를 `display:grid; grid-template-columns:1fr min(68.75rem,100%) 1fr;`(가운데 칸이 기존 1100px 콘텐츠 폭)로 만들고, `.pf-page`는 `display:contents`로 바꿔 자기 자신은 박스를 안 만들고 자식들을 body 그리드에 직접 참여시켰다. 기본 `.pf-media`는 `grid-column:2`(가운데 칸)로 기존과 동일하게 유지하고, `.pf-full-bleed` 클래스가 붙은 요소만 `grid-column:1/-1`(3칸 전부)로 확장 — `document.documentElement.clientWidth`(스크롤바 제외한 실제 사용 가능 폭)와 정확히 일치하는 값으로 렌더링됨을 실측 확인(vw 기반 방식과 달리 스크롤바 유무에 영향받지 않음).
      2. **영상 섹션 배경 `#212121`**: `<video>`를 `<div class="pf-video-section pf-full-bleed">`로 감싸 배경색과 풀블리드 폭을 이 섹션에 줬다. **주의(회귀 방지)**: 섹션 자체가 풀블리드로 뷰포트 전체 폭이 되면, 그 안의 `.pf-media--compact{width:50%}`가 이제 뷰포트 전체의 50%를 기준으로 계산돼 버려서 바로 직전에 확정한 550px 크기가 아니라 훨씬 커진 크기로 되돌아가는 부작용이 생긴다 — 이를 막기 위해 `<div class="pf-video-inner">`(폭 `min(68.75rem,100%)`, 기존 `.pf-page`가 하던 1100px 캡과 동일)를 영상 바깥에 한 겹 더 둬서, 영상의 50% 계산 기준을 여전히 1100px로 고정했다. 결과: 배경은 뷰포트 끝까지 `#212121`로 채워지고, 영상 자체 크기(550×687.5px, 가운데 정렬)는 직전 상태와 픽셀 단위로 동일하게 유지됨을 실측 재확인.
      - `work-02.html`은 `pf-full-bleed`/`pf-video-section` 클래스를 전혀 안 쓰므로 이 변경들의 영향을 받지 않는다 — `display:contents`로 바뀐 `.pf-page` 아래에서도 기본 `.pf-media{grid-column:2}` 규칙 덕분에 기존과 동일하게 1100px 폭·가운데 정렬로 렌더링됨을 실측 재확인(video/img 3개 전부 1100px, left:230px = 그리드 가운데 칸 시작 위치와 일치).
    - **2026-07-29 네 번째 수정 — `work-02.html`에도 동일 패턴 적용**: "AI IMAGE — 02도 아까와 같은 조건(PDF 풀블리드 + 영상 배경 `#212121`)으로" 요청 → `work-05.html`에서 쓴 것과 완전히 같은 마크업 패턴을 그대로 옮겼다. `<video>`를 `<div class="pf-video-section pf-full-bleed"><div class="pf-video-inner">...</div></div>`로 감싸고, PDF 페이지 이미지 2장(`page-1.jpg`, `page-2.jpg`) 각각에 `pf-full-bleed` 클래스를 추가했다. **CSS는 이미 `work-05` 작업 때 범용으로 만들어둬서 전혀 손대지 않았다** — `.pf-video-section`/`.pf-video-inner`/`.pf-full-bleed`가 처음부터 두 페이지가 공유하는 `css/portfolio-page.css`에 있었기 때문에 HTML 마크업만 같은 패턴으로 바꾸면 됐다. `work-02`의 영상은 `work-05`와 달리 `pf-media--compact`를 쓰지 않아 원래도 16:9로 `pf-video-inner`(1100px 캡) 폭을 꽉 채우는 크기였는데, 그 크기 자체는 이번에도 변경 요청이 없었으므로 그대로 뒀다(실측: 영상 여전히 1100×618.75px, 가운데 정렬 — 배경만 뷰포트 끝까지 `#212121`로 확장됨). PDF 페이지 2장도 `clientWidth`와 정확히 일치하는 폭으로 렌더링됨을 확인.
  - **2026-07-29 세 번째 카드 — `work-03` (`work-03.html`), 요구사항이 달라 새 변형 도입**: `work-03`("RUNNING WITH JESS — EP. 01", AI MOTION — 03)에도 "전용 포트폴리오 페이지" 패턴을 적용했지만, 이번엔 이전 두 페이지(`work-02`/`work-05`)와 조건이 명시적으로 달랐다: **① 영상·PDF 가로 폭을 통일하지 않고 영상은 자기 비율 유지한 채 작게, ② PDF는 화면에 꽉 차게(풀블리드), ③ 페이지 배경 전체가 `#212121`**(이전 두 페이지는 영상 섹션만 어둡고 나머지는 `#F3E7D3`였음). 파일: 영상 `assets/documents/portfolio4-video.mp4`(원본 다운로드 폴더의 `toven brand film.mp4`, 1080×1920 세로 9:16, 20초 — TOVEN 골전도 이어폰 브랜드 필름, 폰으로 플레이리스트를 고르며 거리를 걷는 장면), PDF `assets/documents/portfolio4.pdf`(원본 `장주현 포트폴리오 Jang Juhyun Portfolio1215.pdf`, 4페이지, 13.7MB) → `assets/documents/portfolio4-pages/page-1~4.jpg`(PyMuPDF 2x줌·JPEG q88, 2880×1620 16:9). 파일명은 `portfolio2/3`이 이미 있어 `portfolio4-*`로 지정.
    - **CSS 처리**: `css/portfolio-page.css`에 `body.pf-page-dark { background:#212121; }` 모디파이어를 opt-in으로 추가(기존 `html,body{background:#F3E7D3}` 뒤에 위치, 클래스가 element 셀렉터를 이겨서 `work-03.html`에만 적용되고 `work-02`/`work-05`는 이 클래스가 없어 영향 없음). `work-03.html`의 `<body class="pf-page-dark">`에서만 활성화. 이전 두 페이지처럼 영상만 감싸는 `.pf-video-section`(자체 어두운 배경) 래퍼가 **필요 없어졌다** — 페이지 전체가 이미 `#212121`이라 영상 주변에 별도 배경을 줄 이유가 없어서, `work-03.html`은 `<video class="pf-media pf-media--compact">`를 그냥 `.pf-page` 바로 아래 둔다(감싸는 div 없음) — `work-02`/`work-05`보다 마크업이 더 단순하다. 영상이 세로 9:16이라 기존 `.pf-media--compact`(50% 폭, 1100px 기준 550px)를 그대로 재사용했고, PDF 4장은 기존 `.pf-full-bleed`(그리드 3칸 전체, 뷰포트 폭)를 그대로 재사용 — 새 유틸리티 클래스는 `body.pf-page-dark` 하나뿐이었다.
    - **검증 메모 — `works.json` 캐시가 이번엔 완전히 새 탭에서도 재현됨**: 이전엔 "완전히 새 탭을 열면 해결된다"고 문서화했었는데, 이번엔 `tabs_create_mcp`로 만든 새 탭에서도, `location.reload(true)`를 호출해도 `fetch('/assets/work/works.json')`이 계속 `link` 필드 없는 이전 응답을 반환했다(반면 `curl`로 서버에 직접 요청하면 정상). `fetch(url, {cache:'no-store'})`로는 정상 데이터가 왔으므로 문제는 서버가 아니라 브라우저의 HTTP 디스크 캐시(탭과 무관하게 프로필 전체에 걸림)였다 — 이번에 확실히 통한 방법은 **`Ctrl+Shift+R`(하드 리로드) 키 조합을 페이지에 직접 전송**하는 것이었다(`computer` 툴의 `key` 액션으로 `ctrl+shift+r`). 이후 `location.reload(true)`나 새 탭 생성만으로는 캐시를 못 뚫는 경우도 있다는 뜻이니, 그 방법이 안 먹히면 이 하드 리로드 단축키를 다음 시도로 쓸 것.
    - **디버깅 메모 — `scroll-behavior:smooth`와 동기 스크립트의 경합**: 전역 `html{scroll-behavior:smooth}` 때문에, `element.scrollIntoView()`를 호출한 직후 같은 스크립트 안에서 바로 `getBoundingClientRect()`를 읽으면 스크롤 애니메이션이 아직 시작 전이라 이전 좌표가 그대로 나온다(이번엔 실제로 엉뚱한 섹션까지 스크롤되어 화면이 어긋난 스크린샷을 한 번 만들었다). 해결책: `document.documentElement.style.scrollBehavior='auto'`로 임시 전환한 뒤 `scrollIntoView({behavior:'instant', block:'center'})`를 호출하면 그 자리에서 즉시 스크롤이 끝나 좌표 계산이 안정적이다.
    - **라이브 검증 완료**: 메인 페이지에서 `work-03` 카드 hover 시 `cursor:pointer`(getComputedStyle로 확인), 좌표 클릭 시 실제로 새 탭이 열림(2회 재현), 새 탭에서 `body` 배경 `rgb(33,33,33)` = `#212121`, 영상 550×977.8px(9:16 유지, compact), PDF 4장이 각각 뷰포트 폭 그대로 이어붙음, 영상 `autoplay/loop/muted/controls 없음` 속성 전부 확인(다만 백그라운드 탭이라 자동재생이 지연돼 수동 `play()`로 재개 확인 — 실사용 시 포그라운드 탭이면 즉시 재생될 것으로 예상).
    - **2026-07-29 영상 파일 교체**: 사용자가 처음 지정한 영상이 실제로는 다운로드 폴더가 아니라 `C:\Users\user\Desktop\핸디_TOVEN ai brand film storyboard\toven ai 브랜드 필름.mp4`(별도 프로젝트 폴더, 109MB, 2160×2880 = **세로 3:4** 비율, 17.44초)에 있던 파일이었다 — 이전에 다운로드 폴더에서 찾아 썼던 동명이 아닌 `toven brand film.mp4`(34MB, 1080×1920 9:16)는 다른 파일이었음이 밝혀져 폐기. `assets/documents/portfolio4-video.mp4`(같은 파일명 그대로 유지, 즉 파일 교체 = 이전 내용 삭제)만 이 새 파일로 덮어썼다 — **PDF/HTML/CSS/works.json은 전혀 건드리지 않았다**(사용자가 "영상만 수정, 나머지는 그대로 유지" 요청). 마크업이 이미 `.pf-media--compact`(50% 폭, `height:auto`로 원본 비율 자동 유지)를 쓰고 있어서 비율이 9:16→3:4로 바뀌어도 CSS 수정 없이 자동으로 새 비율에 맞게 렌더링됨(실측 550×733.3px)을 확인. **한글 경로 인코딩 이슈**: `moviepy`/`ffmpeg`에 한글+공백이 섞인 원본 경로를 직접 넘기면 내부적으로 깨진 경로 문자열이 되어 `FileNotFoundError`가 났다(Bash `cp`로 파일을 옮기는 것 자체는 문제없이 성공하는데, Python subprocess로 ffmpeg를 호출할 때만 깨짐) — 먼저 Bash `cp`로 프로젝트 폴더의 영문 경로(`portfolio4-video.mp4`)로 복사한 뒤 그 영문 경로를 moviepy에 넘기면 문제없이 동작한다. 앞으로 한글 파일명이 낀 영상의 메타데이터(크기/길이)를 확인해야 할 때는 항상 이 순서(먼저 영문 경로로 복사 → 그 경로로 분석)를 따를 것.
  - **2026-07-29 여섯 번째 카드 — `work-08` (`work-08.html`), `work-03`과 동일한 "페이지 전체 다크" 변형 재사용**: `work-08`(AI IMAGE — 08)에도 `work-03.html`과 완전히 같은 요구사항(영상·PDF 폭 통일 안 함/영상은 비율 유지한 채 적당한 크기/PDF 풀블리드/페이지 전체 배경 `#212121`)으로 전용 페이지를 만들었다. 파일: 영상 `assets/documents/portfolio5-video.mp4`(원본 `Not This Time.mp4`, 프로젝트 루트에 사용자가 이미 둔 파일이라 다운로드 폴더 검색 없이 바로 발견, 234MB, 1920×1080 **16:9**, 3분1초), PDF `assets/documents/portfolio5.pdf`(원본 다운로드 폴더의 `장주현 포트폴리오 Jang Juhyun Portfolio1718.pdf`, 2페이지, 10MB, "2026 대한민국 AI 콘텐츠 페스티벌(KAiCF) 공모전" 내용) → `assets/documents/portfolio5-pages/page-1~2.jpg`(PyMuPDF 2x줌·JPEG q88, 2880×1620 16:9). 파일명은 `portfolio2/3/4`가 이미 있어 `portfolio5-*`로 지정.
    - **`work-03`과의 차이점은 영상 비율뿐**: `work-03`의 영상은 세로(9:16→3:4)라 `.pf-media--compact`(50% 폭)를 썼지만, 이번 영상은 가로 16:9라 **compact 없이 기본 `.pf-media`**(grid-column:2, 1100px 캡, `width:100%;height:auto`)만 썼다 — 1100px 폭에서 자동으로 618.75px 높이가 되어 이미 "적당한 크기"라 축소 모디파이어가 필요 없었다. `work-03.html`과 마찬가지로 영상을 감싸는 `.pf-video-section` 래퍼는 쓰지 않았다(페이지 전체가 이미 `#212121`이므로 불필요) — `body.pf-page-dark` 하나로 끝나는 가장 단순한 마크업 패턴. 새 CSS는 전혀 추가하지 않았다(모든 유틸리티 클래스가 `work-03` 때 이미 만들어짐).
    - **라이브 검증**: 메인 페이지 하드 리로드(`Ctrl+Shift+R`) 후 `a[href="/work-08.html"]`의 `cursor:pointer`/`target=_blank`/`rel=noopener noreferrer` 확인, 좌표 클릭으로 실제 새 탭 오픈 확인, 새 탭에서 `body` 배경 `rgb(33,33,33)`, 영상 1100×618.75px(재생 중, loop/muted/컨트롤없음), PDF 2장이 각각 뷰포트 폭(1905px)으로 풀블리드 렌더링됨을 `getBoundingClientRect`와 스크린샷으로 재확인.
  - **2026-07-29 일곱 번째 카드 — `work-09` (`work-09.html`), 완전히 다른 단순 패턴**: `work-09`(AI IMAGE — 09, 여전히 플레이스홀더 이미지/제목)에는 앞선 6개 카드(PDF 직접 링크 또는 영상+PDF 조합 전용 페이지)와 전혀 다른, **세로로 아주 긴 PNG 이미지 1장만 보여주는** 전용 페이지를 만들었다. 원본 파일은 다운로드 폴더의 `Section 1 (1).png`(10112×28928px, 세로 매우 긴 비율 0.35, 38MB — 내용은 "해결설비"라는 이름의 배관/설비 수리 업체 웹사이트 디자인 목업 스크린샷으로 보임, AI 이미지 렌더가 아니라 웹디자인 포트폴리오 결과물인 듯하나 사용자 요청 그대로 반영)를 `assets/documents/work-09-portfolio.png`로 복사했다(파일명 충돌 없음, `portfolio6` 같은 순번 대신 `work-09`에 귀속된 이름을 붙임 — 이 페이지는 PDF가 아니라 이미지 단독이라 기존 `portfolioN` 넘버링 계열과 성격이 달라서 구분되는 이름을 골랐다).
    - **`work-09.html`은 `css/portfolio-page.css`를 재사용하지 않고 완전히 독립적인 인라인 `<style>`만 쓴다** — 다른 6개 페이지는 전부 "영상+PDF 스택" 전용 스타일(그리드 풀블리드, compact 모디파이어 등)을 공유하는데, 이번엔 요구사항이 그 스타일의 전제(그리드 3칸, `.pf-media`/`.pf-full-bleed` 등)와 무관하고 훨씬 단순하다(`* { margin:0; padding:0; box-sizing:border-box; } img { display:block; width:100%; height:auto; }`뿐). 배경색 지정 요청이 없어 브라우저 기본(흰색) 그대로 뒀다 — 필요해지면 이 페이지의 `<style>`에만 추가하면 되고 다른 페이지에는 영향 없다.
    - `works.json`에 `"link": "/work-09.html"`만 추가 — `createWorkCard`가 이미 `target="_blank" rel="noopener noreferrer"`로 감싸는 범용 로직이라 요청 1번("target=\"_blank\" 새 탭")은 마크업/JS 변경 없이 자동 충족됐다.
    - **라이브 검증**: `body`의 `margin`/`padding` 모두 `0px`, `<img>`가 `display:block; width:100%`로 `document.documentElement.clientWidth`(1905px)와 정확히 일치(좌우 여백 없음), `height:auto`로 원본 비율(10112:28928) 그대로 유지(실측 높이 5449.7px) — 반응형 폭 대응은 `width:100%` 자체가 뷰포트 폭 변화에 자동 추종하므로 별도 미디어쿼리 불필요. 메인 카드 클릭 → 새 탭 오픈까지 좌표 클릭으로 재현 확인.
    - **2026-07-29 썸네일 교체**: `work-09` 카드의 그리드 썸네일(그때까지 플레이스홀더 `work-09.jpg`)을 다운로드 폴더의 `Group 1410118892.png`(3840×1966, RGBA)로 교체 — `assets/work/images/work-09.png`로 복사하고 `works.json`의 `src`만 `.jpg`→`.png`로 갱신, **`title`/`alt`/`featured`/`link`는 전부 그대로 유지**(사용자가 "이미지만, 나머지는 그대로" 요청). 확장자가 바뀌었으므로(플레이스홀더는 jpg, 새 파일은 png) 옛 `work-09.jpg`는 더 이상 어디서도 참조되지 않아 프로젝트에서 삭제했다. 실제 이미지 내용은 `work-09.html`(§2.4, 세로로 긴 PNG 상세 페이지)과 같은 "해결설비"(배관 설비 업체) 웹사이트 디자인 프로젝트의 히어로 배너로, 상세 페이지와 썸네일이 같은 프로젝트를 가리켜 서로 정합성이 맞다.
  - **2026-07-29 여덟 번째 카드 — `work-10` (`portfolio-10.html`), 라이브 외부 사이트 iframe 임베드 패턴**: `work-10`(AI IMAGE — 10, 여전히 플레이스홀더 이미지/제목)에는 지금까지와 또 다른 새로운 패턴 — **PDF도 아니고 단독 이미지도 아닌, 사용자가 실제 제작/수정에 참여한 라이브 웹사이트(`https://law-seonjin.co.kr/`, 법률사무소 선진 — 아임웹 기반)를 iframe으로 그대로 보여주는** 전용 페이지를 만들었다. **이번엔 파일명을 `work-10.html`이 아니라 사용자가 메시지에서 직접 지정한 그대로 `portfolio-10.html`로 지었다** — 이전 `work-08` 요청 때는 "예: portfolio-08.html"처럼 "예:"가 붙은 참고용 예시였어서 기존 `work-XX.html` 관례를 따랐지만, 이번엔 "예:" 없이 파일명을 직접 못박아 요청했으므로 관례보다 사용자의 명시적 지정을 우선했다 — **이 프로젝트에 한해 전용 페이지 파일명이 `work-XX.html` 패턴과 다르다는 점**을 기억할 것 (나중에 `work-10`을 찾을 때 `work-10.html`이 아니라 `portfolio-10.html`을 봐야 함).
    - **iframe 차단 여부 사전 확인**: 임베드 전에 `curl -sIL https://law-seonjin.co.kr/`로 응답 헤더를 확인해 `X-Frame-Options`/`Content-Security-Policy: frame-ancestors` 헤더가 없음을 확인했다(아임웹 호스팅, CloudFront 경유) — 실제로 iframe이 정상 로드됨을 라이브로 재확인.
    - **구성**: `<body>`를 `display:flex; flex-direction:column; height:100%`로 만들고 `<header class="p10-header">`(고정 높이, `flex:0 0 auto`) + `<div class="p10-frame-wrap">`(`flex:1 1 auto`, 안에 `iframe{width:100%;height:100%;border:0}`)로 나머지 전체를 채운다. 헤더는 좌측 `← Back`(`href="/#work"`, 메인 페이지 Work Gallery로), 가운데 프로젝트 제목("아임웹 기반 웹페이지 제작 및 HTML을 활용한 웹 요소 구현", `--font-display`인 Fraunces), 우측 `Visit Live Site ↗` 버튼(`--accent` 배경의 pill 버튼, `target="_blank" rel="noopener noreferrer"`로 라이브 사이트를 새 탭에 연다) 3분할 flex — 메인 사이트와 같은 Google Fonts(Fraunces + JetBrains Mono)를 `<head>`에 직접 링크하고 `--bg-light`/`--ink-on-light`/`--accent` 색상 값을 그대로 하드코딩(전역 `style.css`를 불러오지 않는 독립 페이지라 값만 복제 — `work-09.html`이 완전 무관한 페이지라 아무 톤도 안 맞춘 것과 달리, 이번엔 "기존 디자인 톤과 통일감" 요청이 있어 의도적으로 톤을 맞췄다).
    - **fallback 처리**: iframe에 `load` 이벤트가 3초 안에 안 오면(`X-Frame-Options` 등으로 차단된 경우를 가정) `.p10-fallback`(안내 문구 + "사이트 바로가기 ↗" 버튼)을 절대위치로 iframe 위에 덮어씌운다. **한계 인지하고 기록**: 크로스오리진 iframe은 브라우저/사이트 정책에 따라 차단되어도 `load` 이벤트 자체는 발생하는 경우가 있어(차단된 빈 프레임도 "로드 완료"로 간주될 수 있음) 이 타임아웃 방식이 100% 신뢰할 수 있는 감지는 아니다 — 크로스오리진 제약상 부모 페이지에서 iframe 내부 렌더링 성공 여부를 직접 확인할 방법이 없어 이 프로젝트의 다른 "완벽하진 않지만 실용적인" 패턴들과 마찬가지로 최선의 근사치로 구현했다. 실제로는 대상 사이트가 차단 헤더를 보내지 않는 것으로 확인됐으므로(위 curl 확인) 정상 케이스에서는 fallback이 뜨지 않는다.
    - **라이브 검증**: 메인 페이지 하드 리로드 후 `a[href="/portfolio-10.html"]`의 `cursor:pointer`/`target=_blank`/`rel=noopener noreferrer` 확인, 좌표 클릭으로 실제 새 탭 오픈 및 라이브 사이트(법률사무소 선진 홈페이지) 정상 렌더링을 스크린샷으로 확인. `body` margin/padding 0, iframe 높이가 `window.innerHeight`에서 헤더 높이(59.2px)를 뺀 나머지를 정확히 채움(`bottom:935 === innerHeight:935`), `border:0`, fallback `is-visible` 없음(정상 로드), 헤더 3요소 폰트/색상(`Fraunces`, `JetBrains Mono`, `#DFA6A8`)이 메인 사이트 변수 값과 일치함을 `getComputedStyle`로 확인. `index.html`/`css/style.css` 파일 mtime이 이번 작업 전후로 변하지 않았음을 확인해 "기존 메인 페이지 스타일은 건드리지 않았다"는 요청 조건을 재확인했다.
    - **2026-07-29 `work-09.html`에도 같은 헤더 바 추가 (이미지 본문은 그대로)**: 사용자가 "09도 10과 똑같은 상단바"를 요청 — `portfolio-10.html`의 헤더 마크업/스타일(`← Back` / 가운데 제목 / `Visit Live Site ↗` pill 버튼, Fraunces+JetBrains Mono, `--bg-light`/`--ink-on-light`/`--accent` 하드코딩 값)을 그대로 `work-09.html`에 복제하되 클래스 접두어만 `p10-`→`p09-`로 바꿨다(페이지가 서로 독립적이라 이름이 겹쳐도 문제는 없지만 파일별로 구분되게 유지). 제목은 "Figma를 활용한 웹페이지 UI 디자인 시안 제작 및 화면 구성 설계", 방문 링크는 `https://xn--p89aj74ac7bis6a.com/`(퓨니코드 도메인, 아임웹 호스팅 — `curl -sI`로 사전에 정상 응답 확인, 이번엔 iframe 임베드가 아니라 새 탭 링크로만 쓰여서 X-Frame-Options 여부는 무관). **기존 `<img>` 태그와 그 아래 원본 이미지(`work-09-portfolio.png`)는 한 글자도 건드리지 않았다** — 헤더를 `<body>` 맨 앞에 추가만 하고 `<img>`는 그 뒤에 그대로 둬서, `img{width:100%;height:auto}` 스타일과 실제 렌더링(1905px 폭, 원본 비율 유지)이 헤더 추가 전과 완전히 동일함을 재확인했다. 스크린샷으로 보면 헤더 아래 이미지 내용(같은 "해결설비" 프로젝트의 Figma 시안 비교 목업 — "메인 홈", "Type 01", "Type 02")이 제목과 실제로 부합한다.
    - **2026-07-29 썸네일 교체**: `work-10` 카드의 그리드 썸네일(플레이스홀더 `work-10.jpg`)을 데스크탑의 `20260729_212610.png`(1905×993, RGB — 법률사무소 선진 라이브 사이트 스크린샷, `portfolio-10.html`이 iframe으로 보여주는 바로 그 사이트와 일치)로 교체 — `assets/work/images/work-10.png`로 복사, `works.json`의 `src`만 `.jpg`→`.png` 갱신, **`title`/`alt`/`featured`/`link`는 전부 그대로 유지**. 옛 `work-10.jpg`는 더 이상 참조되지 않아 삭제했다.

### 2.5 About 카드 — 섹션 경계에 걸치는 배치

원본 인터뷰 페이지는 스크롤 중 배경(이미지/톤)이 바뀌는 경계 지점에 흰 텍스트 박스가 겹쳐 올라오는 연출을 반복해서 쓴다 (그림 위에 얹힌 answer 카드). 우리 사이트에서는 About 카드 하나에 이 장치를 적용한다.

*(2026-07 개정: 이 카드가 걸치는 경계가 Work↔About에서 **Hero↔Gen-Window Showcase**로 바뀌었다. Figma 목업에서 About 카드가 히어로 사진 하단부에 걸쳐 나타났기 때문.)*

- About 소개 문구는 섹션 배경에 바로 놓지 않고, `--bg-light` 톤의 별도 카드(박스)에 담는다.
- 이 카드는 **자기 자신만의 섹션을 갖지 않는다.** `index.html`에서 `<section id="hero">…</section>` 바로 뒤, `<section class="gen-showcase">` 바로 앞에 오는 얇은 `<div class="about-straddle" id="about">` 안에 들어 있다 — Hero나 Gen-Window Showcase의 **자식이 아니라 형제(sibling)**여야 한다. 두 이웃 섹션 중 어느 쪽이 드래그 가능한 gen-window를 담기 위해 `overflow:hidden`을 쓰더라도(2.4절), 카드가 그 자식이 아니므로 잘리지 않는다 — 이 순서를 절대 바꾸지 말 것.
- 카드는 음수 `margin-top`으로 Hero 쪽으로 끌어올리고, 음수 `margin-bottom`으로 Gen-Window Showcase 쪽으로 끌어내려 양쪽 섹션에 동시에 걸치게 한다.
- 카드에는 은은한 그림자를 줘서 배경 위에 얹혀 있다는 층위감을 강조한다.
- 모바일에서는 겹침 폭을 줄이거나 생략해 레이아웃이 깨지지 않게 한다 (화면이 좁아 오버랩이 부자연스러워질 수 있음) — `margin-top`/`margin-bottom`/`margin-left`를 모두 0으로 되돌린다.

**2026-07-29 두 번째 스트래들 카드 추가 (Work↔Contact 경계)**: 사용자 요청으로 네 번째(Work Gallery)·다섯 번째(Contact) 섹션 경계에 같은 장치를 하나 더 추가했다. **"완전히 동일한 스타일"이 요구사항이라 새 CSS를 거의 안 만들고 기존 클래스를 그대로 재사용했다** — `<div class="about-straddle" id="contact-teaser">` 안에 `<div class="about-card contact-card">`를 넣고, 그 안에 `<p class="mono-label">CONTACT — OPEN</p>` + `<blockquote class="about-quote">…</blockquote>`를 그대로 씀. 유일한 커스텀 규칙은 좌우 위치를 뒤집는 것 하나뿐: `.about-card.contact-card { margin-left:0; margin-right:auto; }` (About 카드는 `margin-left:auto`라서 오른쪽에, 이 카드는 반대로 왼쪽에 온다). 폰트: 라벨("CONTACT — OPEN")은 `.mono-label`이 이미 JetBrains Mono Medium·non-italic이라 그대로 요구사항과 일치하고, 본문은 `.about-quote`(JetBrains Mono Italic)를 그대로 재사용했다. 실제 컴퓨티드 스타일(`getComputedStyle`)로 두 카드의 폰트/사이즈/굵기/이탤릭이 100% 동일함을, 그리고 `margin-left`/`margin-right` 값이 정확히 반대로 미러링됨을 확인했다. **`.about-card` 자체는 전혀 수정하지 않았다** — 첫 번째 스트래들 카드(About, Hero↔Gen-Showcase 경계)는 그대로다. 모바일 대응은 별도로 안 만들었는데, `.about-card`의 기존 모바일 규칙(`margin-left:0` 등)이 클래스 결합으로 `.contact-card`에도 그대로 적용되어 자동으로 잘 대응된다(추가 확인 필요시 실기기/뷰포트에서 재검증할 것).

---

## 3. 페이지 구성

*(2026-07 개정: Figma 목업 기준으로 순서·구성이 바뀌었다. 현재 DOM 순서: Hero → About 스트래들 카드 → Gen-Window Showcase → Interactive Photo → Work Gallery → Contact.)*

1. **Hero** (`#hero`) — 풀블리드 사진 섹션(실제 자산 확보 전까지 그레인 그라데이션 플레이스홀더, §0). 작은 비즈 시그니처 "Julia Jang"과 스크롤 유도 표시만 얹는다. 더 이상 초대형 타이포 히어로가 아니다.
2. **About 스트래들 카드** (`<div id="about" class="about-straddle">`) — 소개 문구(0절)를 `--bg-light` 카드에 담아 Hero ↔ Gen-Window Showcase 경계에 걸치도록 배치한다 (2.5절 참고). 카드 안에 큰 세리프 인용구 스타일 + 모노 라벨(예: `ROLE — DESIGNER`).
3. **Gen-Window Showcase** (`.gen-showcase`) — gen-window 목업 4개(영상 2 + 정지 프레임 2)를 흩뿌려 배치하고, 데스크탑에서는 마우스로 드래그해 움직일 수 있게 한다 (2.4절 참고).
4. **Interactive Photo** (`#interactive`) — 3.1절 참고. 사진 위 핫스팟을 클릭하면 우측 패널 콘텐츠가 전환되는 자체 완결형 인터랙티브 블록.
5. **Work Gallery** (`#work`) — `assets/work/works.json`을 순회하며 카드 렌더링. 모든 카드가 동일 크기인 균일 그리드(데스크탑 4열 / 태블릿 2열 / 모바일 1열), 2.4절 참고.
6. **Contact** (`#contact`) — 2026-07-29에 "LET'S TALK" 헤딩과 EMAIL/INSTAGRAM/BEHANCE placeholder 링크 리스트를 전부 제거하고 한동안 완전히 빈 섹션이었다(높이도 `90svh → 30svh → 60svh → 68svh`로 여러 차례 조정). 이전에 쓰던 `.contact-title`, `.mono-list*`, `.placeholder-link` CSS는 더 이상 어디서도 안 쓰여서 함께 지웠다(옛 스키마: `<h2 class="display contact-title">` + `<ul class="mono-list"><li><span class="mono-list-label">…</span><a class="placeholder-link">…</a></li></ul>`, git 히스토리에 원본이 남아있다).
   **같은 날 다시, 이미지 하나로 채워졌다** — `assets/contact/sweet-girl-id-card.jpg`("THE SWEET GIRL ID CARD" 컨셉의 빈티지 신분증 목업, Email/Instagram/Phone/Linkedin 항목이 그림으로 박혀 있음. 원본 `sweet-girl-id-card-source.png`도 같은 폴더에 아카이브). 이때 **svh 기반 고정 높이를 완전히 없앴다** — `.contact`가 `display:flex; align-items:center; justify-content:center;` + 상하좌우 동일한 `padding`을 가진 컨테이너가 되고, `.contact-image`는 `max-width:46.875rem`(About/Contact 스트래들 카드와 동일한 750px 콘텐츠 폭), `height:auto`로 원본 비율(2528:1696)을 유지한 채 그 안에서 중앙 정렬된다. 섹션 높이는 이제 "이미지 크기 + padding"으로 자연스럽게 결정되며, 상하좌우 여백이 실제로 균등한지(`getBoundingClientRect` 기준 top/bottom/left/right gap 전부 일치) 확인 완료.
   **2026-07-29 실제 연락처 텍스트 오버레이 추가**: 이미지에 그려진 Email/Instagram/Phone 점선(리더 라인) 위에 실제 값을 겹쳐 올렸다 — `jangjulia99@gmail.com`, `@noeyhujjj`, `+82-10-3435-9550` (Linkedin 행은 요청 범위 밖이라 그대로 미기재 상태). 구조를 `<img class="contact-image">` 단독에서 `<div class="contact-frame">`(포지셔닝 기준점) 래퍼로 바꾸고, 그 안에 이미지 + `.contact-info` 3개(email/phone은 `<button type="button" data-copy="...">`, instagram만 실제 `<a href="https://www.instagram.com/noeyhujjj/" target="_blank" rel="noopener noreferrer">`)를 넣었다.
   - **좌표 산출**: `assets/contact/sweet-girl-id-card.jpg`(1600×1073px)를 밝기 임계값(gray<150) 기반으로 스캔해 각 라벨 행의 점선(리더 라인) x/y 픽셀 범위를 연결 성분 분석으로 구했다(Email 점선 x:869–1383/y:522–530, Instagram x:984–1382/y:600–609, Phone x:870–1383/y:676–685 — 이미지 대비 %는 각각 소스 참고). 이 픽셀 좌표를 `px/1600*100`으로 환산해 `cqw` 단위로 CSS에 박았다 — `.contact-frame`에 `container-type:inline-size`를 줘서 `cqw`가 이 프레임의 실제 렌더 폭(최대 750px, 좁은 화면에선 `width:100%`로 축소) 기준으로 스케일되게 했다. 이미지가 비율을 유지한 채 폭에 따라 스케일되므로(`height:auto`), 가로·세로 좌표 모두 같은 `cqw` 변환식으로 정확히 맞아떨어진다(세로 좌표라도 종횡비가 고정이라 폭 기준 %가 그대로 성립).
   - **폰트/색상**: `.contact-info`는 `font-family:var(--font-mono); font-style:italic; font-weight:400; color:#E74B79;` — About 카드 본문(`.about-quote`)과 같은 JetBrains Mono Italic 계열이되 색만 요청한 로즈-레드로 지정. 크기는 이미지 속 라벨 글자 높이(캡하이트 기준 약 35px/1600px폭)에 맞춰 `font-size:2.85cqw`로 실측 대조 후 확정 — 점선의 리더 도트가 글자 사이 여백으로 살짝 비쳐 보이는 정도는 의도된 결과(진짜 폼에 손글씨를 겹쳐 쓴 듯한 질감)이지 버그가 아니다.
   - **정렬 방식**: 각 `.contact-info`를 `position:absolute; display:flex; align-items:flex-end;`로 두고 `top`/`height`를 점선이 속한 라벨 행의 y범위로 잡아, 텍스트 라인박스 하단이 점선(베이스라인)에 맞춰지도록 했다 — `getBoundingClientRect` 없이도 `flex-end` 정렬이 폰트 크기가 박스 높이보다 커도(이 케이스처럼) 항상 박스 바닥 기준으로 붙게 해준다.
   - **클릭 동작**: email/phone 클릭 시 `js/main.js`가 `navigator.clipboard.writeText(btn.dataset.copy)`로 복사하고, `is-copied` 클래스를 붙였다 1.4초 뒤 자동으로 뗀다. `.contact-info.is-copied`가 밑줄을, `.contact-info-toast`(자식 `<span>`, 텍스트 "copied!")의 `opacity`를 0→1로 전환해 잠깐 떴다 사라지는 배지를 만든다(연속 클릭 시 `classList.remove` → `void btn.offsetWidth` → `classList.add`로 애니메이션을 강제 재시작). instagram만 `data-copy`가 없는 진짜 `<a>`라 이 리스너 대상에서 자동으로 빠지고, 기본 브라우저 동작(새 탭 열기)을 그대로 탄다.
   - **호버**: 세 요소 모두 `.contact-info { cursor:pointer; }` + `:hover, :focus-visible { text-decoration:underline; }`.
   - **자동화 테스트 환경 한계**: email/phone의 클립보드 복사(`navigator.clipboard.readText()`로 실제 값 확인됨)와 `href`/`target`/`rel`/`cursor` 속성은 라이브로 전부 검증했다. 다만 instagram 링크의 "새 탭으로 실제 열림" 자체는 이 브라우저 자동화 도구 안에서는 확인하지 못했다 — 실제 클릭(좌표 클릭·ref 클릭 둘 다), 심지어 페이지 컨텍스트에서 `window.open(...)` 직접 호출까지 전부 결과가 `null`/새 탭 없음으로 나왔다(반면 같은 도구로 `navigate`를 이용해 그 URL을 직접 열면 정상 로드됨 — 사이트나 코드 문제가 아니라 이 자동화 환경이 외부 도메인으로의 자동 새 탭 열기 자체를 막고 있는 것으로 보인다). `href="https://www.instagram.com/noeyhujjj/"`, `target="_blank"`, `rel="noopener noreferrer"` 값 자체는 정확하므로 실제 사용자 브라우저에서는 정상 동작할 것으로 예상되지만, 실사용 환경에서 한 번 더 클릭해 확인해볼 것.

헤더 내비게이션 순서(`WORK / INTERACTIVE / ABOUT / CONTACT`)는 DOM 순서와 다르다 — 의도된 것이며 맞출 필요 없다.

### 3.1 Interactive Photo 섹션 (`#interactive`)

About 카드·Gen-Window Showcase 다음에 스크롤로 자연스럽게 이어지는 섹션이다 (별도 페이지가 아니라 메인 원페이지 안의 한 섹션). "NIGHT ARCHIVE" 톤의 자체 완결형 인터랙티브 사진 블록으로, 사진 위 핫스팟(핸드폰/잡지/칵테일/가방)을 클릭하면 우측 패널에 해당 콘텐츠가 전환되어 나타난다. 헤더 내비게이션의 `INTERACTIVE` 링크는 `href="#interactive"` 앵커로, 클릭하면 이 섹션까지 부드럽게 스크롤 이동한다 (`html { scroll-behavior: smooth }`가 이미 전역 적용되어 있어 별도 스크립트 불필요).

**2026-07-28 Figma 동기화 메모**: 사용자가 지정한 Figma 노드(`uv7GQrRLL8Rhh1fMGEWtK9`, node `11:96`, "Section")를 `get_design_context`/`get_metadata`로 직접 읽었다. 색상 변수는 `get_variable_defs` 호출이 Figma MCP의 Starter 플랜 호출 한도(rate limit)에 걸려 받아오지 못했다 — 값을 추측하지 않고 기존 `--espresso` 계열 팔레트를 그대로 유지했다. 이 노드는 예상과 달리 핫스팟/패널 레이어 없이 **1264×848px 이미지 한 장**(1920px 프레임 안에 좌우 328px씩 여백을 두고 중앙 정렬)만 담고 있었는데, 실제로 열어보니 그 이미지 자체가 "왼쪽 = 사진 페이지, 오른쪽 = 검정 페이지, 가운데 = 스프링 바인딩"으로 합성된 노트북 스프레드 목업이었다. 사용자에게 반영 방식을 확인한 결과("노트북 목업 전체를 배경으로 사용") 다음과 같이 구조를 바꿨다:
  - `.ip-photo-col`/`.ip-photo-wrap`로 나뉘어 있던 마크업을 `.ip-stage-wrap > .ip-stage > (.ip-photo-crop + .ip-panel-col)`로 평탄화했다. `.ip-stage`는 `aspect-ratio:1264/848`인 하나의 박스이고, 그 안에서 사진(`.ip-photo-crop`)이 전체를 채우고 `.ip-panel-col`은 `position:absolute`로 오른쪽 검정 페이지 영역(약 53~96%) 위에 떠 있다.
  - 핫스팟 4개(`#ip-spot-phone/magazine/cocktail/bag`)는 새 이미지 기준으로 좌표를 다시 잡았다(그리드 오버레이로 픽셀 위치 직접 확인). 좌표는 `css/style.css`의 `.ip-photo-crop` 관련 규칙 옆에 주석과 함께 있다.
  - **기존 핫스팟 버튼 안에 있던 오브젝트별 컷아웃 PNG(구 사진 기준으로 손으로 잘라낸 phone/magazine/cocktail/bag 모양 이미지)는 새 사진과 각도·스케일이 달라 제거했다가, 사용자 요청으로 새 사진에서 다시 실제 누끼를 따서 복원했다.** 방법: `rembg`(u2net 모델, `pip install rembg onnxruntime`로 이 세션에서 새로 설치)로 phone/magazine 크롭을 배경 제거 → 결과가 깔끔했음. cocktail/bag/phone은 1차 시도에서 각각 유리잔 스템, 가방 손잡이, 손끝 일부가 잘려나가 사용자가 "두루뭉실해도 되니 외곽선보다 0.5cm 정도 여유 있게 다시 따달라"고 두 차례 요청 → 최종적으로 다음 방식에 도달:
    - **phone**: 크롭 박스를 넉넉하게 키워 rembg 재추출 후, 가장 큰 연결 성분만 남기고(잔 스펙 제거) 알파를 5px 팽창(`scipy.ndimage.binary_dilation`)해 여유를 줬다. **주의(발견한 버그)**: 처음엔 rembg 결과 이미지 자체의 RGB 채널 위에 팽창된 알파를 얹었는데, rembg가 배경 픽셀의 RGB를 검게(0,0,0) 지워버려서 팽창된 여유 영역에 검은 사각형이 그대로 보이는 버그가 생겼다 — 팽창/합성은 항상 **원본 사진 크롭의 RGB**(배경 제거 전) 위에 새 알파 마스크를 얹어야 한다. bag/cocktail은 애초에 원본 크롭 RGB를 썼어서 이 버그가 없었다.
    - **cocktail**: 스템·받침이 어두운 원형 테이블과 명암 대비가 낮아 rembg가 계속 놓쳐서, `PIL.ImageDraw`로 볼/스템/받침을 감싸는 넉넉한 타원+사다리꼴 마스크를 원본 크롭 RGB 위에 손으로 그려 합성.
    - **bag**: 손잡이 루프가 레오파드 무늬와 색·질감이 비슷해 rembg·색상 임계값·flood-fill·로컬표준편차(질감) 기반 분리를 모두 시도했지만 실패 → **최종 성공한 방법**: 몸통은 로컬 표준편차(매끈함 vs 무늬)로 깨끗하게 분리하고, 손잡이는 손잡이 영역 안에서 "이미 확인된 손잡이 색(연분홍, RGB≈211,180,174)과 가까운 픽셀"만 남기는 색상-거리 매칭(허용치 60)을 좁은 탐색 범위(손으로 그린 대략적 폴리곤을 팽창시킨 corridor) 안에서 수행 — 무늬(레오파드)와 손잡이(단색)가 색은 비슷해도 국소적으로는 손잡이 쪽이 더 균일해서 이 방법이 먹혔다. 작은 잔여 파편은 연결 성분 크기로 걸러냈다(150px 미만 제거). 이제 손잡이 고리가 뚫린 형태로 살아있다.
    컷아웃 모두 알파 채널 바운딩 박스를 기준으로 1264×848 스테이지 대비 %를 다시 계산해 `#ip-spot-*` 좌표(데스크탑/모바일 양쪽)에 반영했고, `.ip-spot`은 원래 방식대로 되돌렸다(`hover`/`focus`/`active` 시 `transform:scale()` + `drop-shadow`, 테두리·점 마커는 제거). 오브젝트가 또 바뀌면 같은 방식을 반복하면 된다 — 특히 **팽창/합성은 항상 원본 사진 크롭 위에서** 할 것(위 버그 재발 방지).
  - **모바일(`@media max-width:767px`)은 스프레드 전체를 보여주지 않는다** — 검정 페이지 절반이 화면을 잡아먹으므로, `.ip-photo-crop`을 `aspect-ratio:607/848`(전체 이미지의 왼쪽 48%, 즉 사진 부분만) 박스로 만들고 이미지를 208.3% 폭으로 확대 + `object-position:left top`으로 크롭해서 사진만 꽉 채운다. 핫스팟 좌표도 이 크롭 기준으로 재계산해서 미디어쿼리 안에 따로 정의했다. `.ip-panel-col`은 이때 `position:static`으로 돌아가 사진 아래에 일반 블록으로 쌓인다(기존 모바일 동작과 동일한 스택 구조).
  - 새 배경 이미지는 Figma에서 다운로드한 원본(PNG, 1264×848)을 JPEG로 재압축(quality 87, 약 170KB)해 기존 방식대로 base64 인라인 임베드했다.
  - 이 환경의 브라우저 자동화 도구(`resize_window`)가 실제 뷰포트를 바꾸지 못해(재시도 후 `window.innerWidth` 확인으로 확인됨) 모바일 레이아웃은 스크린샷으로 직접 검증하지 못했다 — 데스크탑(핫스팟 클릭 → 패널 전환 4종 모두)은 라이브로 확인 완료.

- **섹션 높이는 항상 `100vh`** (`#interactive { height:100vh; overflow-y:auto; }`) — 콘텐츠가 넘치면 섹션 내부에서만 스크롤되고 페이지 전체 흐름은 유지된다.
- **자체 팔레트/폰트를 그대로 유지**한다 — 메인 사이트의 색상 토큰(2.1절)·폰트(2.2절)를 공유하지 않고, `#interactive` 셀렉터 스코프 안에 정의된 자체 CSS 커스텀 프로퍼티(`--espresso`, `--cream`, `--red`, `--mint`, `--pink`, `--cosmo`, `--serif`(Instrument Serif), `--grot`(Space Grotesk))를 쓴다. 메인 사이트 디자인을 바꿔도 이 섹션까지 맞출 필요는 없다.
  - **예외(2026-07-28)**: `#interactive`의 `background`만 사용자 요청으로 `var(--espresso)`(어두운 브라운) 대신 `#FFFFFF`로 고정했다. `color: var(--cream)` 등 텍스트 색은 그대로 둬서, 실제로는 스프레드 이미지(사진+검정 페이지)의 여백 바깥쪽에서만 흰 배경이 드러난다 — 패널 텍스트는 여전히 이미지의 검정 페이지 위에 얹혀 있어서 가독성 문제는 없다. 사진 자체를 다시 다른 크기/비율로 바꾸는 등 흰 여백이 넓어지는 변경을 하게 되면, 그 여백 위에 텍스트가 올라갈 여지가 생기므로 그때는 `color` 값도 재검토할 것.
  - **2026-07-29 이미지 크기 축소 + 상단 정렬**: 사용자 요청으로 스프레드 이미지(`.ip-stage`)를 `width:min(94vw,134vh)` → `min(75vw,108vh)`로 줄이고, `.ip-stage-wrap`을 `align-items:center` → `flex-start` + `padding:7vh 2vw 4vh`로 바꿔 위쪽에 붙이고 줄어든 만큼의 여유가 아래쪽에 남게 했다(비율 1264/848은 그대로 유지, 흰 배경·패널·핫스팟 등 다른 요소 불변).
    - **버그 발견 및 수정**: 처음에 `.ip-stage-wrap`, `.ip-stage`에 이 padding/margin을 줬을 때 `getComputedStyle`로 확인해보니 값이 전혀 적용되지 않고 있었다(`padding:0`, `margin:0`) — 원인은 위에서 이미 정의된 `#interactive * { margin:0; padding:0; box-sizing:border-box; }` 리셋 규칙이 ID 특정도(specificity)를 갖고 있어서, 클래스 셀렉터 단독(`.ip-stage-wrap`, `.ip-stage`)으로는 소스 순서와 무관하게 항상 진다는 점이었다. `#interactive .ip-stage-wrap`, `#interactive .ip-stage`처럼 ID를 셀렉터에 포함시켜 특정도를 올려서 해결했다. **주의**: `#interactive` 안에서 새로 margin/padding을 주는 규칙을 추가할 때는 항상 이 리셋 규칙보다 특정도가 높아야 한다는 걸 기억할 것 — 다른 `.ip-*` 규칙 중에도 이 문제를 조용히 겪고 있는 게 더 있을 수 있으니, 간격이 이상하게 안 먹는 게 보이면 이 리셋 규칙부터 의심할 것.
- **네임스페이스 규칙**: 이 섹션 안의 모든 클래스/아이디/키프레임은 `ip-` 접두사를 쓴다(`.ip-stage`, `.ip-spot`, `.ip-media`, `#ip-idx`, `@keyframes ip-fadeUp` 등). 메인 사이트가 이미 `.media` 같은 흔한 클래스명을 쓰고 있어 접두사 없이 병합하면 충돌하므로, 이 섹션에 새 마크업/스타일을 추가할 때도 반드시 `ip-` 접두사를 유지할 것.
- CSS는 `css/style.css`의 "Interactive Photo" 블록(Hero 섹션 바로 다음)에 있고, 좁은 화면 대응은 `@media (max-width: 767px)` 블록 안에 다른 섹션들과 함께 모여 있다. JS(핫스팟 클릭 → 패널 전환)는 `js/main.js`의 "Interactive photo section" 블록에 있다.
- 배경 스프레드 이미지는 base64로 인라인 임베드되어 있고(그만큼 `index.html` 자체 용량이 크다), 원본 소스 파일은 `assets/interactive/`에 아카이브해뒀다(`ip-stage-source.png` = 사용자 제공 원본, `ip-stage.jpg` = 실제 임베드에 쓴 1264×848 압축본 — 이 파일 자체가 `src`로 참조되진 않고, base64를 재생성할 때 참고용).
- **2026-07-29 대대적 축소 — 패널 콘텐츠 전부 비움**: 사용자 요청으로 인트로 화면(`Touch the scene.` 헤딩·설명문·PHONE/MAGAZINE/COCKTAIL/BAG 힌트 pill)과 4개 오브젝트 패널(각 헤딩·서브라벨·그래픽)을 전부 제거했다 — **이전에 "폰(phone) 오브젝트는 예외다, 임시 그래픽이 아니라 완성된 최종 디자인이다"라고 적어뒀던 Instagram 프로필 카드(`.ip-ig-card`, `@noeyhujjj` 링크 포함)도 이번 요청으로 함께 제거됐다** — 그 문서화된 "완성" 상태는 이제 무효이니 혼동하지 말 것. 각 `.ip-page`(intro/bag/magazine/cocktail/phone)는 이제 빈 div이고, 클릭 시 핫스팟 `active` 토글·페이지 `.on` 전환·인덱스 숫자(`#ip-idx`) 갱신 같은 상호작용 로직 자체는 그대로 살아있다(`js/main.js`에서 가방 진주 점 생성 코드만 죽은 코드라 함께 제거했고, 나머지 클릭 핸들러는 무변경) — 즉 클릭하면 여전히 반응은 하지만 오른쪽 패널에 시각적으로 뜨는 콘텐츠가 없다. 이때 배경 스프레드 이미지도 새 파일로 교체됐는데(§0 위 참고), 이 새 이미지의 오른쪽(검정) 페이지 안에 "NIGHT ARCHIVE / Touch The Items / INTERACTIVE STILL" 문구가 레이스 프레임과 함께 이미 그림으로 박혀 있어서, 패널이 비어도 화면이 완전히 텅 비어 보이지는 않는다 — **후속 요청으로 `.ip-panel-head`의 "NIGHT ARCHIVE — INTERACTIVE STILL" eyebrow(`.ip-eyebrow` span)도 제거했다** — 이미지에 박힌 같은 문구와 중복돼 보인다는 이유. `.ip-panel-head`엔 이제 인덱스 숫자(`#ip-idx`)만 남아있고, `justify-content:space-between` → `flex-end`로 바꿔서 원래처럼 오른쪽 끝에 붙게 했다(예전엔 eyebrow가 왼쪽, idx가 오른쪽으로 space-between이 벌려놨었음). `.ip-eyebrow` CSS 규칙도 함께 지웠다.
  다시 콘텐츠를 채우게 되면: 각 `.ip-page` div 안에 원하는 마크업을 넣고, 지워진 스타일(`.ip-page h2`, `.ip-media` 등)을 필요한 만큼 새로 작성하면 된다.
  - **2026-07-29 phone 전용 예외 — 인스타그램 배지 추가**: 위에서 "패널 콘텐츠 전부 비움"이라고 했지만, phone(`#ip-page-phone`)만 다시 예외가 됐다. 요청 내용: 배경 이미지에 박힌 "Touch The Items" 글씨를 정확히 덮는 크기의 흰 사각형을 띄우고, 그 위에 인스타그램 로고+`@noeyhujjj`를 얹고, 클릭하면 `https://www.instagram.com/noeyhujjj/`가 새 탭으로 열리게 했다.
    - **좌표 산출**: 배경 이미지(1264×848, `assets/interactive/ip-stage.jpg`)에서 "Touch The Items" 텍스트만의 픽셀 바운딩 박스를 밝기 임계값(gray>170) + 연결 성분 분석으로 계산했다 — 레이스 프레임 테두리(크롭 가장자리에 닿는 성분)와 "INTERACTIVE STILL" 라벨(별도의 작은 개별 글자 성분들, y=627~646 구간)을 각각 제외 필터로 걸러내고 남은 성분만으로 바운딩 박스를 구했다: `(869,303)-(1023,541)` → 1264×848 기준 `left:68.43% top:35.26% width:12.82% height:29.01%`. 실제 DOM에서 `getBoundingClientRect`로 재검증(기대 좌표와 3~4px 이내로 일치) 완료.
    - **DOM 구조**: `#ip-page-phone`을 `.ip-panel-col`(패널 좌표계, 53~96%) 안에서 빼내 `.ip-stage`의 직속 자식으로(`.ip-photo-crop`과 `.ip-panel-col` 사이에) 옮겼다 — 핫스팟(`.ip-spot`)과 동일하게 스테이지 전체(0~100%) 좌표계를 써야 정확히 맞기 때문. `class="ip-page"`는 유지해서 `js/main.js`의 기존 클릭→`.on` 토글 로직(변경 없음)에 그대로 올라탄다 — `document.querySelectorAll('.ip-page')`가 이 요소도 포함해서 찾아낸다.
    - **모바일(`@media max-width:767px`)**: 모바일은 검정 페이지(레이스+텍스트) 자체를 안 보여주므로 그 위치에 배지를 절대좌표로 띄우는 게 의미가 없다 — `position:static`으로 바꿔서 일반 문서 흐름으로 되돌리고(사진 아래, 기존 모바일 스택 구조의 세 번째 요소로 추가됨), 가로 배치(아이콘+핸들 나란히)로 재구성했다.
    - **2026-07-29 버그 수정 — 중앙 정렬 깨짐**: `.ip-ig-badge`는 `display:flex`로 아이콘+핸들을 중앙 정렬하게 만들어뒀는데, `.on` 상태가 되면 조용히 깨져서 내용물이 박스 위쪽에 붙어버렸다. 원인은 `#ip-page-phone`도 `class="ip-page"`를 갖고 있어서 `.page.on{display:block}` 규칙(클래스 2개, 특정도 (0,0,2,0))이 `.ip-ig-badge`의 `display:flex`(클래스 1개, 특정도 (0,0,1,0))를 이겨버리는, 바로 위(§0)에서 이미 한 번 겪은 것과 같은 유형의 특정도 함정이었다. `#ip-page-phone.on { display:flex; }`(ID 셀렉터로 특정도 확보)를 추가해서 고쳤다. **`#interactive` 안에서 `.on`/`.active` 같은 상태 클래스에 새 스타일을 얹을 때는 항상 그 요소의 ID나 더 구체적인 셀렉터를 써서 기존 상태 클래스 규칙을 이길 수 있는지 확인할 것** — 이걸로 이 섹션에서 벌써 두 번째로 발견된 패턴이다.
    - **폰트**: 핸들 텍스트(`.ip-ig-badge-handle`)를 `var(--grot)`(Space Grotesk)에서 메인 사이트 About 카드(`.about-quote`)와 동일한 `var(--font-mono)` + `font-style:italic; font-weight:400;`로 바꿨다. `#interactive`가 자체 폰트 변수(`--serif`,`--grot`)를 갖고 있지만 전역 변수(`--font-mono` 등)를 가리는 게 아니라서 그대로 상속돼 쓸 수 있었다.

---

## 4. 자산 구조 (교체 가능하게 설계됨)

```
영감/
├── CLAUDE.md
├── index.html                   ← 메인 원페이지 (Hero → About 카드 → Gen-Window Showcase → Interactive Photo → Work → Contact)
├── assets/
│   └── work/
│       ├── works.json          ← 작업물 목록/메타데이터 (이 파일만 편집하면 갤러리 갱신)
│       ├── images/
│       │   ├── work-01.jpg ... work-08.jpg   ← 플레이스홀더, 실제 작업물로 교체
│       └── videos/
│           ├── video-01.mp4, video-02.mp4    ← 플레이스홀더, 실제 작업물로 교체
```

**교체 방법**: 실제 작업물이 생기면 같은 파일명 규칙(`work-09.jpg`, `video-03.mp4` 등)으로 파일을 추가하고 `works.json`에 항목을 추가/수정하기만 하면 된다. 코드(HTML/CSS/JS)는 `works.json`을 읽어 렌더링하므로 마크업을 직접 고칠 필요가 없어야 한다 — 이 원칙을 지켜서 구현할 것.

**참고 — 위 트리 다이어그램은 초기 버전이라 이후 추가된 `css/`, `js/`, `assets/documents/`, `assets/contact/`, `assets/gen-showcase/`, `assets/interactive/` 등을 반영하지 않는다** (실제 구조는 index.html 상단 `<link>`/`<script>` 태그와 각 섹션의 프로즈 노트를 참고). 2026-07-29 기준 `assets/documents/`에는 `portfolio.pdf`(work-01), `portfolio-15.pdf`(work-07), `portfolio-1620.pdf`(work-04), `portfolio-2021.pdf`(work-06), `portfolio2.pdf` + `portfolio2-video.mp4` + `portfolio2-pages/page-1.jpg,page-2.jpg`(work-02), `portfolio3.pdf` + `portfolio3-video.mp4` + `portfolio3-pages/page-1.jpg`(work-05), `portfolio4.pdf` + `portfolio4-video.mp4` + `portfolio4-pages/page-1~4.jpg`(work-03), `portfolio5.pdf` + `portfolio5-video.mp4` + `portfolio5-pages/page-1~2.jpg`(work-08), `work-09-portfolio.png`(work-09, 세로로 아주 긴 단독 이미지) — 앞 네 개(work-02/03/05/08)는 2.4절 "전용 포트폴리오 페이지"(영상+PDF 스택) 패턴, `work-09`는 이미지 단독 페이지로 성격이 다르다. 루트에 `work-02.html`, `work-05.html`, `work-03.html`, `work-08.html`, `work-09.html`(각각의 전용 페이지)과 `css/portfolio-page.css`(앞의 넷이 공유하는 전용 스타일, `work-03.html`/`work-08.html`만 `body.pf-page-dark`로 배경을 어둡게 오버라이드)가 추가돼 있다 — `work-09.html`만 `portfolio-page.css`를 쓰지 않고 자체 인라인 `<style>`을 쓴다. **`work-10`의 전용 페이지는 예외적으로 `work-10.html`이 아니라 `portfolio-10.html`**(사용자가 파일명을 직접 지정) — 라이브 외부 사이트(`https://law-seonjin.co.kr/`)를 iframe으로 임베드하는 페이지이며, 이것도 자체 인라인 `<style>`을 쓴다(단, 메인 사이트와 폰트/색상 톤은 의도적으로 맞춤). 이 파일 목록을 볼 때 `work-XX.html` 명명 관례가 `work-10`에는 적용되지 않는다는 점에 유의할 것.

`works.json` 스키마:

```json
{
  "id": "work-01",
  "title": "string",
  "type": "image | video",
  "category": "string (예: AI IMAGE, AI MOTION)",
  "src": "/assets/work/... 경로",
  "poster": "video일 때 썸네일 이미지 경로 (선택)",
  "alt": "대체 텍스트",
  "featured": true | false,
  "link": "외부 링크 URL (선택 — 있으면 카드 이미지/영상 클릭 시 새 탭으로 이동, 2026-07-29 추가)"
}
```

---

## 5. 반응형 조건

- **데스크탑 (≥1024px)**: 비대칭/멀티컬럼 그리드, 히어로 타이포 최대 크기, 커스텀 커서/호버 인터랙션 허용.
- **태블릿 (768–1023px)**: 그리드 2열로 축소, 여백 비례 축소.
- **모바일 (<768px)**: 전 섹션 1열 스택, 히어로 타이포는 `clamp()`로 화면 폭에 맞게 축소, 영상은 탭-재생 또는 저용량 poster 우선 로드, 네비게이션은 햄버거/하단 고정 방식.
- 모든 타이포/여백 값은 고정 px보다 `clamp()`, `vw`, `rem` 기반으로 정의해 브레이크포인트 사이에서도 자연스럽게 스케일되도록 한다.
- 터치 타깃 최소 44×44px, 영상 자동재생은 모바일 데이터 사용량을 고려해 재생 트리거를 다르게 둔다.

---

## 6. 완성 후 셀프 검수 루프 (3바퀴 필수)

사이트를 구현한 뒤, **아래 3바퀴를 순서대로 직접 돌리고 각 바퀴에서 발견한 문제를 고친 다음에만 완료로 간주한다.** 각 바퀴가 끝나면 무엇을 확인했고 무엇을 고쳤는지 간단히 기록한다.

### 1바퀴 — 디자인 충실도 점검
- 타이포 대비(대형 세리프 vs 모노)가 실제로 화면에서 확실히 느껴지는가?
- 섹션 전환마다 배경색/밀도 리듬이 의도대로 바뀌는가 (2.3절)?
- 컬러가 `--accent`를 과하게 쓰지 않고 절제되어 있는가?
- 이미지/영상 그레인 오버레이와 gen-window 라벨링이 2.4절 규칙대로 적용됐는가?

### 2바퀴 — 반응형·기능 점검
- 데스크탑/태블릿/모바일 3개 뷰포트에서 실제로 레이아웃을 확인했는가 (스크린샷 비교 권장)?
- 히어로 타이포가 작은 화면에서 잘리거나 넘치지 않는가?
- 영상 자동재생/루프/음소거가 정상 동작하는가? 모바일에서 재생 트리거가 합리적인가?
- `works.json`에 항목을 하나 추가/삭제해보고 마크업 수정 없이 갤러리가 갱신되는지 실제로 테스트했는가?
- 네비게이션, 스크롤, 링크(연락처 등)에 깨진 부분이 없는가?

### 3바퀴 — 콘텐츠·접근성·성능 점검
- 플레이스홀더로 남겨둔 값(`[EMAIL PLACEHOLDER]`, work 제목 등)이 실제 값이 들어오면 어디를 고쳐야 하는지 명확한가?
- 모든 이미지/영상에 `alt` 텍스트가 있는가?
- 색 대비(WCAG AA 기준)가 라이트/다크/액센트 배경 각각에서 충분한가?
- 이미지/영상 용량이 과하지 않은가 (플레이스홀더 영상은 특히 용량이 큰 편이므로, 실제 작업물로 교체 시 압축 가이드를 README나 주석으로 남길 것)?
- 페이지 타이틀, 메타 디스크립션 등 기본 SEO 태그가 채워져 있는가?

3바퀴를 모두 통과하기 전까지는 "완성"으로 보고하지 않는다.

---

## 7. 기술 스택 관련 메모

프레임워크는 자유롭게 선택 가능하나, 자산 교체 용이성(4절)과 반응형 요구사항(5절)을 만족해야 한다. 특별한 이유가 없다면 정적 HTML/CSS/바닐라 JS(또는 Vite 기반 경량 빌드) 로 시작해 배포 마찰을 최소화하는 것을 권장한다.
