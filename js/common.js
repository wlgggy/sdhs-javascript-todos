const $todoInput = find(".todo-head__input");
const $todoList = find(".todo-body__list");
const $todoCounter = find(".todo-control__count span");
const $todoAllSelectedBtn = find(".todo-head__all-select-btn");
const $todoControl = find(".todo-body__control");
const $todoClearCompleteBtn = find(".todo-control__clear-complete-btn");
const $todoControlBtns = findAll(".todo-control__btn");

const [todoState, setTodos] = storageInit("todos", {
    todos: [],
    count: 0,
    status: "all",
});
const todoUtils = {
    all() {
        return todoState.todos;
    },
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
            const value = this.value.trim();
            if (!value.length) return;
            const todoItem = {
                index: todoState.count++,
                title: value,
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

    let isEdit = false;
    $todoItem.addEventListener("mouseenter", function () {
        if (isEdit) return;
        $todoItemDeleteButton.classList.remove("none");
    });
    $todoItem.addEventListener("mouseleave", function () {
        $todoItemDeleteButton.classList.add("none");
    });

    $todoItemToggle.addEventListener("click", function () {
        todoItem.selected = !todoItem.selected;
        renderTodos();
    });
    $todoItemText.addEventListener("dblclick", function () {
        isEdit = true;
        $todoItemDeleteButton.classList.add("none");
        $todoItemText.contentEditable = true;
        $todoItemText.focus();
    });
    $todoItemText.addEventListener("focusout", function () {
        const title = this.textContent.trim();
        $todoItemText.contentEditable = false;
        isEdit = false;
        if (title.length) {
            todoItem.title = title;
        }
        renderTodos();
    });
    $todoItemText.addEventListener("keydown", function (event) {
        const isUpdateTodoItem = [13, 9].includes(event.keyCode);
        if (isUpdateTodoItem) {
            todoItem.title = this.textContent;
            isEdit = false;
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
    const existTodos = todoState.todos.length;
    const statusTodos = todoUtils[todoState.status]();
    const existComplete = todoUtils.existComplete();
    const isAllSelected = !todoUtils.existActive() && existTodos;

    $todoList.innerHTML = "";
    statusTodos.forEach(function (todoItem) {
        const $todoItem = createTodoItem(todoItem);
        $todoList.append($todoItem);
    });
    $todoControlBtns.forEach(function ($todoControlBtn) {
        const todoControlBtnDatasetType = $todoControlBtn.dataset.type;
        const isSelectedStatus = todoControlBtnDatasetType === todoState.status;
        $todoControlBtn.classList.toggle("selected", isSelectedStatus);
    });

    $todoAllSelectedBtn.classList.toggle("content-hide", !existTodos);
    $todoControl.classList.toggle("none", !existTodos);

    $todoCounter.textContent = statusTodos.length;
    $todoAllSelectedBtn.classList.toggle("all-selected", isAllSelected);
    $todoClearCompleteBtn.classList.toggle("none", !existComplete);
    setTodos();
}

function todoInit() {
    setEvent();
    renderTodos();
}

todoInit();
