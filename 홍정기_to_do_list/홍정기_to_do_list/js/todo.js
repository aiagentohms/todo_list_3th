const dateInput = document.getElementById("todo-date");
const selectedDate = document.getElementById("selected-date");
const listMessage = document.getElementById("list-message");
const todoList = document.getElementById("todo-list");
const todoEditor = document.getElementById("todo-editor");
const todoForm = document.getElementById("todo-form");
const titleInput = document.getElementById("todo-title");
const contentInput = document.getElementById("todo-content");
const storageKey = "hongjeonggi-todos";
const todos = [];
let editingIndex = -1;

try {
    const savedTodos = localStorage.getItem(storageKey);
    if (savedTodos !== null) {
        const loadedTodos = JSON.parse(savedTodos);
        for (const todo of loadedTodos) {
            todos.push(todo);
        }
    }
} catch (error) {
    console.error("저장된 할 일을 불러오지 못했습니다.", error);
}

function saveTodos() {
    localStorage.setItem(storageKey, JSON.stringify(todos));
}

function stopEditing() {
    editingIndex = -1;
}

function renderTodos() {
    todoList.innerHTML = "";

    if (dateInput.value === "") {
        listMessage.textContent = "날짜를 선택하세요.";
        return;
    }

    let count = 0;
    for (let i = 0; i < todos.length; i++) {
        const todo = todos[i];
        if (todo.date === dateInput.value) {
            const item = document.createElement("li");
            item.setAttribute("class", "rounded-lg border border-[#B04BFF] bg-white p-4");

            if (editingIndex === i) {
                const form = document.createElement("form");
                const titleLabel = document.createElement("label");
                titleLabel.textContent = "제목";
                titleLabel.setAttribute("class", "mb-2 block font-semibold");
                const editTitle = document.createElement("input");
                editTitle.setAttribute("type", "text");
                editTitle.setAttribute("class", "mb-4 block w-full rounded-md border border-[#B04BFF] bg-white p-3 text-[#B04BFF]");
                editTitle.value = todo.title;
                titleLabel.appendChild(editTitle);

                const contentLabel = document.createElement("label");
                contentLabel.textContent = "내용";
                contentLabel.setAttribute("class", "mb-2 block font-semibold");
                const editContent = document.createElement("textarea");
                editContent.setAttribute("class", "mb-4 block min-h-24 w-full rounded-md border border-[#B04BFF] bg-white p-3 text-[#B04BFF]");
                editContent.value = todo.content;
                contentLabel.appendChild(editContent);

                const saveButton = document.createElement("button");
                saveButton.setAttribute("type", "submit");
                saveButton.setAttribute("class", "mr-2 rounded-md border border-[#B04BFF] bg-[#B04BFF] px-5 py-3 font-bold text-white hover:bg-white hover:text-[#B04BFF]");
                saveButton.textContent = "저장";
                const cancelButton = document.createElement("button");
                cancelButton.setAttribute("type", "button");
                cancelButton.setAttribute("class", "rounded-md border border-[#B04BFF] bg-white px-5 py-3 font-bold text-[#B04BFF] hover:bg-[#B04BFF] hover:text-white");
                cancelButton.textContent = "취소";

                form.addEventListener("submit", function (event) {
                    event.preventDefault();
                    if (editTitle.value === "") {
                        return;
                    }
                    todo.title = editTitle.value;
                    todo.content = editContent.value;
                    saveTodos();
                    stopEditing();
                    renderTodos();
                });
                cancelButton.addEventListener("click", function () {
                    stopEditing();
                    renderTodos();
                });

                form.appendChild(titleLabel);
                form.appendChild(contentLabel);
                form.appendChild(saveButton);
                form.appendChild(cancelButton);
                item.appendChild(form);
            } else {
                const title = document.createElement("h3");
                title.setAttribute("class", "text-lg font-bold");
                const content = document.createElement("p");
                content.setAttribute("class", "mt-2 whitespace-pre-wrap");
                const doneButton = document.createElement("button");
                doneButton.setAttribute("type", "button");
                doneButton.setAttribute("class", "mb-2 mr-2 mt-3 rounded-md border border-[#B04BFF] bg-[#B04BFF] px-3 py-2 font-semibold text-white hover:bg-white hover:text-[#B04BFF]");
                const editButton = document.createElement("button");
                editButton.setAttribute("type", "button");
                editButton.setAttribute("class", "mb-2 mr-2 mt-3 rounded-md border border-[#B04BFF] bg-white px-3 py-2 font-semibold text-[#B04BFF] hover:bg-[#B04BFF] hover:text-white");
                editButton.textContent = "수정";
                const deleteButton = document.createElement("button");
                deleteButton.setAttribute("type", "button");
                deleteButton.setAttribute("class", "mb-2 mt-3 rounded-md border-2 border-[#B04BFF] bg-white px-3 py-2 font-semibold text-[#B04BFF] hover:bg-[#B04BFF] hover:text-white");
                deleteButton.textContent = "삭제";
                if (todo.completed === true) {
                    title.textContent = "[완료] " + todo.title;
                    doneButton.textContent = "완료 취소";
                    title.classList.add("completed-text");
                    content.classList.add("completed-text");
                } else {
                    title.textContent = todo.title;
                    doneButton.textContent = "완료";
                }
                content.textContent = todo.content;
                doneButton.addEventListener("click", function () {
                    if (todo.completed === true) {
                        todo.completed = false;
                    } else {
                        todo.completed = true;
                    }
                    saveTodos();
                    stopEditing();
                    renderTodos();
                });
                editButton.addEventListener("click", function () {
                    editingIndex = i;
                    renderTodos();
                });
                deleteButton.addEventListener("click", function () {
                    todos.splice(i, 1);
                    saveTodos();
                    stopEditing();
                    renderTodos();
                });
                item.appendChild(title);
                item.appendChild(content);
                item.appendChild(doneButton);
                item.appendChild(editButton);
                item.appendChild(deleteButton);
            }
            todoList.appendChild(item);
            count++;
        }
    }

    if (count === 0) {
        listMessage.textContent = "등록된 할 일이 없습니다.";
    } else {
        listMessage.textContent = "";
    }
}

dateInput.addEventListener("change", function () {
    stopEditing();
    titleInput.value = "";
    contentInput.value = "";
    selectedDate.textContent = dateInput.value;
    if (dateInput.value === "") {
        todoEditor.classList.remove("is-open");
    } else {
        todoEditor.classList.add("is-open");
    }
    renderTodos();
});

todoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (dateInput.value === "" || titleInput.value === "") {
        listMessage.textContent = "날짜와 제목을 입력하세요.";
        return;
    }

    const todo = {
        date: dateInput.value,
        title: titleInput.value,
        content: contentInput.value,
        completed: false
    };
    todos.push(todo);
    saveTodos();
    titleInput.value = "";
    contentInput.value = "";
    stopEditing();
    renderTodos();
});
