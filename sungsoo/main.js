window.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.querySelector("#todoInput");
    const todoList = document.querySelector("#todoList");
    const addButton = document.querySelector("#addButton");
    const todoForm = document.querySelector("#todoForm");
    const emptyMessage = document.querySelector("#empty-message");
    const todayText = document.querySelector("#todayText");
    const clearButton = document.querySelector("#clearButton");
    const progressText = document.querySelector("#progressText");
    const progressFill = document.querySelector("#progressFill");

    const STORAGE_KEY = "todo-list";

    let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    function saveTodos() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }

    function addTodo(text) {
        const newTodo = {
            id: Date.now(),
            text: text,
            done: false,
        };
        todos.push(newTodo);
        saveTodos();
        return newTodo.id; // 방금 추가한 할 일의 id (등장 효과를 이 항목에만 주려고)
    }

    // 상태 변경하기 -> done이 true면 false로, false면 true로
    function toggleTodo(id) {
        const todo = todos.find((item) => {
            return item.id === id;
        });
        todo.done = !todo.done;
    }

    // 할 일 삭제: id가 일치하지 않는 것만 남기고 새 배열로
    function deleteTodo(id) {
        todos = todos.filter((item) => {
            return item.id !== id;
        });
    }

    function createTodoEl(todo, isNew) {
        const li = document.createElement("li");
        li.dataset.id = todo.id; // 이벤트 위임에서 "몇 번 할 일인지" 찾을 때 사용
        li.className =
            "flex items-center gap-2 py-2 px-4 rounded-xl hover:bg-gray-100";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.done;
        checkbox.className = "todo-check size-5 cursor-pointer accent-blue-400";

        const text = document.createElement("span");
        text.textContent = todo.text;

        if (todo.done) {
            text.className = "flex-1 text-[17px] text-gray-400 line-through";
        } else {
            text.className = "flex-1 text-[17px] text-gray-800";
        }

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.setAttribute("aria-label", "삭제");
        deleteButton.className =
            "todo-delete button-press flex size-9 shrink-0 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 hover:text-red-500";

        const SVG_NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("width", "20");
        svg.setAttribute("height", "20");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2.2");
        svg.setAttribute("stroke-linecap", "round");

        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", "M6 6l12 12M18 6L6 18");
        svg.appendChild(path);
        deleteButton.appendChild(svg);

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteButton);
        if (isNew) {
            li.classList.add("is-new");
            setTimeout(function () {
                li.classList.remove("is-new");
            }, 1000);
        }
        return li;
    }

    // newTodoId: 방금 추가한 할 일의 id. 그 항목에만 is-new 효과를 줌 (없으면 undefined)
    function render(newTodoId) {
        todoList.innerHTML = ""; // 기존 내용 지우기

        todos.forEach((todo) => {
            const li = createTodoEl(todo, todo.id === newTodoId);
            todoList.appendChild(li);
        });

        // 진행률 계산
        const total = todos.length;
        const doneCount = todos.filter((todo) => todo.done).length;
        const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

        progressText.textContent = `${total}개 중 ${doneCount}개 완료`;
        progressFill.style.width = `${percent}%`;

        emptyMessage.hidden = total > 0; // 할 일이 있으면 안내 문구 숨김
        clearButton.hidden = doneCount === 0; // 완료한 게 없으면 버튼 숨김
    }

    function updateAddButton() {
        addButton.disabled = todoInput.value.trim() === "";
    }

    todoInput.addEventListener("input", updateAddButton);

    todoForm.addEventListener("submit", (event) => {
        event.preventDefault(); // form의 기본 동작(새로고침) 막기

        const text = todoInput.value.trim();
        if (text === "") return;

        const newTodoId = addTodo(text);
        render(newTodoId);

        todoInput.value = "";
        updateAddButton();
        todoInput.focus(); // 바로 다음 할 일을 입력할 수 있게
    });

    // 완료 체크 (li마다 이벤트를 달지 않고, 부모 ul 하나에만 이벤트 전달)
    todoList.addEventListener("change", (event) => {
        if (!event.target.classList.contains("todo-check")) return;

        const id = Number(event.target.closest("li").dataset.id);
        toggleTodo(id);

        saveTodos();
        render();
    });

    // 삭제
    todoList.addEventListener("click", (event) => {
        const deleteButton = event.target.closest(".todo-delete");

        if (!deleteButton) return;

        const id = Number(deleteButton.closest("li").dataset.id);
        deleteTodo(id);

        saveTodos();
        render();
    });

    clearButton.addEventListener("click", () => {
        todos = todos.filter((item) => !item.done);
        saveTodos();
        render();
    });

    todayText.textContent = new Date().toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "long",
    });

    render();
    updateAddButton();
});
