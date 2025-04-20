const API_URL = 'http://localhost:3000/tasks';

const form = document.getElementById('task-form');
const titleInput = document.getElementById('title');
const dateInput = document.getElementById('date');
const descInput = document.getElementById('description');
const container = document.getElementById('tasks-container');

let editingTaskId = null;

const fetchTasks = async () => {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  renderTasks(tasks);
};

const renderTasks = (tasks) => {
  container.innerHTML = '';
  tasks.forEach(task => {
    const taskEl = document.createElement('div');
    taskEl.className = `task ${task.completed ? 'completed' : ''}`;
    taskEl.innerHTML = `
      <p><strong>${task.title}</strong></p>
      <p>${task.date || ''}</p>
      <p>${task.description || ''}</p>
      <button onclick="toggleComplete('${task._id}')">${task.completed ? 'Undo' : 'Complete'}</button>
      <button onclick="editTask('${task._id}')">Edit</button>
      <button onclick="deleteTask('${task._id}')">Delete</button>
    `;
    container.appendChild(taskEl);
  });
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const taskData = {
    title: titleInput.value,
    date: dateInput.value,
    description: descInput.value
  };

  if (editingTaskId) {
    await fetch(`${API_URL}/${editingTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    editingTaskId = null;
  } else {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
  }

  form.reset();
  fetchTasks();
});

window.editTask = async (id) => {
  const res = await fetch(`${API_URL}`);
  const tasks = await res.json();
  const task = tasks.find(t => t._id === id);

  titleInput.value = task.title;
  dateInput.value = task.date;
  descInput.value = task.description;
  editingTaskId = id;
};

window.deleteTask = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchTasks();
};

window.toggleComplete = async (id) => {
  const res = await fetch(`${API_URL}`);
  const tasks = await res.json();
  const task = tasks.find(t => t._id === id);
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...task, completed: !task.completed }),
  });
  fetchTasks();
};

fetchTasks();
const updateDateTime = () => {
  const now = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  };const updateDateTime = () => {
  const now = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  };
  const formatted = now.toLocaleString(undefined, options);
  document.getElementById('datetime').textContent = formatted;
};

setInterval(updateDateTime, 1000);
updateDateTime(); // initial call

  const formatted = now.toLocaleString(undefined, options);
  document.getElementById('datetime').textContent = formatted;
};

setInterval(updateDateTime, 1000);
updateDateTime(); // initial call
