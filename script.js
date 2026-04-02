// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let currentYear = 2026;
let currentMonthIndex = 3;
let monthsData = [];
let isFirstLoad = true;
let splashTimeout = null;
let isAppLoaded = false;
let selectedDate = null;
let currentPage = 'calendar';
let workouts = [];
let editingWorkoutIndex = null;
let dragStartIndex = null;
let currentWorkoutIndex = null;

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", () => {
    loadWorkouts();
    initCalendar();
    setupSplashScreen();
    setupNavigation();
    setupBottomNav();
    setupModal();
    setupWorkoutMenu();
});

// ==================== РАБОТА С ТРЕНИРОВКАМИ ====================

function loadWorkouts() {
    const savedWorkouts = localStorage.getItem('gym_workouts_list');
    if (savedWorkouts) {
        workouts = JSON.parse(savedWorkouts);
    } else {
        workouts = [];
    }
    renderWorkoutsList();
}

function saveWorkouts() {
    localStorage.setItem('gym_workouts_list', JSON.stringify(workouts));
    renderWorkoutsList();
}

function renderWorkoutsList() {
    const workoutsList = document.getElementById('workouts-list');
    const emptyPlaceholder = document.getElementById('empty-workouts');
    
    if (!workoutsList || !emptyPlaceholder) return;
    
    if (workouts.length === 0) {
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
    
    workoutsList.innerHTML = workouts.map((workout, index) => `
        <div class="workout-card" data-index="${index}" draggable="true">
            <div class="drag-handle">
                <div class="drag-dots-row">
                    <div class="drag-dot"></div>
                    <div class="drag-dot"></div>
                </div>
                <div class="drag-dots-row">
                    <div class="drag-dot"></div>
                    <div class="drag-dot"></div>
                </div>
                <div class="drag-dots-row">
                    <div class="drag-dot"></div>
                    <div class="drag-dot"></div>
                </div>
            </div>
            <div class="workout-card-content">
                <div class="workout-day-badge ${workout.day === 'any' ? 'any-day' : ''}">
                    ${dayNames[workout.day]}
                </div>
                <div class="workout-name">${escapeHtml(workout.name)}</div>
            </div>
            <button class="workout-menu-btn" data-index="${index}">
                <div class="menu-dot"></div>
                <div class="menu-dot"></div>
                <div class="menu-dot"></div>
            </button>
        </div>
    `).join('');
    
    setupDragAndDrop();
    setupWorkoutCardMenus();
    
    // Добавляем обработчик открытия деталей тренировки
    document.querySelectorAll('.workout-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Если клик не по кнопке меню
            if (!e.target.closest('.workout-menu-btn')) {
                const index = parseInt(card.dataset.index);
                openWorkoutDetail(index);
            }
        });
    });
}

function openWorkoutDetail(index) {
    currentWorkoutIndex = index;
    const workout = workouts[index];
    if (!workout) return;
    
    // Обновляем данные на странице деталей
    const dayBadge = document.getElementById('detail-day-badge');
    const workoutName = document.getElementById('detail-workout-name');
    
    const shortDayNames = {
        'monday': 'Пн',
        'tuesday': 'Вт',
        'wednesday': 'Ср',
        'thursday': 'Чт',
        'friday': 'Пт',
        'saturday': 'Сб',
        'sunday': 'Вс',
        'any': 'Любой'
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
    
    // Показываем страницу деталей
    showPage('workout-detail');
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
                const [movedItem] = workouts.splice(dragStartIndex, 1);
                workouts.splice(dragOverIndex, 0, movedItem);
                saveWorkouts();
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
                copyWorkout(editingWorkoutIndex);
                closeWorkoutMenu();
            }
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (editingWorkoutIndex !== null && confirm('Удалить тренировку?')) {
                workouts.splice(editingWorkoutIndex, 1);
                saveWorkouts();
                closeWorkoutMenu();
            }
        });
    }
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.workout-menu-btn') && !e.target.closest('#workout-menu')) {
            closeWorkoutMenu();
        }
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

function closeWorkoutMenu() {
    const menu = document.getElementById('workout-menu');
    if (menu) {
        menu.style.display = 'none';
    }
    editingWorkoutIndex = null;
}

function copyWorkout(index) {
    const original = workouts[index];
    const copy = {
        ...original,
        id: Date.now(),
        name: original.name + ' (копия)'
    };
    workouts.splice(index + 1, 0, copy);
    saveWorkouts();
}

function openEditModal(index) {
    const workout = workouts[index];
    if (!workout) return;
    
    const modal = document.getElementById('workout-modal');
    const modalTitle = document.getElementById('modal-title');
    const nameInput = document.getElementById('workout-name');
    const daySelect = document.getElementById('workout-day');
    const confirmBtn = document.getElementById('confirm-workout-btn');
    
    if (modalTitle) modalTitle.textContent = 'Редактировать тренировку';
    if (nameInput) nameInput.value = workout.name;
    if (daySelect) daySelect.value = workout.day;
    
    const oldConfirmHandler = confirmBtn.onclick;
    
    confirmBtn.onclick = () => {
        const newName = nameInput ? nameInput.value.trim() : '';
        const newDay = daySelect ? daySelect.value : 'any';
        
        if (newName) {
            workouts[index].name = newName;
            workouts[index].day = newDay;
            saveWorkouts();
            if (modal) modal.style.display = 'none';
            confirmBtn.onclick = oldConfirmHandler;
        } else {
            alert('Введите название тренировки');
        }
    };
    
    if (modal) modal.style.display = 'flex';
}

function addWorkout(name, day) {
    if (!name || name.trim() === '') {
        alert('Введите название тренировки');
        return false;
    }
    
    workouts.push({
        id: Date.now(),
        name: name.trim(),
        day: day,
        createdAt: new Date().toISOString(),
        exercises: []
    });
    
    saveWorkouts();
    return true;
}

// ==================== ФУНКЦИИ ЗАСТАВКИ ====================

function setupSplashScreen() {
    const splash = document.getElementById("splash-screen");
    const pageCalendar = document.getElementById("page-calendar");
    
    if (!splash || !pageCalendar) return;
    
    splashTimeout = setTimeout(() => {
        hideSplashScreen();
    }, 5000);
    
    splash.addEventListener('click', () => {
        hideSplashScreen();
    });
}

function hideSplashScreen() {
    if (isAppLoaded) return;
    isAppLoaded = true;
    
    if (splashTimeout) {
        clearTimeout(splashTimeout);
        splashTimeout = null;
    }
    
    const splash = document.getElementById("splash-screen");
    const pageCalendar = document.getElementById("page-calendar");
    
    if (splash && pageCalendar) {
        splash.style.opacity = "0";
        setTimeout(() => {
            splash.style.display = "none";
            pageCalendar.style.display = "block";
            
            setTimeout(() => {
                setInitialPositionToCurrentMonth();
                isFirstLoad = false;
            }, 50);
        }, 300);
    }
}

// ==================== ФУНКЦИИ НАВИГАЦИИ ====================

function setupNavigation() {
    // Назад из списка тренировок в календарь
    const backBtn = document.getElementById('back-to-calendar-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showPage('calendar');
        });
    }
    
    // Назад из деталей тренировки в список тренировок
    const backToWorkoutListBtn = document.getElementById('back-to-workout-list-btn');
    if (backToWorkoutListBtn) {
        backToWorkoutListBtn.addEventListener('click', () => {
            showPage('workout');
        });
    }
    
    // Кнопка "Выбери упражнение" (пока без функционала)
    const addExerciseBtn = document.getElementById('add-exercise-btn');
    if (addExerciseBtn) {
        addExerciseBtn.addEventListener('click', () => {
            alert('Функционал добавления упражнений в разработке');
        });
    }
    
    // Обработка кнопки "Назад" на телефоне (Android)
    document.addEventListener('backbutton', (e) => {
        if (currentPage === 'workout-detail') {
            e.preventDefault();
            showPage('workout');
        } else if (currentPage === 'workout') {
            e.preventDefault();
            showPage('calendar');
        }
    }, false);
}

function setupBottomNav() {
    const navTraining = document.getElementById('nav-training');
    const navExercises = document.getElementById('nav-exercises');
    const navProgress = document.getElementById('nav-progress');
    
    if (navTraining) {
        navTraining.addEventListener('click', () => {
            showPage('workout');
            updateActiveNav('nav-training');
        });
    }
    
    if (navExercises) {
        navExercises.addEventListener('click', () => {
            alert('Страница упражнений в разработке');
            updateActiveNav('nav-exercises');
        });
    }
    
    if (navProgress) {
        navProgress.addEventListener('click', () => {
            alert('Страница прогресса в разработке');
            updateActiveNav('nav-progress');
        });
    }
    
    updateActiveNav('nav-training');
}

function updateActiveNav(activeId) {
    const navBtns = ['nav-training', 'nav-exercises', 'nav-progress'];
    
    navBtns.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            if (id === activeId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });
}

function showPage(pageName) {
    const pageCalendar = document.getElementById('page-calendar');
    const pageWorkout = document.getElementById('page-workout');
    const pageWorkoutDetail = document.getElementById('page-workout-detail');
    
    if (pageName === 'calendar') {
        if (pageCalendar) pageCalendar.style.display = 'block';
        if (pageWorkout) pageWorkout.style.display = 'none';
        if (pageWorkoutDetail) pageWorkoutDetail.style.display = 'none';
        currentPage = 'calendar';
        updateActiveNav('nav-training');
    } else if (pageName === 'workout') {
        if (pageCalendar) pageCalendar.style.display = 'none';
        if (pageWorkout) pageWorkout.style.display = 'block';
        if (pageWorkoutDetail) pageWorkoutDetail.style.display = 'none';
        currentPage = 'workout';
        updateActiveNav('nav-training');
        renderWorkoutsList();
    } else if (pageName === 'workout-detail') {
        if (pageCalendar) pageCalendar.style.display = 'none';
        if (pageWorkout) pageWorkout.style.display = 'none';
        if (pageWorkoutDetail) pageWorkoutDetail.style.display = 'block';
        currentPage = 'workout-detail';
        updateActiveNav('nav-training');
    }
}

function openWorkoutPage(date) {
    selectedDate = date;
    showPage('workout');
}

// ==================== МОДАЛЬНОЕ ОКНО ====================

function setupModal() {
    const addBtn = document.getElementById('add-workout-btn');
    const modal = document.getElementById('workout-modal');
    const cancelBtn = document.getElementById('cancel-workout-btn');
    const confirmBtn = document.getElementById('confirm-workout-btn');
    const workoutName = document.getElementById('workout-name');
    const modalTitle = document.getElementById('modal-title');
    
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (modal) {
                if (modalTitle) modalTitle.textContent = 'Создать тренировку';
                if (workoutName) workoutName.value = '';
                const daySelect = document.getElementById('workout-day');
                if (daySelect) daySelect.value = 'any';
                
                confirmBtn.onclick = () => {
                    const name = workoutName ? workoutName.value.trim() : '';
                    const daySelect = document.getElementById('workout-day');
                    const day = daySelect ? daySelect.value : 'any';
                    
                    if (addWorkout(name, day)) {
                        if (modal) modal.style.display = 'none';
                        renderWorkoutsList();
                    }
                };
                
                modal.style.display = 'flex';
            }
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// ==================== ФУНКЦИИ КАЛЕНДАРЯ ====================

function initCalendar() {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonthIndex = today.getMonth();
    
    generateYearMonths(currentYear);
    
    const resetBtn = document.getElementById('reset-calendar-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            scrollToCurrentMonth();
        });
    }
}

function setInitialPositionToCurrentMonth() {
    const scrollContainer = document.getElementById('calendar-scroll');
    if (!scrollContainer) return;
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    const monthElement = document.getElementById(`month-${currentYear}-${currentMonth}`);
    if (monthElement) {
        const monthElementTop = monthElement.offsetTop;
        const scrollContainerHeight = scrollContainer.clientHeight;
        const monthElementHeight = monthElement.offsetHeight;
        
        const scrollTo = monthElementTop - (scrollContainerHeight / 2) + (monthElementHeight / 2);
        
        scrollContainer.scrollTop = Math.max(0, scrollTo);
        
        updateMonthHeader();
    }
}

function getW
