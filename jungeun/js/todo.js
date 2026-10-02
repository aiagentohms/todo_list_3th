/**
 * 할 일 등록, 조회, 수정, 삭제와 세 칸 상태 관리
 */
const todo = {
  items: [],
  tpl: null,
  query: '',
  stages: ['backlog', 'progress', 'done'],

  // 저장된 할 일 조회 (이전 버전의 데이터도 읽음)
  load() {
    try {
      let saved = localStorage.getItem('todos');
      if (saved === null) {
        saved = localStorage.getItem('jungeun-todos-v1');
      }
      const data = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(data)) {
        this.items = [];
        return;
      }

      this.items = [];
      for (const item of data) {
        if (!item || typeof item !== 'object') continue;
        const title = item.title || item.text;
        const uid = item.uid || item.id;
        if (typeof title !== 'string' || uid === undefined) continue;

        let status = item.status;
        if (!this.stages.includes(status)) {
          status = item.completed ? 'done' : 'backlog';
        }
        this.items.push({ uid, title, status });
      }
    } catch (error) {
      console.error('저장된 할 일을 읽지 못했습니다.', error);
      this.items = [];
    }
  },

  // 고유 식별자로 할 일 하나 조회
  get(uid) {
    for (const item of this.items) {
      if (String(item.uid) === String(uid)) return item;
    }
    return null;
  },

  // 할 일 등록: 새 항목은 대기 칸에 배치
  add(title) {
    this.items.push({
      uid: Date.now(),
      title,
      status: 'backlog'
    });
    this.save();
    this.render();
  },

  // 제목 수정
  update(uid, title) {
    const item = this.get(uid);
    if (!item) return;
    item.title = title;
    this.save();
    this.render();
  },


  // 할 일 하나 삭제
  remove(uid) {
    for (let i = 0; i < this.items.length; i++) {
      if (String(this.items[i].uid) === String(uid)) {
        this.items.splice(i, 1);
        break;
      }
    }
    this.save();
    this.render();
  },

  // 완료된 할 일 전체 삭제
  clearDone() {
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].status === 'done') {
        this.items.splice(i, 1);
      }
    }
    this.save();
    this.render();
  },

  // 배열을 문자열로 바꿔 브라우저에 보관
  save() {
    localStorage.setItem('todos', JSON.stringify(this.items));
  },

  // 검색어가 포함된 할 일을 조회합니다. 빈 검색어는 전체 목록을 반환합니다.
  search(query) {
    const keyword = query.trim().toLocaleLowerCase('ko-KR');
    return this.items.filter((item) => item.title.toLocaleLowerCase('ko-KR').includes(keyword));
  },

  // 카드 모양은 문서의 서식에서 한 번만 가져옴
  getTpl() {
    if (!this.tpl) {
      this.tpl = document.getElementById('tpl-item');
    }
    return this.tpl;
  },

  // 저장된 상태에 따라 세 칸에 목록을 표시합니다. 상태 변경 기능은 아직 제공하지 않습니다.
  render() {
    for (const list of this.stages) {
      document.getElementById(list + '-list').replaceChildren();
    }

    const visibleItems = this.search(this.query);
    for (const item of visibleItems) {
      const card = this.getTpl().content.firstElementChild.cloneNode(true);
      const titleEl = card.querySelector('.task-text');
      const editButton = card.querySelector('.edit-action');
      const deleteButton = card.querySelector('.delete-action');

      titleEl.textContent = item.title;
      if (item.status === 'done') titleEl.classList.add('done');
      editButton.setAttribute('aria-label', '말 바꾸기: ' + item.title);
      deleteButton.setAttribute('aria-label', '없던 일로 하기: ' + item.title);

      editButton.addEventListener('click', function () {
        const newTitle = prompt('할 일을 수정하세요.', item.title);
        if (newTitle === null) return;
        if (!newTitle.trim()) {
          alert('할 일을 입력하세요.');
          return;
        }
        todo.update(item.uid, newTitle.trim());
      });

      deleteButton.addEventListener('click', function () {
        if (confirm('정말 삭제하겠습니까?')) todo.remove(item.uid);
      });

      document.getElementById(item.status + '-list').append(card);
    }

    let remaining = 0;
    let doneCount = 0;
    for (const stage of this.stages) {
      let count = 0;
      for (const item of this.items) {
        if (item.status === stage) count++;
      }
      const visibleCount = visibleItems.filter((item) => item.status === stage).length;
      document.getElementById(stage + '-count').textContent = visibleCount;
      document.getElementById(stage + '-empty').hidden = visibleCount > 0;
      document.getElementById(stage + '-empty').textContent = this.query ? '조회 결과가 없습니다.' : { backlog: '빈칸일 수가 없는데...', progress: '쌓여요', done: '완료된 업보들로 채우세요' }[stage];
      if (stage === 'done') doneCount = count;
      else remaining += count;
    }
    document.getElementById('search-result').textContent = this.query ? `조회 결과: ${visibleItems.length}건` : '';
    // 완료되지 않은 할 일 개수를 한국어로 표시하고, 변경 내용은 스크린 리더에 전달합니다.
    document.getElementById('tasks-left').textContent = `미래의 나에게 넘길 일: ${remaining}건`;
    document.getElementById('clear-completed').disabled = doneCount === 0;
  }
};

window.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const today = document.getElementById('today');
  // 한국 시간 기준으로 요일을 먼저 표시합니다. 예: 목요일, 10월 1일
  const dateParts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul', weekday: 'long', month: 'numeric', day: 'numeric'
  }).formatToParts(new Date());
  const getDatePart = (type) => dateParts.find((part) => part.type === type).value;
  today.textContent = `${getDatePart('weekday')}, ${getDatePart('month')}월 ${getDatePart('day')}일`;

  todo.load();
  todo.render();

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const title = input.value.trim();
    if (!title) return;
    todo.add(title);
    input.value = '';
    input.focus();
  });

  const searchInput = document.getElementById('search-input');
  document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    todo.query = searchInput.value.trim();
    todo.render();
  });
  // 검색어를 모두 지우면 전체 목록으로 돌아갑니다.
  searchInput.addEventListener('input', function () {
    if (!searchInput.value.trim()) {
      todo.query = '';
      todo.render();
    }
  });

  document.getElementById('clear-completed').addEventListener('click', function () {
    todo.clearDone();
  });
});
