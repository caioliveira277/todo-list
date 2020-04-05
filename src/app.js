const todoList = document.querySelector("#todo-list");
const todoInput = document.querySelector("#todo-input");
const todoButton = document.querySelector("#todo-button");
const filterOption = document.querySelector("#filter-todo");
const songs = document.querySelectorAll("audio");

/**
 * Play audio
 *
 * @example
 *   PlaySong("add")
 *
 * @param   {String} required  "add" or "remove"
 * @returns {Event}
 */
function PlaySong(type) {
  songs.forEach((song) => {
    if (song.getAttribute("data-type") === type) {
      song.currentTime = 0.2;
      song.play();
    }
  });
}
function UpdateTitle(increase = true) {
  const currentValue = parseInt(document.title);

  if (increase === true) {
    document.title = `${currentValue + 1} Open tasks`;
  } else {
    if (currentValue === 0) return;
    document.title = `${currentValue + -1} Open tasks`;
  }
}
function CreateTodoDiv(todoValue, completed = false) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  const newTodo = document.createElement("li");
  newTodo.innerText = todoValue;
  newTodo.classList.add("todo-item");

  const completedButton = document.createElement("button");
  completedButton.innerHTML = "<i class='material-icons'>check</i>";
  completedButton.setAttribute("data-action", "completed");

  const trashButton = document.createElement("button");
  trashButton.innerHTML = "<i class='material-icons'>delete</i>";
  trashButton.setAttribute("data-action", "delete");

  todoDiv.appendChild(newTodo);
  todoDiv.appendChild(completedButton);
  todoDiv.appendChild(trashButton);
  if (completed === true) todoDiv.classList.add("completed");

  return todoDiv;
}
function AddTodo(event) {
  event.preventDefault();

  if (!todoInput.value) return false;
  PlaySong("add");
  todoList.appendChild(CreateTodoDiv(todoInput.value));

  SaveTodo(todoInput.value);
  todoInput.value = "";
  UpdateTitle(true);
}
function HandlerActions(event) {
  const item = event.target;
  const todo = item.closest("div.todo");
  let index;

  if (item.getAttribute("data-action") === "delete") {
    index = [...todo.parentNode.children].indexOf(todo);
    todo.classList.add("fall");
    PlaySong("remove");
    DeleteTodo(todo);
    DeleteCompletedTodo(index);
    if (!todo.classList.contains("completed")) UpdateTitle(false);
    return todo.addEventListener("transitionend", () => {
      todo.remove();
    });
  }
  if (item.getAttribute("data-action") === "completed") {
    index = [...todo.parentNode.children].indexOf(todo);
    if (todo.classList.toggle("completed")) {
      SaveCompletedTodo(index);
      UpdateTitle(false);
    } else {
      DeleteCompletedTodo(index);
      UpdateTitle(true);
    }
  }
}
function FilterTodo(event) {
  const todos = todoList.childNodes;
  todos.forEach((todoItem) => {
    switch (event.target.value) {
      case "all":
        todoItem.style.display = "flex";
        break;
      case "completed":
        if (todoItem.classList.contains("completed")) {
          todoItem.style.display = "flex";
        } else {
          todoItem.style.display = "none";
        }
        break;
      case "uncompleted":
        if (todoItem.classList.contains("completed")) {
          todoItem.style.display = "none";
        } else {
          todoItem.style.display = "flex";
        }
        break;
    }
  });
}
function SaveTodo(todoValue) {
  let todos = [];

  if (localStorage.getItem("todos")) {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todoValue);
  localStorage.setItem("todos", JSON.stringify(todos));
}
function DeleteTodo(todoTarget) {
  let todos = [];

  if (localStorage.getItem("todos")) {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  const todoindex = todoTarget.children[0].innerText;
  todos.splice(todos.indexOf(todoindex), 1);

  localStorage.setItem("todos", JSON.stringify(todos));
}
function SaveCompletedTodo(todoIndex) {
  let indexes = [];

  if (localStorage.getItem("completeds")) {
    indexes = JSON.parse(localStorage.getItem("completeds"));
  }
  indexes.push(todoIndex);
  localStorage.setItem("completeds", JSON.stringify(indexes));
}
function DeleteCompletedTodo(todoIndex) {
  let indexes = [];
  if (localStorage.getItem("completeds")) {
    indexes = JSON.parse(localStorage.getItem("completeds"));
  }
  indexes.splice(indexes.indexOf(todoIndex), 1);

  localStorage.setItem("completeds", JSON.stringify(indexes));
}
function GetTodos() {
  let todos = [];
  let completeds = [];

  if (localStorage.getItem("todos")) {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  if (localStorage.getItem("completeds")) {
    completeds = JSON.parse(localStorage.getItem("completeds"));
    document.title = `${todos.length - completeds.length} Open tasks`;
  } else {
    document.title = `0 Open task`;
  }
  todos.forEach((todoItem, index) => {
    if (completeds.indexOf(index) !== -1) {
      todoList.appendChild(CreateTodoDiv(todoItem, true));
    } else {
      todoList.appendChild(CreateTodoDiv(todoItem));
    }
  });
}

/* Events */
document.addEventListener("DOMContentLoaded", GetTodos);
todoButton.addEventListener("click", AddTodo);
todoList.addEventListener("click", HandlerActions);
filterOption.addEventListener("change", FilterTodo);
