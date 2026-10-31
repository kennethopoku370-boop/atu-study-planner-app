document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskTitleInput = document.getElementById('taskTitle');
    const subjectNameInput = document.getElementById('subjectName');
    const taskListContainer = document.getElementById('taskList');
    const errorMsg = document.getElementById('errorMsg');

    // Load tasks from localStorage or initialize empty array
    let tasks = JSON.parse(localStorage.getItem('atu_study_tasks')) || [];

    function saveAndRender() {
        localStorage.setItem('atu_study_tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        taskListContainer.innerHTML = '';

        if (tasks.length === 0) {
            taskListContainer.innerHTML = `<div class="empty-state">No study tasks added yet. Add a task above to get started!</div>`;
            return;
        }

        tasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

            taskItem.innerHTML = `
                <div class="task-info">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task complete" data-index="${index}">
                    <div class="task-details">
                        <span class="task-title-text">${escapeHtml(task.title)}</span>
                        <span class="task-subject-text">${escapeHtml(task.subject || 'General Study')}</span>
                    </div>
                </div>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;

            taskListContainer.appendChild(taskItem);
        });
    }

    // Prevent XSS security issues with text rendering
    function escapeHtml(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    // Add task event listener
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = taskTitleInput.value.trim();
        const subject = subjectNameInput.value.trim();

        if (!title) {
            errorMsg.textContent = 'Please enter a valid task title before submitting.';
            taskTitleInput.focus();
            return;
        }

        errorMsg.textContent = '';
        
        tasks.push({
            title: title,
            subject: subject || 'General Study',
            completed: false
        });

        taskTitleInput.value = '';
        subjectNameInput.value = '';
        taskTitleInput.focus();

        saveAndRender();
    });

    // Handle checkbox toggle and delete actions via event delegation
    taskListContainer.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        if (index === null) return;

        if (e.target.type === 'checkbox') {
            tasks[index].completed = e.target.checked;
            saveAndRender();
        } else if (e.target.classList.contains('delete-btn')) {
            tasks.splice(index, 1);
            saveAndRender();
        }
    });

    // Initial render on page load
    renderTasks();
});