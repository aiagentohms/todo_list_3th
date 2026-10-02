const currentDateEl = document.getElementById('current-date');
const completedCount = document.getElementById("completed-count");
const allBtnEl = document.getElementById('allBtn'); 
const activeBtnEl = document.getElementById('activeBtn'); 
const doneBtnEl = document.getElementById('doneBtn'); 
const clearBtnEl = document.getElementById('clearBtn'); 
const editBtnEl = document.getElementById('editBtn'); 
const todoItemsEl = document.getElementById("todo-items");


const todo = { 
    items: [], // 할 일 객체들을 보관하는 배열
    tpl: null, // HTML 템플릿을 한 번 읽어 둔 뒤 재사용할 변수
    all() {
        return this.items;
    }, 

    active() { // 완료되지 않은 task 조회 기능을 넣을 자리
        let activeLi = [];
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].done === false) {
                activeLi.push(this.items[i]);
            }
        } return activeLi;
    }, 

    done() { // 완료된 task 조회 기능을 넣을 자리 
        let doneLi = [];
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].done === true) {
                doneLi.push(this.items[i]);
            }
        } return doneLi;
    }, 

    get(uid) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].uid === Number(uid)) {
                return this.items[i];
            }
        }
    },

    edit(uid) { // task 수정 기능을 넣을 자리 (현재는 비어 있음)
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].uid === Number(uid)) {
                let editText = prompt('Edit item...');
                if (editText !== null) {
                    this.items[i].content = editText;
                }
            }
        }    
        this.save();
        this.render();    
    },
    
    add(content) {
        this.items.push({ // 새 할 일 객체를 배열 끝에 추가
            uid: Date.now(), // 항목마다 구별할 번호를 만듦
            content, 
            done: false, // 새 할 일은 아직 미완료 상태
        });
        this.save(); 
        this.render(); 
    },

    save() {
        // localStorage는 문자열만 저장하므로 배열을 JSON 문자열로 바꾼다.
        localStorage.setItem("todos", JSON.stringify(this.items));
    },

    getTpl() {
        if (!this.tpl) { 
            this.tpl = document.getElementById("tpl-item").innerHTML;
        }
        return this.tpl; 
    },

    remove(uid) { // task 삭제 
        for (let i = 0; i < this.items.length; i++) {
            console.log("deleted task's uid:", this.items[i].uid);
            if (this.items[i].uid === Number(uid)) {
                this.items.splice(i, 1);
            }
        }
        this.save();
        this.render();
    }, 

    render(tab) { // tab마다 render를 따로 주므로 매개변수 지정
        const tmp = localStorage.getItem("todos");
        this.items = typeof tmp === 'string' ? JSON.parse(tmp) : [];
        
        if (tab === undefined) tab = this.items;

        const targetEl = document.getElementById("todo-items");

        let ct = 0;
        for (let i= 0; i < this.items.length; i++) {
            if (this.items[i].done === true) {
                ct++;
            }
        }
        completedCount.textContent = `${ct} task completed`;

        if (tab.length === 0) {
            targetEl.innerHTML = '<ul><li class="text-center">no task :/</li></ul>';
            return;
        }
        let html = "";

        for (const {uid, content, done} of tab) {
            const tpl = this.getTpl();
            html += tpl.replace(/\$\{uid\}/g, uid) 
                    .replace(/\$\{content\}/g, content)
                    .replace(/\$\{checked\}/g, done ? "checked" : "");
        }
        targetEl.innerHTML = html; 
    },

    clearCompleted() {
        for (let i = this.items.length - 1; i >= 0; i--) { // 뒤에서 돌기
            if (this.items[i].done) this.items.splice(i, 1)
        }
        this.save();
        this.render();
    },

    changeBox(uid) {
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (this.items[i].uid === Number(uid)) {
                this.items[i].done = !this.items[i].done;
            }
        }
        this.save();
        this.render();
    }
}

window.addEventListener("DOMContentLoaded", function() {
    const now = new Date(); 
    currentDateEl.textContent = now.toDateString(); 

    todo.render(); 

    frmTodo.addEventListener("submit", function(e) { 
        e.preventDefault(); 
        const atodo = frmTodo.todoText.value; 
        if (!atodo) {
            alert("Enter task");
            frmTodo.todoText.focus();
            return;
        }

        todo.add(atodo); 

        frmTodo.todoText.value = "";
        frmTodo.todoText.focus();
    });

    // task 편집
    todoItemsEl.addEventListener("click", function(e) {
        const button = e.target.closest('[data-action="edit"]');
        if (!button) return;

        todo.edit(button.dataset.uid);
    })

    // task 삭제
    todoItemsEl.addEventListener("click", function(e) {
        const button = e.target.closest('[data-action="remove"]');
        if (!button) return;

        todo.remove(button.dataset.uid);
    });

    // checkbox toggle
    todoItemsEl.addEventListener("change", function(e) {
        const box = e.target.closest('[data-action="toggle"]');
        if (!box) return;

        todo.changeBox(box.dataset.uid);
    })

    // 완료된 task 삭제
    clearBtnEl.addEventListener("click", function() {
        todo.clearCompleted();
    })

    // all tab
    allBtnEl.addEventListener("click", function() {
        todo.render(todo.all())
    })

    // active tab (완료되지 않은 Tasks)
    activeBtnEl.addEventListener("click", function() {
        todo.render(todo.active());
    })

    // done tab (완료된 tasks)
    doneBtnEl.addEventListener("click", function() {
        todo.render(todo.done())
    })
});
