// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let currentYear = 2026;
let currentMonthIndex = 3;
let monthsData = [];
let isFirstLoad = true;
let splashTimeout = null;
let isAppLoaded = false;
let selectedDate = null;
let currentPage = 'calendar';
let workouts = []; // Массив для хранения тренировок

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", () => {
    // Загрузка сохраненных тренировок
    loadWorkouts();
    
    // Инициализация календаря
    initCalendar();
    
    // Настройка заставки
    setupSplashScreen();
    
    // Настройка навигации
    setupNavigation();
    
    // Настройка нижней панели
    setupBottomNav();
    
    // Настройка модального окна
    setupModal();
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
        <div class="workout-card" data-index="${index}">
            <div class="workout-card-header">
                <span class="workout-day-badge ${workout.day === 'any' ? 'any-day' : ''}">
                    ${dayNames[workout.day]}
                </span>
            </div>
            <div class="workout-name">${escapeHtml(workout.name)}</div>
        </div>
    `).join('');
    
    // Добавляем обработчики для карточек (пока без функционала)
    document.querySelectorAll('.workout-card').forEach(card => {
        card.addEventListener('click', () => {
            const index = parseInt(card.dataset.index);
            console.log('Выбрана тренировка:', workouts[index]);
            // Здесь будет переход к редактированию тренировки
        });
    });
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
        createdAt: new Date().toISOString()
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
    const backBtn = document.getElementById('back-to-calendar-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showPage('calendar');
        });
    }
    
    document.addEventListener('backbutton', (e) => {
        if (currentPage !== 'calendar') {
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
    
    if (pageName === 'calendar') {
        if (pageCalendar) pageCalendar.style.display = 'block';
        if (pageWorkout) pageWorkout.style.display = 'none';
        currentPage = 'calendar';
        updateActiveNav('nav-training');
    } else if (pageName === 'workout') {
        if (pageCalendar) pageCalendar.style.display = 'none';
        if (pageWorkout) pageWorkout.style.display = 'block';
        currentPage = 'workout';
        updateActiveNav('nav-training');
        renderWorkoutsList();
    }
}

function openWorkoutPage(date) {
    selectedDate = date;
    
    const dateTitle = document.getElementById('workout-date-title');
    const selectedDateDisplay = document.getElementById('selected-date-display');
    
    if (dateTitle) {
        dateTitle.textContent = formatDateForTitle(date);
    }
    
    if (selectedDateDisplay) {
        selectedDateDisplay.textContent = formatDateForDisplay(date);
    }
    
    showPage('workout');
}

function formatDateForTitle(date) {
    const dateObj = new Date(date);
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    return `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]}`;
}

function formatDateForDisplay(date) {
    const dateObj = new Date(date);
    const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
}

// ==================== МОДАЛЬНОЕ ОКНО ====================

function setupModal() {
    const addBtn = document.getElementById('add-workout-btn');
    const modal = document.getElementById('workout-modal');
    const cancelBtn = document.getElementById('cancel-workout-btn');
    const confirmBtn = document.getElementById('confirm-workout-btn');
    const workoutName = document.getElementById('workout-name');
    
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (modal) {
                if (workoutName) workoutName.value = '';
                modal.style.display = 'flex';
            }
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const name = workoutName ? workoutName.value.trim() : '';
            const daySelect = document.getElementById('workout-day');
            const day = daySelect ? daySelect.value : 'any';
            
            if (addWorkout(name, day)) {
                if (modal) modal.style.display = 'none';
                renderWorkoutsList();
            }
        });
    }
    
    // Закрытие модального окна по клику вне
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

function getWeeksInMonth(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;
    
    const daysInMonth = lastDay.getDate();
    const totalDays = startDay + daysInMonth;
    const weeks = Math.ceil(totalDays / 7);
    
    return weeks;
}

function calculateWindowHeightForMonth(year, month) {
    const weeks = getWeeksInMonth(year, month);
    
    const weekdaysHeight = 45;
    const dayCellHeight = 48;
    const padding = 16;
    
    const height = weekdaysHeight + (weeks * dayCellHeight) + padding;
    
    return height;
}

function adjustWindowHeight() {
    const scrollContainer = document.getElementById('calendar-sc
