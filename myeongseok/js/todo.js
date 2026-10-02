/* 1. HTML 요소와 배열 준비 */

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const emptyMessage = document.querySelector("#empty-message");

let todos = [];

/* 2. 목록을 화면에 그리는 함수 */

function renderTodos() {
    todoList.textContent = "";
    emptyMessage.hidden = todos.length > 0;

    todos.forEach((todo) => {
        const item = document.createElement("li");
        item.className = "todo-item";

        if (todo.completed) {
            item.classList.add("is-completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.setAttribute("aria-label", todo.text + " 완료 상태");

/* 완료 상태 변경 이벤트 추가 시작*/

        checkbox.addEventListener("change", () => {
            toggleTodo(todo.id);
        });

/* 완료 상태 변경 이벤트 추가 완 */

        const text = document.createElement("span");
        text.className = "todo-text";
        text.textContent = todo.text;

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "todo-edit";
        editButton.textContent = "수정";

/* renderTodo 내부에 prompt로 수정 기능과 데이터 변경 작업 시작 */

        editButton.addEventListener("click", () => {
            editTodo(todo.id);
        });

/* renderTodo 내부에 prompt로 수정 기능과 데이터 변경 작업 완 */

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "todo-delete";
        deleteButton.textContent = "삭제";

/* renderTodo 내부에 구현한 Todo 삭제 기능 시작 */

        deleteButton.addEventListener("click", () => {
            deleteTodo(todo.id);
        })

/* renderTodo 내부에 구현한 Todo 삭제 기능 완 */

        item.append(checkbox, text, editButton, deleteButton);
        todoList.append(item);
    });
}

/* Todo를 추가해주는 함수 addTodo */

function addTodo(todoText) {
    const newTodo = {
        id: Date.now(),
        text: todoText,
        completed: false
    };

    todos.push(newTodo);
    renderTodos();
}

/* form을 제출하는 이벤트 addEventListener */

todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const todoText = todoInput.value.trim();

    if (todoText === "") {
        todoInput.focus();
        return;
    }

    addTodo(todoText);
    todoInput.value = "";
    todoInput.focus();
});

renderTodos();

/* 완료 시 상태 변경2 */

function toggleTodo(todoId) {
    const todo = todos.find((item) => item.id === todoId);

    if (!todo) {
        return;
    }

    todo.completed = !todo.completed;
    renderTodos();
}

/* 완료 시 상태 변경2 완 */

/* renderTodo '외부'에 prompt로 수정 기능과 데이터 변경 작업 시작 */

function editTodo(todoId) {
    const todo = todos.find((item) => item.id === todoId);

    if (!todo) {
        return;
    }

    const editedText = prompt("수정할 내용을 입력하세요.", todo.text);

    if (editedText === null) {
        return;
    }

    const cleanText = editedText.trim();

    if (cleanText === "") {
        alert("빈 내용으로 수정할 수 없습니다.");
        return;
    }

    todo.text = cleanText;
    renderTodos();
}

/* renderTodo '외부'에 prompt로 수정 기능과 데이터 변경 작업 완
prompt의 두 번쨰 인수는 처음 보여줄 값, 사용자가 취소 누르면 null 반환, 
수정한 값도 trim으로 확인, 객체의 text를 바꿔서 화면을 다시 그림 */

/* renderTodo 외부에 구현한 Todo 삭제 기능 시작 */
function deleteTodo(todoId) {
    const shouldDelete = confirm("삭제할까요?");

    if (!shouldDelete) {
        return;
    }
    todos = todos.filter((item) => item.id !== todoId);
    renderTodos();
}

/* renderTodo 외부에 구현한 Todo 삭제 기능 완, 
filter는 조건을 통과한 값을 모아 새 배열 제작,
item,id !== todoId는 삭제하려는 ID가 아닌 항목만 남김 
confirm 기능을 활용해 삭제 시 한 번 더 물어봄*/

