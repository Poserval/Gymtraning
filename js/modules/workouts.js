// ==================== МОДУЛЬ ТРЕНИРОВОК ====================
let editingWorkoutIndex = null;
let dragStartIndex = null;

function initWorkouts() {
    loadWorkouts();
    renderWorkoutsList();
    
    const backBtn = document.getElementById('back-to-calendar-from-workouts');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.showPage('calendar');
        });
    }
    
    const addBtn = document.getElementById('add-workout-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            openWorkoutModal();
        });
    }
    
    setupWorkoutModal();
    setupWorkoutMenu();
}

function renderWorkoutsList() {
    const workoutsList = document.getElementById('workouts-list');
    const emptyPlaceholder = document.getElementById('empty-workouts');
    const workoutsData = getWorkouts();
    
    if (!workoutsList || !emptyPlaceholder) return;
    
    if (workoutsData.length === 0) {
        workoutsList.style.display = 'none';
        emptyPlaceholder.style.display = 'block';
        return;
    }
    
    workoutsList.style.display = 'flex';
    emptyPlaceholder.style.display = 'none';
    
    const dayNames = {
        'monday': 'Понедельник',
        'tuesday': 'Вторник',
        'wednesday': 'Среда',
        'thursday': 'Четверг',
        'friday': 'Пятница',
        'saturday': 'Суббота',
        'sunday': 'Воскресенье',
        'any': 'Любой день'
    };
    
    workoutsList.innerHTML = workoutsData.map((workout, index) => `
        <div class="workout-card" data-index="${index}" draggable="true">
            <div class="drag-handle">
                <div class="drag-dots-row"><div class="drag-dot"></div><div class="drag-dot"></div></div>
                <div class="drag-dots-row"><div class="drag-dot"></div><div class="drag-dot"></div></div>
                <div class="drag-dots-row"><div class="drag-dot"></div><div class="drag-dot"></div></div>
            </div>
            <div class="workout-card-content">
                <div class="workout-day-badge ${workout.day === 'any' ? 'any-day' : ''}">
                    ${dayNames[workout.day]}
                </div>
                <div class="workout-name">${escapeHtml(workout.name)}</div>
            </div>
            <button class="workout-menu-btn" data-index="${index}">
                <div class="menu-dot"></div><div class="menu-dot"></div><div class="menu-dot"></div>
            </button>
        </div>
    `).join('');
    
    setupDragAndDrop();
    setupWorkoutCardMenus();
    
    document.querySelectorAll('.workout-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.workout-menu-btn') && !e.target.closest('.drag-handle')) {
                const index = parseInt(card.dataset.index);
                openWorkoutDetail(index);
            }
        });
    });
}

function openWorkoutDetail(index) {
    const workoutsData = getWorkouts();
    const workout = workoutsData[index];
    if (!workout) return;
    
    const dayBadge = document.getElementById('detail-day-badge');
    const workoutName = document.getElementById('detail-workout-name');
    
    const shortDayNames = {
        'monday': 'Пн', 'tuesday': 'Вт', 'wednesday': 'Ср',
        'thursday': 'Чт', 'friday': 'Пт', 'saturday': 'Сб',
        'sunday': 'Вс', 'any': 'Любой'
    };
    
    if (dayBadge) {
        dayBadge.textContent = shortDayNames[workout.day] || 'Любой';
        if (workout.day === 'any') {
            dayBadge.classList.add('any-day');
        } else {
            dayBadge.classList.remove('any-day');
        }
    }
    
    if (workoutName) {
        workoutName.textContent = workout.name;
    }
    
    window.showPage('workout-detail');
}

function setupDragAndDrop() {
    const cards = document.querySelectorAll('.workout-card');
    let dragOverIndex = null;
    
    cards.forEach(card => {
        card.setAttribute('draggable', 'true');
        
        card.addEventListener('dragstart', (e) => {
            dragStartIndex = parseInt(card.dataset.index);
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
        
        card.addEventListener('dragend', (e) => {
            card.classList.remove('dragging');
            if (dragOverIndex !== null && dragStartIndex !== null && dragStartIndex !== dragOverIndex) {
                const workoutsData = getWorkouts();
                const [movedItem] = workoutsData.splice(dragStartIndex, 1);
                workoutsData.splice(dragOverIndex, 0, movedItem);
                saveWorkouts(workoutsData);
            }
            dragStartIndex = null;
            dragOverIndex = null;
        });
        
        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            const targetIndex = parseInt(card.dataset.index);
            if (targetIndex !== dragOverIndex) {
                dragOverIndex = targetIndex;
            }
        });
    });
}

function setupWorkoutCardMenus() {
    const menuBtns = document.querySelectorAll('.workout-menu-btn');
    menuBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            showWorkoutMenu(btn, index);
        });
    });
}

function showWorkoutMenu(button, index) {
    const menu = document.getElementById('workout-menu');
    if (!menu) return;
    
    editingWorkoutIndex = index;
    const rect = button.getBoundingClientRect();
    
    menu.style.display = 'block';
    menu.style.position = 'fixed';
    menu.style.top = rect.bottom + 5 + 'px';
    menu.style.right = (window.innerWidth - rect.right) + 'px';
}

function setupWorkoutMenu() {
    const menu = document.getElementById('workout-menu');
    const editBtn = document.getElementById('menu-edit');
    const copyBtn = document.getElementById('menu-copy');
    const deleteBtn = document.getElementById('menu-delete');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            if (editingWorkoutIndex !== null) {
                closeWorkoutMenu();
                openEditModal(editingWorkoutIndex);
            }
        });
    }
    
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (editingWorkoutIndex !== null) {
                copyWorkoutInStorage(editingWorkoutIndex);
                closeWorkoutMenu();
                renderWorkoutsList();
            }
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (editingWorkoutIndex !== null && confirm('Удалить тренировку?')) {
                deleteWorkoutFromStorage(editingWorkoutIndex);
                closeWorkoutMenu();
                renderWorkoutsList();
            }
        });
    }
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.workout-menu-btn') && !e.target.closest('#workout-menu')) {
            closeWorkoutMenu();
        }
    });
}

function closeWorkoutMenu() {
    const menu = document.getElementById('workout-menu');
    if (menu) menu.style.display = 'none';
    editingWorkoutIndex = null;
}

function openWorkoutModal() {
    const modal = document.getElementById('workout-modal');
    const modalTitle = document.getElementById('modal-title');
    const workoutName = document.getElementById('workout-name');
    const confirmBtn = document.getElementById('confirm-workout-btn');
    
    if (modal) {
        if (modalTitle) modalTitle.textContent = 'Создать тренировку';
        if (workoutName) workoutName.value = '';
        const daySelect = document.getElementById('workout-day');
        if (daySelect) daySelect.value = 'any';
        
        const oldHandler = confirmBtn.onclick;
        confirmBtn.onclick = () => {
            const name = workoutName ? workoutName.value.trim() : '';
            const daySelect = document.getElementById('workout-day');
            const day = daySelect ? daySelect.value : 'any';
            
            if (addWorkoutToStorage(name, day)) {
                modal.style.display = 'none';
                renderWorkoutsList();
            }
            confirmBtn.onclick = oldHandler;
        };
        
        modal.style.display = 'flex';
    }
}

function openEditModal(index) {
    const workoutsData = getWorkouts();
    const workout = workoutsData[index];
    if (!workout) return;
    
    const modal = document.getElementById('workout-modal');
    const modalTitle = document.getElementById('modal-title');
    const nameInput = document.getElementById('workout-name');
    const daySelect = document.getElementById('workout-day');
    const confirmBtn = document.getElementById('confirm-workout-btn');
    
    if (modalTitle) modalTitle.textContent = 'Редактировать тренировку';
    if (nameInput) nameInput.value = workout.name;
    if (daySelect) daySelect.value = workout.day;
    
    const oldHandler = confirmBtn.onclick;
    confirmBtn.onclick = () => {
        const newName = nameInput ? nameInput.value.trim() : '';
        const newDay = daySelect ? daySelect.value : 'any';
        
        if (newName && updateWorkoutInStorage(index, newName, newDay)) {
            modal.style.display = 'none';
            renderWorkoutsList();
        }
        confirmBtn.onclick = oldHandler;
    };
    
    modal.style.display = 'flex';
}

function setupWorkoutModal() {
    const modal = document.getElementById('workout-modal');
    const cancelBtn = document.getElementById('cancel-workout-btn');
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

window.initWorkouts = initWorkouts;
window.renderWorkoutsList = renderWorkoutsList;
window.openWorkoutDetail = openWorkoutDetail;
window.openWorkoutPage = (date) => {
    window.selectedDate = date;
    window.showPage('workouts');
};
