let todos = JSON.parse(localStorage.getItem("todos")) || [];

const todolist = document.querySelector("#todo-list");
const form = document.querySelector("#form");
const todoInput = document.querySelector("#todo-input");
const formBtn = document.querySelector("#form-btn");
const taskCount = document.querySelector("#task-count");
const completedCount = document.querySelector("#completed-count");

let edittodoId = null;

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const todoValue = todoInput.value.trim();

    if (!todoValue) return; 

    if (edittodoId) {
        todos = todos.map((todo) => {
            if (todo.id === Number(edittodoId)) {
                return {
                    ...todo,
                    text: todoValue
                }
            }
            return todo; 
        })
        edittodoId = null; 
        formBtn.textContent = "Submit";
        localStorage.setItem("todos", JSON.stringify(todos));
    } else { 
        const newTodo = {
            id: Date.now(),
            text: todoValue,
            isCompleted: false
        }
        todos.push(newTodo);
        
        localStorage.setItem("todos", JSON.stringify(todos));
    }
    todoInput.value = "";
    renderTodo();
});


function renderTodo() {
    todolist.innerHTML = "";

    todos.forEach(function(todo) {
        addTodo(todo);
    });

    // Update counts after rendering all list items
    taskCount.textContent = `TASK (${todos.length})`;
    completedCount.textContent = `COMPLETED (${todos.filter(todo => todo.isCompleted).length})`;
}

function addTodo(todo) {
    const li = document.createElement("li");
    li.className = `flex gap-2 border border-slate-300 p-4 rounded-xl`;
    li.dataset.id = todo.id; 
    
    li.innerHTML = `
        <input type="checkbox" ${todo.isCompleted ? "checked" : ""}>
        <p class="flex-1 ${todo.isCompleted ? "line-through text-red-500" : ""}">${todo.text}</p>
        <div class="flex gap-2">
            <button data-action="edit" data-id="${todo.id}">Edit</button>
            <button data-action="delete" data-id="${todo.id}">Delete</button> 
        </div>`;
    
    todolist.append(li);
}

todolist.addEventListener('click', (e) => {
    let li = e.target.closest('li');
    let btn = e.target.closest('button');
    let checkbox = e.target.closest('input[type="checkbox"]');
    
    let action = btn?.dataset.action;
    let id = li?.dataset?.id; 

    if (action === "edit") {
       startedit(id);
    }
    
    if (action === "delete") {
       // FIXED: Removed the 'e' argument so the function receives the actual ID
       deletetodo(id);
    }
    
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
        localStorage.setItem("todos", JSON.stringify(todos));
        renderTodo();
    }
});

function deletetodo(id) {
    todos = todos.filter((todo) => todo.id !== Number(id));
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodo();
}

function startedit(id) {
    edittodoId = id;
    let currentTodo = todos.find((todo) => todo.id === Number(id));
    todoInput.value = currentTodo.text;
    formBtn.textContent = "Update";
}

// FIXED: Call this once when the script loads to display saved tasks
renderTodo();