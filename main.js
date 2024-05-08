document.addEventListener('DOMContentLoaded', loadTasks);
document.querySelector('button').addEventListener('click', addTask);

function saveTasksToLocalStorage(taskList) {
    localStorage.setItem('tasks', JSON.stringify(taskList));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task.description, task.timestamp));
}

function addTask() {
    const taskInput = document.getElementById('add-item');
    const description = taskInput.value;
    const timestamp = new Date().toISOString();
    if (description) {
        addTaskToDOM(description, timestamp);
        taskInput.value = '';

        const taskList = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.push({ description, timestamp });
        saveTasksToLocalStorage(taskList);
    } else {
        alert('Please enter a task.');
    }
}

function addTaskToDOM(description, timestamp) {
    const taskList = document.getElementById('todo-list');
    const taskElement = document.createElement('div');
    taskElement.className = 'todo-task';
    taskElement.innerHTML = `
        <div class="task-left">
            <input type="checkbox" class="task-check">
            <p class="task-title">${description}</p>
        </div>
        <div class="task-right">
            <img src="assets/trash.svg" onclick="removeTask('${timestamp}')" class="delete-icon">
        </div>
    `;

    const checkbox = taskElement.querySelector('.task-check');
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            moveTaskToChecked(taskElement, timestamp);
        } else {
            moveTaskToTodoList(taskElement, timestamp);
        }
    });

    taskList.appendChild(taskElement);
}

function moveTaskToChecked(taskElement, timestamp) {
    const checkedList = document.getElementById('checked-list');
    taskElement.querySelector('.task-check').checked = true;
    checkedList.appendChild(taskElement);
    updateTaskStatus(timestamp, true);
}

function moveTaskToTodoList(taskElement, timestamp) {
    const todoList = document.getElementById('todo-list');
    taskElement.querySelector('.task-check').checked = false;
    todoList.appendChild(taskElement);

    updateTaskStatus(timestamp, false);
}

function updateTaskStatus(timestamp, isCompleted) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.timestamp === timestamp);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = isCompleted;
    }
    saveTasksToLocalStorage(tasks);
}

function removeTask(timestamp) {
    const todoList = document.getElementById('todo-list');
    const checkedList = document.getElementById('checked-list');
    const tasks = Array.from(todoList.children).concat(Array.from(checkedList.children));
    
    for (let task of tasks) {
        if (task.querySelector('.delete-icon').getAttribute('onclick').includes(timestamp)) {
            task.parentNode.removeChild(task);
            break;
        }
    }

    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    const filteredTasks = storedTasks.filter(task => task.timestamp !== timestamp);
    saveTasksToLocalStorage(filteredTasks);
}
