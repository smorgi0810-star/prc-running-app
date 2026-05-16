# PRC Running App

React + Vite + TypeScript 기반 PRC(Package Running Crew) 1주년 러닝 크루 앱입니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 접속:

```txt
http://localhost:5173
```

## 빌드

```bash
npm run build
```

## 주요 파일

```txt
src/App.tsx       현재 완성된 PRC 앱 전체 코드
src/main.tsx      React 진입점
src/index.css     Tailwind CSS 설정
public/logo.png   PRC 로고
```

## 샘플 계정

```txt
관리자: admin / 1234
사용자: runner01 / 1234
```

## 참고

현재 앱은 localStorage 기반입니다.
실제 멤버 공유 서비스로 확장하려면 Supabase Auth, Database, Storage 전환을 추천합니다.


## 이번 수정 반영 사항

- 비로그인 상태에서는 Login 화면만 접근 가능하도록 보호
- 모바일 하단 메뉴에서 관리자(Admin) 메뉴 표시
- 메뉴/로고 클릭 시 해당 화면 최상단으로 이동
- Feed 이미지 업로드 시 압축 저장으로 localStorage 오류 완화
- Feed 동영상 첨부 추가: 80MB 이하 선택 가능
  - 현재 localStorage 버전에서는 동영상은 현재 세션 중심으로 동작하며, 안정적인 영구 저장은 Supabase Storage 전환 필요
- 전체 사진첩 이미지 클릭 시 전체화면 미리보기
- 프로필 상의/하의/신발 사이즈 입력란 추가
