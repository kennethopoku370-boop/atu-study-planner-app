let tasks = JSON.parse(localStorage.getItem('atu_tasks')) || [];
let currentFilter = 'all';

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskCourseInput = document.getElementById('task-course');
const taskPriorityInput = document.getElementById('task-priority');
const taskDateInput = document.getElementById('task-date');
const taskList = document.getElementById('task-list');
const emptyMsg = document.getElementById('empty-msg');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Add Task
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = {
        id: Date.now(),
        title: taskTitleInput.value.trim(),
        course: taskCourseInput.value.trim(),
        priority: taskPriorityInput.value,
        date: taskDateInput.value,
        completed: false
    };

    tasks.push(newTask);
    saveAndRender();
    taskForm.reset();
});

// Render Tasks
function renderTasks() {
    taskList.innerHTML = '';
    const query = searchInput.value.toLowerCase();

    const filteredTasks = tasks.filter(task => {
        // Status filter
        if (currentFilter === 'active' && task.completed) return false;
        if (currentFilter === 'completed' && !task.completed) return false;

        // Search query filter
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchCourse = task.course.toLowerCase().includes(query);
        const matchPriority = task.priority.toLowerCase().includes(query);
        return matchTitle || matchCourse || matchPriority;
    });

    if (filteredTasks.length === 0) {
        emptyMsg.style.display = 'block';
    } else {
        emptyMsg.style.display = 'none';
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <div class="task-info ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                    <div>
                        <div class="task-title">${task.title}</div>
                        <div class="task-meta">${task.course} | ${task.priority} Priority ${task.date ? '| ' + task.date : ''}</div>
                    </div>
                </div>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            `;
            taskList.appendChild(li);
        });
    }
}

// Save & Render
function saveAndRender() {
    localStorage.setItem('atu_tasks', JSON.stringify(tasks));
    renderTasks();
}

// Toggle Complete
window.toggleTask = function(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveAndRender();
};

// Delete Task
window.deleteTask = function(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
};

// Filter Buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Clear Completed Tasks
clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveAndRender();
});

// Search functionality
searchInput.addEventListener('input', renderTasks);
clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    renderTasks();
});

// Initial Render
renderTasks();