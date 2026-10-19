This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 설명
  Three critical fitting metrics are assessed using a biomechanics engine: knee extension angle, KOPS (Knee Over Peda..
  요청하신 기능과 기술 스택을 완벽하게 반영한 **AI 비전 기반 로드 자전거 정밀 자가 피팅 웹 서비스 (RoadFit AI)**를
  완성하여 실행 배포하였습니다.
  ──────
  ### 🌐 로컬 접속 주소
  현재 개발 서버가 가동 중이며, 브라우저에서 아래 주소로 즉시 접속하여 사용하실 수 있습니다:
  👉 http://localhost:3000
  ──────
  ### 🚀 핵심 구현 기능 및 기술 상세
  #### 1. 브라우저 클라이언트 사이드 AI 비전 엔진 (MediaPipe Pose)
  • 보안 및 서버 비용 제로: 고화질 라이딩 영상이나 웹캠 스트림을 서버로 업로드하지 않고, 사용자의
  **브라우저(WebAssembly / WebGL GPU)**에서 100% 실시간으로 처리됩니다.
  • 33개 관절 랜드마크 추적: 고관절(Hip), 무릎(Knee), 발목(Ankle), 발볼/페달(Foot Index), 어깨(Shoulder),
  팔꿈치(Elbow), 손목(Wrist)을 밀리초(ms) 단위로 추적합니다.
  • 마우스 관절 파인튜너 (Fine-Tuning): 자전거 의류나 카메라 각도로 인해 미세하게 어긋났을 경우, 사용자가 캔버스 위의
  관절 포인트를 마우스로 드래그하여 1픽셀 단위로 정밀하게 미세 조정할 수 있습니다.
  
  #### 2. 바이오메카닉스 3대 핵심 지표 정밀 측정

   분석 항목                  | 측정 기준                  | 이상적인 권장 범위         | AI 진단 및 mm 처방 알고리즘
  ----------------------------|----------------------------|----------------------------|-----------------------------
   무릎 신전 각도(Knee        | 페달 하사점(BDC: 6시       | 140° ~ 150°(스위트스팟     | • < 140°: 안장 낮음 (슬개건
   Extension)                 | 방향)에서 대퇴골-무릎-발목 | 145°)                      | 과부하/앞무릎 통증) ➔ "안장
                              | 각도                       |                            | +X mm 상향"• > 150°: 안장
                              |                            |                            | 높음 (골반 요동/햄스트링
                              |                            |                            | 과신장) ➔ "안장 -X mm 하향"
   KOPS(Knee Over Pedal       | 크랭크 3시 전방 수평 시    | -10mm ~ +10mm(0mm 일치     | • 전방 쏠림: 슬개골 연골
   Spindle)                   | 무릎 앞쪽 수직선과 페달 축 | 권장)                      | 압박 증가 ➔ "안장 레일 뒤로
                              | 위치                       |                            | X mm 후퇴(Setback)"• 후방
                              |                            |                            | 쏠림: 둔근 효율 저하 ➔
                              |                            |                            | "안장 레일 앞으로 X mm
                              |                            |                            | 전진"
   상체 및 콕핏 리치(Cockpit  | 팔꿈치 굽힘 각도 및 허리   | 팔꿈치: 150° ~ 165°상체:   | • 팔 펴짐 (> 165°): 손목
   & Torso)                   | 전경각(Torso Angle)        | 35° ~ 48°                  | 저림 및 승모근 긴장 ➔ "스템
                              |                            |                            | -10~20mm 단축 또는 스페이서
                              |                            |                            | 추가"•
                              |                            |                            | 스타일별(올라운드/엔듀런스/
                              |                            |                            | 에어로) 맞춤 진단
  #### 3. 기준점 스케일링 (Reference Calibration, 픽셀 ➔ mm 정밀 변환)

  • 화면 위에 인터랙티브 **캘리브레이션 룰러(Pin A, Pin B)**를 제공합니다.
  • 원클릭 프리셋 지원:
      • 700C 휠 외경 (25C 타이어 장착 시 670mm)
      • 크랭크 암 길이 (170mm / 172.5mm)
      • 자전거 휠베이스 (지오메트리 DB 연동)
      • 사용자 직접 줄자 실측 mm 입력
  • 화면의 픽셀 거리(dₚₓ)를 측정하여 1 px = X.XX mm 비율을 자동 산출, "안장 높이를 +8mm 올리세요"와 같은 정량적 수치를
  정확하게 제시합니다.

  #### 4. 로드바이크 지오메트리 DB (Geometry Explorer)

  • 주요 브랜드 및 인기 모델 제원 탑재:
      • Specialized: S-Works Tarmac SL8, Roubaix SL8
      • Trek: Madone SLR Gen 8, Émonda SLR
      • Giant: TCR Advanced SL, Propel Advanced
      • Canyon: Aeroad CFR, Ultimate CF SLX
      • Pinarello: Dogma F
      • Cervélo: S5 Disc
  • 사이즈별(4958, XSXL) Stack, Reach, Stack/Reach Ratio, Top Tube, Wheelbase, 크랭크 길이 수록.
  • "내 바이크로 적용" 클릭 시 휠베이스 스케일러 및 진단 리포트에 즉시 연동됩니다.
  #### 5. 다양한 입력 모드 & 인터랙티브 기능

  • 샘플 데모 모드: 실제 자전거 영상이 없어도 버튼 하나로 즉시 [최적의 BDC 145°], [안장 낮음 133°], [안장 높음 154°],
  [KOPS 전방 쏠림], [리치 과다] 등 다양한 자세를 테스트하고 검증할 수 있습니다.
  • 실시간 웹캠 / 비디오 업로드 / 사진 업로드 지원.
  • 피팅 샌드박스 (Simulator Lab): 싯포스트 높이(-35~+35mm), 안장 전후(-25~+25mm), 스템 길이(80~130mm) 슬라이더를
  움직이면 관절 스켈레톤이 실시간 물리 기하학으로 연동되어 반응합니다.
  • 피팅 처방전 (Prescription Report): 부품별 조절 권장값, 지표 테이블, 통증 예방 가이드가 포함되어 있으며 Ctrl + P
  또는 "리포트 인쇄" 버튼으로 깔끔한 A4 PDF로 출력할 수 있습니다.
  ──────
  ### 📂 프로젝트 주요 파일 구성

  • page.tsx: 통합 메인 대시보드 및 탭 컨트롤러
  • FittingCanvas.tsx: 캔버스 오버레이, 관절 드래그 튜너, 비디오/웹캠 뷰어
  • FittingDiagnostics.tsx: 무릎 각도, KOPS 오차, 콕핏 리치 시각적 게이지 및 피팅 점수 카드
  • PrescriptionReport.tsx: mm 단위 피팅 처방전 및 부상 예방 가이드
  • ScaleCalibrator.tsx: 700c 휠/크랭크 기준점 스케일링 모듈
  • BikeGeometryDatabase.tsx: 로드 자전거 브랜드별 지오메트리 DB 브라우저
  • InteractiveSimulator.tsx: 가상 부품 조절 샌드박스
  • fittingCalc.ts: 바이오메카닉스 각도 및 mm 변환 계산 엔진
  • canvasOverlay.ts: 스켈레톤, 각도 아크, KOPS 수직선, 룰러 렌더러
  • bikes.ts: 트렉, 스페셜라이즈드 등 제조사 공식 지오메트리 데이터

  "# go_bike_fitting" 
