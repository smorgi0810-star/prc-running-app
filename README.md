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
