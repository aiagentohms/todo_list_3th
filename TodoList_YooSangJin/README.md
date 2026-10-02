# DAILY LIST 

특강에서 배운 HTML / CSS / JavaScript 범위 안에서 만든 Todo List입니다.

## 핵심 목표

- 초보자가 읽기 쉬운 구조 유지
- 등록 / 수정 / 삭제 / 완료 / 필터 / localStorage 기능 유지
- Flexbox와 미디어 쿼리 유지
- 날짜는 오늘 날짜로 자동 입력되고, 사용자가 바꾸기 전까지 유지

## 파일 구조

```text
todo_therow_beginner_simple_v3/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  └─ todo.js
└─ README.md
```

## JavaScript 흐름

```text
입력 → add() → items 배열 변경 → save() → render() → 화면 변경
```

체크할 때는:

```text
클릭 → toggle() → completed 변경 → save() → render()
```

필터는 `render()` 안에서 `filter()`로 처리합니다.

## CSS 핵심

```css
.layout {
    display: flex;
    gap: 55px;
}
```

큰 화면에서는 입력 영역과 목록을 가로로 배치합니다.

```css
@media (max-width: 700px) {
    .layout {
        flex-direction: column;
    }
}
```

작은 화면에서는 위아래로 바뀝니다.

## 구현 기능

- Todo 등록
- 수정
- 삭제
- 완료 체크
- All / Active / Completed
- Clear completed
- 남은 Todo 개수
- localStorage 저장
- 새로고침 후 복원
- 오늘 날짜 자동 입력 및 유지
