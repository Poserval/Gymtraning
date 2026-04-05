// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let currentPage = 'calendar';
let isAppLoaded = false;
let splashTimeout = null;

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", async () => {
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
    
    for (const page of pages) {
        try {
            const response = await fetch(page.url);
            const html = await response.text();
            const wrapper = document.createElement('div');
            wrapper.innerHTML = html;
            const pageElement = wrapper.firstElementChild;
            if (pageElement) {
                pageElement.id = page.id;
                pageElement.classList.add('page');
                appRoot.appendChild(pageElement);
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
        'styles/exercises-list.css',
        'styles/exercise-detail.css'
    ];
    
    for (const style of styles) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = style;
        document.head.appendChild(link);
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ МОДУЛЕЙ ====================
async function initModules() {
    // Динамическая загрузка модулей
    await import('./modules/storage.js');
    await import('./modules/calendar.js');
    await import('./modules/workouts.js');
    await import('./modules/exercises-list.js');
    await import('./modules/triceps.js');
    await import('./modules/exercise-detail.js');
    
    // Вызов инициализаторов
    if (window.initCalendar) window.initCalendar();
    if (window.initWorkouts) window.initWorkouts();
    if (window.initExercisesList) window.initExercisesList();
    if (window.initTriceps) window.initTriceps();
    if (window.initExerciseDetail) window.initExerciseDetail();
}

// ==================== ЗАСТАВКА ====================
function setupSplashScreen() {
    const splash = document.getElementById("splash-screen");
    
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
    
    // Обработка кнопки "Назад" на Android
    document.addEventListener('backbutton', (e) => {
        e.preventDefault();
        if (window.handleBackButton) {
            window.handleBackButton();
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

window.showPage = showPage;
window.updateActiveNav = updateActiveNav;
window.currentPage = () => currentPage;
