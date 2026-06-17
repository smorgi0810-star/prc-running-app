# Build Fix

Feed 카드의 이미지/동영상 렌더링 JSX가 중복 중첩되어 발생한 TS1005 오류를 수정했습니다.

수정 전 문제:
- video / image 조건부 렌더링 안에 다시 중괄호 조건식이 들어가 JSX 문법 오류 발생

수정 후:
- video면 `<video>`
- image면 `<img>`
로 단순 조건부 렌더링 처리
