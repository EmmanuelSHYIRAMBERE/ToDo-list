const API_BASE_URL = "http://localhost:8080/api/todos";
let todos = [];

window.addEventListener("load", async () => {
  const nameInput = document.querySelector("#name");
  const newTodoForm = document.querySelector("#new-todo-form");

  // Keep username in localStorage as it's user preference
  const username = localStorage.getItem("username") || "";
  nameInput.value = username;

  nameInput.addEventListener("change", (e) => {
    localStorage.setItem("username", e.target.value);
  });

  // Load initial todos
  await fetchTodos();

  newTodoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const todo = {
      content: e.target.elements.content.value,
      category: e.target.elements.category.value,
      done: false,
    };

    await createTodo(todo);
    e.target.reset();
  });
});

async function fetchTodos() {
  try {
    console.log("Fetching todos...");
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", API_BASE_URL, true);
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        todos = JSON.parse(xmlHttp.responseText);
        DisplayTodos();
      }
    };
    xmlHttp.send(null);
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}

async function createTodo(todo) {
  try {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", API_BASE_URL, true);
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        const newTodo = JSON.parse(xmlHttp.responseText);
        todos.push(newTodo);
        DisplayTodos();
      }
    };
    xmlHttp.send(JSON.stringify(todo));
  } catch (error) {
    console.error("Error creating todo:", error);
  }
}

async function updateTodo(id, updates) {
  try {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("PUT", `${API_BASE_URL}/${id}`, true);
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        const updatedTodo = JSON.parse(xmlHttp.responseText);
        todos = todos.map((todo) => (todo.id === id ? updatedTodo : todo));
        DisplayTodos();
      }
    };
    xmlHttp.send(JSON.stringify(updates));
  } catch (error) {
    console.error("Error updating todo:", error);
  }
}

async function deleteTodo(id) {
  try {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("DELETE", `${API_BASE_URL}/${id}`, true);
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        todos = todos.filter((todo) => todo.id !== id);
        DisplayTodos();
      }
    };
    xmlHttp.send(null);
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

function DisplayTodos() {
  const todoList = document.querySelector("#todo-list");
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");

    const label = document.createElement("label");
    const input = document.createElement("input");
    const span = document.createElement("span");
    const content = document.createElement("div");
    const actions = document.createElement("div");
    const edit = document.createElement("button");
    const deleteButton = document.createElement("button");

    input.type = "checkbox";
    input.checked = todo.done;
    span.classList.add("bubble");

    if (todo.category == "personal") {
      span.classList.add("personal");
    } else {
      span.classList.add("business");
    }

    content.classList.add("todo-content");
    actions.classList.add("actions");
    edit.classList.add("edit");
    deleteButton.classList.add("delete");

    content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
    edit.innerHTML = "Edit";
    deleteButton.innerHTML = "Delete";

    label.appendChild(input);
    label.appendChild(span);
    actions.appendChild(edit);
    actions.appendChild(deleteButton);
    todoItem.appendChild(label);
    todoItem.appendChild(content);
    todoItem.appendChild(actions);

    todoList.appendChild(todoItem);

    if (todo.done) {
      todoItem.classList.add("done");
    }

    input.addEventListener("click", async (e) => {
      const updates = { ...todo, done: e.target.checked };
      await updateTodo(todo.id, updates);
    });

    edit.addEventListener("click", (e) => {
      const input = content.querySelector("input");
      input.removeAttribute("readonly");
      input.focus();
      input.addEventListener("blur", async (e) => {
        input.setAttribute("readonly", true);
        const updates = { ...todo, content: e.target.value };
        await updateTodo(todo.id, updates);
      });
    });

    deleteButton.addEventListener("click", async (e) => {
      await deleteTodo(todo.id);
    });
  });
}
