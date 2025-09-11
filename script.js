// Global state management
const AppState = {
    user: null,
    expenses: [],
    tasks: [],
    budget: 0
};

// API Configuration
const API_BASE = '/.netlify/functions';

// Utility functions
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// API functions
async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    try {
        const response = await fetch(`${API_BASE}/${endpoint}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication functions
async function login(username, password) {
    try {
        const response = await apiCall('auth', {
            method: 'POST',
            body: JSON.stringify({ action: 'login', username, password })
        });

        if (response.success) {
            localStorage.setItem('token', response.token);
            AppState.user = response.user;
            showDashboard();
            showNotification('Login successful!', 'success');
            loadUserData();
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function signup(username, password) {
    try {
        const response = await apiCall('auth', {
            method: 'POST',
            body: JSON.stringify({ action: 'signup', username, password })
        });

        if (response.success) {
            localStorage.setItem('token', response.token);
            AppState.user = response.user;
            showDashboard();
            showNotification('Account created successfully!', 'success');
            loadUserData();
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function logout() {
    localStorage.removeItem('token');
    AppState.user = null;
    AppState.expenses = [];
    AppState.tasks = [];
    AppState.budget = 0;
    showAuthSection();
    showNotification('Logged out successfully', 'info');
}

// Data loading functions
async function loadUserData() {
    try {
        await Promise.all([
            loadExpenses(),
            loadTasks(),
            loadBudget()
        ]);
        updateDashboardStats();
    } catch (error) {
        showNotification('Error loading user data', 'error');
    }
}

async function loadExpenses() {
    try {
        const response = await apiCall('expenses');
        AppState.expenses = response.expenses || [];
        renderExpenses();
    } catch (error) {
        console.error('Error loading expenses:', error);
    }
}

async function loadTasks() {
    try {
        const response = await apiCall('tasks');
        AppState.tasks = response.tasks || [];
        renderTasks();
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

async function loadBudget() {
    try {
        const response = await apiCall('budget');
        AppState.budget = response.budget || 0;
        updateBudgetDisplay();
    } catch (error) {
        console.error('Error loading budget:', error);
    }
}

// Expense functions
async function addExpense(name, amount, date, description) {
    try {
        const response = await apiCall('expenses', {
            method: 'POST',
            body: JSON.stringify({ name, amount, date, description })
        });

        if (response.success) {
            AppState.expenses.push(response.expense);
            renderExpenses();
            updateDashboardStats();
            showNotification('Expense added successfully!', 'success');
            closeModal('addExpenseModal');
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function removeExpense(expenseId) {
    try {
        const response = await apiCall(`expenses/${expenseId}`, {
            method: 'DELETE'
        });

        if (response.success) {
            AppState.expenses = AppState.expenses.filter(e => e.id !== expenseId);
            renderExpenses();
            updateDashboardStats();
            showNotification('Expense removed successfully!', 'success');
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function updateBudget(newBudget) {
    try {
        const response = await apiCall('budget', {
            method: 'PUT',
            body: JSON.stringify({ budget: newBudget })
        });

        if (response.success) {
            AppState.budget = newBudget;
            updateBudgetDisplay();
            updateDashboardStats();
            showNotification('Budget updated successfully!', 'success');
            closeModal('updateBudgetModal');
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Task functions
async function addTask(name, description, startDate, endDate) {
    try {
        const response = await apiCall('tasks', {
            method: 'POST',
            body: JSON.stringify({
                name,
                description,
                start_date: startDate,
                end_date: endDate,
                status: 'ongoing'
            })
        });

        if (response.success) {
            AppState.tasks.push(response.task);
            renderTasks();
            updateDashboardStats();
            showNotification('Task added successfully!', 'success');
            closeModal('addTaskModal');
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function updateTaskStatus(taskId, newStatus) {
    try {
        const response = await apiCall(`tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
        });

        if (response.success) {
            const task = AppState.tasks.find(t => t.id === taskId);
            if (task) {
                task.status = newStatus;
                renderTasks();
                updateDashboardStats();
                showNotification('Task status updated!', 'success');
            }
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function removeTask(taskId) {
    try {
        const response = await apiCall(`tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (response.success) {
            AppState.tasks = AppState.tasks.filter(t => t.id !== taskId);
            renderTasks();
            updateDashboardStats();
            showNotification('Task removed successfully!', 'success');
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// UI Rendering functions
function renderExpenses() {
    const container = document.getElementById('expensesList');
    
    if (AppState.expenses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No expenses yet</h3>
                <p>Start tracking your expenses by adding your first one!</p>
                <button class="btn btn-primary" onclick="openModal('addExpenseModal')">Add Your First Expense</button>
            </div>
        `;
        return;
    }

    container.innerHTML = AppState.expenses.map(expense => `
        <div class="expense-item">
            <div class="expense-info">
                <h4>${expense.name}</h4>
                <p>${formatDate(expense.date)}</p>
                ${expense.description ? `<p>${expense.description}</p>` : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span class="expense-amount">${formatCurrency(expense.amount)}</span>
                <button class="btn btn-danger btn-small" onclick="removeExpense(${expense.id})">Remove</button>
            </div>
        </div>
    `).join('');
}

function renderTasks(filter = 'all') {
    const container = document.getElementById('tasksList');
    let filteredTasks = AppState.tasks;

    if (filter !== 'all') {
        filteredTasks = AppState.tasks.filter(task => task.status === filter);
    }

    if (filteredTasks.length === 0) {
        const message = filter === 'all' ? 
            'No tasks yet. Add your first task to get started!' : 
            `No ${filter} tasks found.`;
        
        container.innerHTML = `
            <div class="empty-state">
                <h3>${message}</h3>
                ${filter === 'all' ? '<button class="btn btn-primary" onclick="openModal(\'addTaskModal\')">Add Your First Task</button>' : ''}
            </div>
        `;
        return;
    }

    container.innerHTML = filteredTasks.map(task => `
        <div class="task-item">
            <div class="task-header">
                <div class="task-info">
                    <h4>${task.name}</h4>
                    <p>${task.description}</p>
                    <div class="task-dates">
                        Start: ${formatDate(task.start_date)} | End: ${formatDate(task.end_date)}
                    </div>
                </div>
                <span class="task-status ${task.status}">${task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
            </div>
            <div class="task-actions">
                <select onchange="updateTaskStatus(${task.id}, this.value)" class="btn-small">
                    <option value="${task.status}" selected>Change Status</option>
                    <option value="ongoing" ${task.status === 'ongoing' ? 'disabled' : ''}>Ongoing</option>
                    <option value="completed" ${task.status === 'completed' ? 'disabled' : ''}>Completed</option>
                    <option value="paused" ${task.status === 'paused' ? 'disabled' : ''}>Paused</option>
                    <option value="abandoned" ${task.status === 'abandoned' ? 'disabled' : ''}>Abandoned</option>
                </select>
                <button class="btn btn-danger btn-small" onclick="removeTask(${task.id})">Remove</button>
            </div>
        </div>
    `).join('');
}

function updateBudgetDisplay() {
    const totalSpent = AppState.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = AppState.budget - totalSpent;
    
    document.getElementById('currentBudget').textContent = AppState.budget.toFixed(2);
    document.getElementById('totalSpent').textContent = totalSpent.toFixed(2);
    
    const statusElement = document.getElementById('budgetStatus');
    if (remaining >= 0) {
        statusElement.textContent = `$${remaining.toFixed(2)} remaining`;
        statusElement.className = 'budget-status within';
    } else {
        statusElement.textContent = `$${Math.abs(remaining).toFixed(2)} over budget`;
        statusElement.className = 'budget-status over';
    }
}

function updateDashboardStats() {
    const totalExpenses = AppState.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const budgetRemaining = AppState.budget - totalExpenses;
    const activeTasks = AppState.tasks.filter(task => task.status === 'ongoing').length;

    document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('budgetRemaining').textContent = formatCurrency(budgetRemaining);
    document.getElementById('activeTasks').textContent = activeTasks;
    
    if (AppState.user) {
        document.getElementById('welcomeMessage').textContent = `Welcome back, ${AppState.user.username}!`;
    }
}

// UI Control functions
function showAuthSection() {
    document.getElementById('authSection').style.display = 'flex';
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'inline-block';
    document.getElementById('signupBtn').style.display = 'inline-block';
    document.getElementById('logoutBtn').style.display = 'none';
}

function showDashboard() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('signupBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-block';
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    // Reset form
    const form = document.querySelector(`#${modalId} form`);
    if (form) form.reset();
}

function switchApp(appName) {
    // Update app buttons
    document.querySelectorAll('.app-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${appName}Btn`).classList.add('active');
    
    // Show/hide app content
    document.querySelectorAll('.app-content').forEach(content => content.style.display = 'none');
    document.getElementById(appName).style.display = 'block';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        // Verify token and load user data
        apiCall('auth', {
            method: 'POST',
            body: JSON.stringify({ action: 'verify' })
        })
        .then(response => {
            if (response.success) {
                AppState.user = response.user;
                showDashboard();
                loadUserData();
            } else {
                localStorage.removeItem('token');
                showAuthSection();
            }
        })
        .catch(error => {
            localStorage.removeItem('token');
            showAuthSection();
        });
    } else {
        showAuthSection();
    }

    // Auth tabs
    document.getElementById('loginTab').addEventListener('click', function() {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('signupForm').style.display = 'none';
        this.classList.add('active');
        document.getElementById('signupTab').classList.remove('active');
    });

    document.getElementById('signupTab').addEventListener('click', function() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('signupForm').style.display = 'block';
        this.classList.add('active');
        document.getElementById('loginTab').classList.remove('active');
    });

    // Auth forms
    document.getElementById('loginFormElement').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        login(username, password);
    });

    document.getElementById('signupFormElement').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('signupUsername').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        signup(username, password);
    });

    // Navigation buttons
    document.getElementById('loginBtn').addEventListener('click', function() {
        document.getElementById('loginTab').click();
    });

    document.getElementById('signupBtn').addEventListener('click', function() {
        document.getElementById('signupTab').click();
    });

    document.getElementById('logoutBtn').addEventListener('click', logout);

    // App switcher
    document.getElementById('expenseTrackerBtn').addEventListener('click', () => switchApp('expenseTracker'));
    document.getElementById('todoListBtn').addEventListener('click', () => switchApp('todoList'));

    // Expense tracker buttons
    document.getElementById('addExpenseBtn').addEventListener('click', () => openModal('addExpenseModal'));
    document.getElementById('updateBudgetBtn').addEventListener('click', () => {
        document.getElementById('newBudget').value = AppState.budget;
        openModal('updateBudgetModal');
    });

    // Todo list buttons
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        // Set default dates
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('taskStartDate').value = today;
        openModal('addTaskModal');
    });

    // Modal forms
    document.getElementById('addExpenseForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('expenseName').value;
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const date = document.getElementById('expenseDate').value;
        const description = document.getElementById('expenseDescription').value;
        addExpense(name, amount, date, description);
    });

    document.getElementById('updateBudgetForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const budget = parseFloat(document.getElementById('newBudget').value);
        updateBudget(budget);
    });

    document.getElementById('addTaskForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('taskName').value;
        const description = document.getElementById('taskDescription').value;
        const startDate = document.getElementById('taskStartDate').value;
        const endDate = document.getElementById('taskEndDate').value;
        addTask(name, description, startDate, endDate);
    });

    // Task filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderTasks(this.dataset.filter);
        });
    });

    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Set default date for expense form
    document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
});

// Export functions for global access
window.login = login;
window.signup = signup;
window.logout = logout;
window.addExpense = addExpense;
window.removeExpense = removeExpense;
window.updateBudget = updateBudget;
window.addTask = addTask;
window.updateTaskStatus = updateTaskStatus;
window.removeTask = removeTask;
window.openModal = openModal;
window.closeModal = closeModal;
window.switchApp = switchApp;