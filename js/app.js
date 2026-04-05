// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let currentPage = 'calendar';
let isAppLoaded = false;
let splashTimeout = null;

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", async () => {
    console.log('App started');
    
    // Загружаем все необходимые страницы
    await loadPages();
    
    // Загружаем дополнительные стили
    await loadStyles();
    
    // Инициализируем модули
    await initModules();
    
    // Настройка заставки
    setupSplashScreen();
    
    // Настройка навигации
    setupNavigation();
    
    // Обработка кнопки "Назад" на Android
    setupBackButton();
});

// ==================== ЗАГРУЗКА СТРАНИЦ ====================
async function loadPages() {
    const pages = [
        { id: 'page-calendar', url: 'pages/calendar.html' },
        { id: 'page-workouts', url: 'pages/workouts.html' },
        { id: 'page-workout-detail', url: 'pages/workout-detail.html' },
        { id: 'page-exercises-list', url: 'pages/exercises-list.html' },
        { id: 'page-triceps', url: 'pages/exercises/triceps.html' },
        { id: 'page-exercise-detail', url: 'pages/exercise-detail.html' }
    ];
    
    const appRoot = document.getElementById('app-root');
    if (!appRoot) {
        console.error('app-root not found');
        return;
    }
    
    for (const page of pages) {
        try {
            const response = await fetch(page.url);
            if (!response.ok) {
                console.warn(`Page ${page.url} not found, skipping`);
                continue;
            }
            const html = await response.text();
            const wrapper = document.createElement('div');
            wrapper.innerHTML = html;
            const pageElement = wrapper.firstElementChild;
            if (pageElement) {
                pageElement.id = page.id;
                pageElement.classList.add('page');
                appRoot.appendChild(pageElement);
                console.log(`Loaded: ${page.id}`);
            }
        } catch (error) {
            console.error(`Ошибка загрузки страницы ${page.url}:`, error);
        }
    }
}

// ==================== ЗАГРУЗКА СТИЛЕЙ ====================
async function loadStyles() {
    const styles = [
        'styles/calendar.css',
        'styles/workouts.css',
        'styles/workout-detail.css',
        'styles/exercises-list.css',
        'styles/exercise-detail.css'
    ];
    
    for (const style of styles) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = style;
        document.head.appendChild(link);
        console.log(`Loaded style: ${style}`);
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ МОДУЛЕЙ ====================
async function initModules() {
    // Загружаем модули в правильном порядке
    const modules = [
        'js/modules/storage.js',
        'js/modules/calendar.js',
        'js/modules/workouts.js',
        'js/modules/workout-detail.js',
        'js/modules/exercises-list.js',
        'js/modules/triceps.js',
        'js/modules/exercise-detail.js'
    ];
    
    for (const module of modules) {
        try {
            await import(module);
            console.log(`Loaded module: ${module}`);
        } catch (error) {
            console.error(`Ошибка загрузки модуля ${module}:`, error);
        }
    }
    
    // Вызов инициализаторов после загрузки всех модулей
    setTimeout(() => {
        if (window.initCalendar) {
            window.initCalendar();
            console.log('Calendar initialized');
        }
        if (window.initWorkouts) {
            window.initWorkouts();
            console.log('Workouts initialized');
        }
        if (window.initWorkoutDetail) {
            window.initWorkoutDetail();
            console.log('WorkoutDetail initialized');
        }
        if (window.initExercisesList) {
            window.initExercisesList();
            console.log('ExercisesList initialized');
        }
        if (window.initTriceps) {
            window.initTriceps();
            console.log('Triceps initialized');
        }
        if (window.initExerciseDetail) {
            window.initExerciseDetail();
            console.log('ExerciseDetail initialized');
        }
    }, 100);
}

// ==================== ЗАСТАВКА ====================
function setupSplashScreen() {
    const splash = document.getElementById("splash-screen");
    if (!splash) return;
    
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
    
    if (splash) {
        splash.style.opacity = "0";
        setTimeout(() => {
            splash.style.display = "none";
            showPage('calendar');
            
            // После показа календаря устанавливаем позицию на текущий месяц
            setTimeout(() => {
                if (window.setInitialPositionToCurrentMonth) {
                    window.setInitialPositionToCurrentMonth();
                }
            }, 100);
        }, 300);
    }
}

// ==================== НАВИГАЦИЯ ====================
function setupNavigation() {
    // Кнопки нижней панели
    const navTraining = document.getElementById('nav-training');
    const navExercises = document.getElementById('nav-exercises');
    const navProgress = document.getElementById('nav-progress');
    
    if (navTraining) {
        navTraining.addEventListener('click', () => {
            showPage('workouts');
            updateActiveNav('nav-training');
            if (window.renderWorkoutsList) {
                window.renderWorkoutsList();
            }
        });
    }
    
    if (navExercises) {
        navExercises.addEventListener('click', () => {
            showPage('exercises-list');
            updateActiveNav('nav-exercises');
        });
    }
    
    if (navProgress) {
        navProgress.addEventListener('click', () => {
            alert('Страница прогресса в разработке');
            updateActiveNav('nav-progress');
        });
    }
}

function setupBackButton() {
    document.addEventListener('backbutton', (e) => {
        e.preventDefault();
        
        // Логика возврата по страницам
        if (currentPage === 'exercise-detail') {
            showPage('triceps');
        } else if (currentPage === 'triceps') {
            showPage('exercises-list');
        } else if (currentPage === 'exercises-list') {
            showPage('calendar');
        } else if (currentPage === 'workout-detail') {
            showPage('workouts');
        } else if (currentPage === 'workouts') {
            showPage('calendar');
        } else if (currentPage !== 'calendar') {
            showPage('calendar');
        }
    }, false);
}

function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const activePage = document.getElementById(`page-${pageName}`);
    if (activePage) {
        activePage.classList.add('active');
        currentPage = pageName;
        console.log(`Page changed to: ${pageName}`);
    } else {
        console.warn(`Page not found: page-${pageName}`);
    }
    
    // Уведомляем модули о смене страницы
    if (window.onPageChange) {
        window.onPageChange(pageName);
    }
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

// Экспорт глобальных функций
window.showPage = showPage;
window.updateActiveNav = updateActiveNav;
window.currentPage = () => currentPage;
