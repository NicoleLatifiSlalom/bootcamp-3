// Local storage adapter for tasks
// Provides CRUD operations while maintaining localStorage as the data source

const STORAGE_KEY = 'todo-tasks';

// Generate a unique ID for new tasks
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Load tasks from localStorage
export const loadTasks = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const tasks = JSON.parse(stored);
    if (!Array.isArray(tasks)) return [];
    
    // Filter out any malformed tasks
    return tasks.filter(task => 
      task && 
      typeof task.id !== 'undefined' && 
      typeof task.title === 'string' &&
      task.title.trim().length > 0
    );
  } catch (error) {
    console.warn('Failed to load tasks from localStorage:', error);
    return [];
  }
};

// Save tasks to localStorage
export const saveTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
    throw error;
  }
};

// Create a new task
export const createTask = (taskData) => {
  const tasks = loadTasks();
  
  // Normalize due_date to YYYY-MM-DD or null
  let due_date = taskData.due_date;
  if (due_date && !/^\d{4}-\d{2}-\d{2}$/.test(due_date)) {
    try {
      const date = new Date(due_date);
      if (isNaN(date.getTime())) {
        due_date = null;
      } else {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        due_date = `${year}-${month}-${day}`;
      }
    } catch {
      due_date = null;
    }
  }
  
  const newTask = {
    id: generateId(),
    title: taskData.title.trim(),
    description: taskData.description || '',
    due_date: due_date || null,
    priority: taskData.priority || 'P3',
    completed: false,
    created_at: new Date().toISOString()
  };
  
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

// Update an existing task
export const updateTask = (id, updates) => {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    throw new Error(`Task with id ${id} not found`);
  }
  
  // Normalize due_date if provided
  if (updates.due_date !== undefined) {
    let due_date = updates.due_date;
    if (due_date && !/^\d{4}-\d{2}-\d{2}$/.test(due_date)) {
      try {
        const date = new Date(due_date);
        if (isNaN(date.getTime())) {
          due_date = null;
        } else {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          due_date = `${year}-${month}-${day}`;
        }
      } catch {
        due_date = null;
      }
    }
    updates.due_date = due_date;
  }
  
  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  saveTasks(tasks);
  return tasks[taskIndex];
};

// Delete a task
export const deleteTask = (id) => {
  const tasks = loadTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  
  if (filteredTasks.length === tasks.length) {
    throw new Error(`Task with id ${id} not found`);
  }
  
  saveTasks(filteredTasks);
  return true;
};

// List all tasks
export const listTasks = () => {
  return loadTasks();
};