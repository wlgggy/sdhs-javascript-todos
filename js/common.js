const $todoInput = find(".todo-head__input");
const $todoList = find(".todo-body__list");
const $todoCounter = find(".todo-control__count span");
const $todoAllSelectedBtn = find(".todo-head__all-select-btn");
const $todoClearCompleteBtn = find(".todo-control__clear-complete-btn");
const $todoControlBtns = findAll(".todo-control__btn");

const [todoState, setTodos] = storageInit("todos", {
    todos: [],
    count: 0,
    status: "all",
});
const todoUtils = {
    active() {
        return todoState.todos.filter(({ selected }) => !selected);
    },
    complete() {
        return todoState.todos.filter(({ selected }) => selected);
    },
    delete(findIndex) {
        return todoState.todos.filter(({ index }) => index !== findIndex);
    },
    existActive() {
        return todoState.todos.some(({ selected }) => !selected);
    },
    existComplete() {
        return todoState.todos.some(({ selected }) => selected);
    },
    allComplete() {
        return todoState.todos.map((todoItem) => ({
            ...todoItem,
            selected: true,
        }));
    },
    allActive() {
        return todoState.todos.map((todoItem) => ({
            ...todoItem,
            selected: false,
        }));
    },
};

function setEvent() {
    $todoAllSelectedBtn.addEventListener("click", function () {
        const existActive = todoUtils.existActive();
        if (existActive) {
            todoState.todos = todoUtils.allComplete();
        } else {
            todoState.todos = todoUtils.allActive();
        }
        renderTodos();
    });
    $todoInput.addEventListener("keydown", function (event) {
        const isAddTodoItem = [13, 9].includes(event.keyCode);
        if (isAddTodoItem) {
            const todoItem = {
                index: todoState.count++,
                title: this.value,
                selected: false,
            };
            todoState.todos.push(todoItem);
            this.value = "";
            renderTodos();
        }
    });

    $todoControlBtns.forEach(function ($controlBtn) {
        $controlBtn.addEventListener("click", function () {
            todoState.status = this.dataset.type;
            renderTodos();
        });
    });
    $todoClearCompleteBtn.addEventListener("click", function () {
        todoState.todos = todoUtils.active();
        renderTodos();
    });
}

function createTodoItem(todoItem) {
    const $todoItem = createElement("div");
    $todoItem.className = "todo-item flex";
    todoItem.selected && $todoItem.classList.add(`selected`);
    $todoItem.innerHTML = `
        <div class="todo-item__toggle"></div>
        <div class="todo-item__text">${todoItem.title}</div>
        <button class="todo-item__delete-btn none">X</button>
    `;

    const $todoItemToggle = find(".todo-item__toggle", $todoItem);
    const $todoItemText = find(".todo-item__text", $todoItem);
    const $todoItemDeleteButton = find(".todo-item__delete-btn", $todoItem);
    let isMouseEnter = false;
    $todoItem.addEventListener("mouseenter", function () {
        $todoItemDeleteButton.classList.remove("none");
        isMouseEnter = true;
    });
    $todoItem.addEventListener("mouseleave", function () {
        $todoItemDeleteButton.classList.add("none");
        isMouseEnter = false;
    });

    $todoItemToggle.addEventListener("click", function () {
        todoItem.selected = !todoItem.selected;
        renderTodos();
    });
    $todoItemText.addEventListener("dblclick", function () {
        $todoItemDeleteButton.classList.add("none");
        $todoItemText.contentEditable = true;
        $todoItemText.focus();
    });
    $todoItemText.addEventListener("focusout", function () {
        $todoItemText.contentEditable = false;
        isMouseEnter && $todoItemDeleteButton.classList.remove("none");
    });
    $todoItemText.addEventListener("keydown", function (event) {
        const isUpdateTodoItem = [13, 9].includes(event.keyCode);
        if (isUpdateTodoItem) {
            todoItem.title = this.textContent;
            renderTodos();
        }
    });
    $todoItemDeleteButton.addEventListener("click", function () {
        todoState.todos = todoUtils.delete(todoItem.index);
        renderTodos();
    });

    return $todoItem;
}

function renderTodos() {
    let todos = todoState.todos;
    const existComplete = todoUtils.existComplete();
    const isAllSelected = !todoUtils.existActive() && todoState.todos.length;

    if (todoState.status === "active") {
        todos = todoUtils.active();
    } else if (todoState.status === "complete") {
        todos = todoUtils.complete();
    }

    $todoList.innerHTML = "";
    todos.forEach(function (todoItem) {
        const $todoItem = createTodoItem(todoItem);
        $todoList.append($todoItem);
    });
    $todoControlBtns.forEach(function ($todoControlBtn) {
        if ($todoControlBtn.dataset.type === todoState.status) {
            $todoControlBtn.classList.add("selected");
        } else {
            $todoControlBtn.classList.remove("selected");
        }
    });
    $todoCounter.textContent = todos.length;
    $todoAllSelectedBtn.classList.toggle("all-selected", isAllSelected);
    $todoClearCompleteBtn.classList.toggle("none", !existComplete);
    setTodos();
}

function todoInit() {
    setEvent();
    renderTodos();
}

todoInit();
