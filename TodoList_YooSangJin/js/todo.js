const todo = {
    items: [],
    filter: "all",
    tpl: document.getElementById("tpl").innerHTML,

    add(date, title, content) {
        this.items.push({ uid: Date.now(), date, title, content, completed: false });
        this.save();
        this.render();
    },

    remove(uid) {
        const index = this.items.findIndex(item => item.uid === Number(uid));
        if (index === -1) return;
        this.items.splice(index, 1);
        this.save();
        this.render();
    },

    edit(uid) {
        const item = this.items.find(item => item.uid === Number(uid));
        if (!item) return;

        const title = prompt("제목을 수정하세요.", item.title);
        if (title === null || !title.trim()) return;

        const content = prompt("내용을 수정하세요.", item.content);
        if (content === null) return;

        item.title = title.trim();
        item.content = content.trim();
        this.save();
        this.render();
    },

    toggle(uid) {
        const item = this.items.find(item => item.uid === Number(uid));
        if (!item) return;
        item.completed = !item.completed;
        this.save();
        this.render();
    },

    save() {
        localStorage.setItem("todos", JSON.stringify(this.items));
    },

    render() {
        let list = this.items;
        if (this.filter === "active") list = this.items.filter(item => !item.completed);
        if (this.filter === "completed") list = this.items.filter(item => item.completed);

        let html = "";
        for (const item of list) {
            html += this.tpl
                .replace(/\$\{uid\}/g, item.uid)
                .replace(/\$\{date\}/g, item.date)
                .replace(/\$\{title\}/g, item.title)
                .replace(/\$\{content\}/g, item.content)
                .replace(/\$\{completedClass\}/g, item.completed ? "completed" : "")
                .replace(/\$\{checked\}/g, item.completed ? "checked" : "");
        }

        document.getElementById("todo-items").innerHTML =
            html || '<li class="empty-message">No tasks yet.</li>';

        const left = this.items.filter(item => !item.completed).length;
        document.getElementById("todo-count").textContent = left + " tasks left";
        document.getElementById("clear-completed").disabled =
            !this.items.some(item => item.completed);
    }
};

window.addEventListener("DOMContentLoaded", function() {
    const saved = localStorage.getItem("todos");
    todo.items = saved ? JSON.parse(saved) : [];

    const today = new Date();
    document.getElementById("today").textContent =
        today.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" });
    frmTodo.date.value = today.toISOString().slice(0, 10);
    todo.render();

    frmTodo.addEventListener("submit", function(e) {
        e.preventDefault();

        const date = frmTodo.date.value.trim();
        const title = frmTodo.title.value.trim();
        const content = frmTodo.content.value.trim();

        if (!date || !title || !content) {
            alert("날짜, 제목, 내용을 모두 입력하세요.");
            return;
        }

        todo.add(date, title, content);
        frmTodo.title.value = "";
        frmTodo.content.value = "";
        frmTodo.title.focus();
    });

    document.getElementById("todo-items").addEventListener("click", function(e) {
        const uid = e.target.dataset.uid;
        if (!uid) return;

        if (e.target.classList.contains("check-action")) todo.toggle(uid);
        if (e.target.classList.contains("edit-action")) todo.edit(uid);
        if (e.target.classList.contains("delete-action") && confirm("정말 삭제하겠습니까?")) {
            todo.remove(uid);
        }
    });

    document.getElementById("filter-buttons").addEventListener("click", function(e) {
        if (!e.target.classList.contains("filter")) return;
        todo.filter = e.target.dataset.filter;

        document.querySelectorAll(".filter").forEach(function(button) {
            button.classList.remove("active");
        });

        e.target.classList.add("active");
        todo.render();
    });

    document.getElementById("clear-completed").addEventListener("click", function() {
        todo.items = todo.items.filter(item => !item.completed);
        todo.save();
        todo.render();
    });
});
