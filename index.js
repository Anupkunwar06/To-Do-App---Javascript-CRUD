let todos = [];
const todolist = document.querySelector("#todo-list");
const form = document.querySelector("#form");
const todoInput = document.querySelector("#todo-input");
const formBtn = document.querySelector("#form-btn")
const taskCount = document.querySelector("#task-count")
const completedCount = document.querySelector("#completed-count")

let edittodoId = null;

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const todoValue = todoInput.value.trim();

    if (!todoValue) return; 

    if(edittodoId){
        todos = todos.map((todo) => {
            if(todo.id === Number(edittodoId)){
                return {
                    ...todo,
                    text: todoValue
                }
            }
            return todo; // FIXED: Moved this outside the IF block!
        })
        edittodoId = null; 
        formBtn.textContent = "Submit";
    } else { 
        const newTodo = {
            id: Date.now(),
            text: todoValue,
            isCompleted: false
        }
        todos.push(newTodo)
    }
    todoInput.value ="";
    renderTodo();
});

function renderTodo() {
    todolist.innerHTML = "";
    todos.forEach(function(todo) {
        addTodo(todo);
    });
}

function addTodo(todo) {
    const li = document.createElement("li");
    li.className = `flex gap-2 border border-slate-300 p-4 rounded-xl`;
    li.dataset.id = todo.id; 
    
    // FIXED: Corrected HTML spacing so attributes don't mash together
    li.innerHTML = `
        <input type="checkbox" ${todo.isCompleted ? "checked" : ""}>
        <p class="flex-1 ${todo.isCompleted ? "line-through text-red-500" : ""}">${todo.text}</p>
        <div class="flex gap-2">
            <button data-action="edit" data-id="${todo.id}">Edit</button>
            <button data-action="delete" data-id="${todo.id}">Delete</button> 
        </div>`;
    
    todolist.append(li);
    taskCount.textContent = `TASK (${todos.length})`;
    completedCount.textContent = `COMPLETED (${todos.filter((todo)=>todo.isCompleted).length})`;
}

todolist.addEventListener('click', (e) => {
    let li = e.target.closest('li');
    let btn = e.target.closest('button');
    let checkbox = e.target.closest('input[type="checkbox"]');
    
    let action = btn?.dataset.action;
    let id = li?.dataset?.id; 
    // FIXED: Removed the buggy line that overwrote 'id' with checkbox.dataset.id

    if (action === "edit") {
       startedit(id);
    }
    
    if (action === "delete") {
       deletetodo(e, id);
    }
    
    // FIXED: Kept only ONE clean block for the checkbox toggle
    if (checkbox) {
        todos = todos.map((todo) => {
            if (todo.id === Number(id)) {
                return {
                    ...todo,
                    isCompleted: !todo.isCompleted
                };
            }
            return todo;
        });
        renderTodo();
    }
});

function deletetodo(e, id) {
    console.log("deleting...");
    todos = todos.filter((todo) => todo.id !== Number(id));
    renderTodo();
}

function startedit(id){
    edittodoId = id;
    console.log("...editing")
    let currentTodo = todos.find((todo) => {
        if(todo.id === Number(id)){
            return todo
        }
    })
    todoInput.value = currentTodo.text;
    formBtn.textContent = "Update";
}