document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const errorMessage = document.getElementById("error-message");
  const todoList = document.getElementById("todo-list");
  const openCount = document.getElementById("open-count");
  const showAllButton = document.getElementById("show-all");
  const showActiveButton = document.getElementById("show-active");
  const showCompletedButton = document.getElementById("show-completed");

  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  renderTodos();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const todoText = input.value.trim();

    if (!validateInput(todoText)) return;

    todos.push({ text: todoText, completed: false });
    saveAndRender();
    input.value = "";
  });

  function renderTodos(filter = "all") {
    todoList.innerHTML = "";
    const filteredTodos = todos.filter(todo => 
      filter === "all" || (filter === "active" && !todo.completed) || (filter === "completed" && todo.completed)
    );

    filteredTodos.forEach((todo, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="${todo.completed ? 'completed' : ''}">${todo.text}</span>
        <div class="button-container">
          <button class="complete">${todo.completed ? "Undo" : "Complete"}</button>
          <button class="delete">Delete</button>
        </div>
      `;

      li.querySelector(".complete").addEventListener("click", () => {
        todo.completed = !todo.completed;
        saveAndRender();
      });

      li.querySelector(".delete").addEventListener("click", () => {
        todos.splice(index, 1);
        saveAndRender();
      });

      todoList.appendChild(li);
    });

    updateCounter();
  }

  function updateCounter() {
    openCount.textContent = todos.filter(todo => !todo.completed).length;
  }

  function saveAndRender() {
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
  }

  function validateInput(todoText) {
    if (todoText === "") {
      showError("Task cannot be blank.");
      return false;
    }
    if (todoText.length < 3) {
      showError("Task must be at least 3 characters long.");
      return false;
    }
    return true;
  }

  function showError(message) {
    errorMessage.textContent = message;
    input.style.borderColor = "red";
    setTimeout(() => {
      errorMessage.textContent = "";
      input.style.borderColor = "#ccc";
    }, 3000);
  }

  showAllButton.addEventListener("click", () => renderTodos("all"));
  showActiveButton.addEventListener("click", () => renderTodos("active"));
  showCompletedButton.addEventListener("click", () => renderTodos("completed"));
});
