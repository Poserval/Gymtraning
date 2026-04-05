// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let currentPage = 'main';
let isAppLoaded = false;
let splashTimeout = null;

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", async () => {
    console.log('App started');
    
    // Загружаем главную страницу
    await loadMainPage();
    
    // Загружаем остальные страницы
    await loadOtherPages();
    
    // Настройка заставки
    setupSplashScreen();
    
    // Настройка навигации
    setupNavigation();
    
    // Обработка кнопки "Назад"
    setupBackButton();
});

// ==================== ЗАГРУЗКА ГЛАВНОЙ СТРАНИЦЫ ====================
async function loadMainPage() {
    const appRoot = document.getElementById('app-root');
    if (!appRoot) return;
    
    try {
        const response = await fetch('pages/main.html');
        const html = await response.text();
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        const pageElement = wrapper.firstElementChild;
        if (pageElement) {
            pageElement.id = 'page-main';
            pageElement.classList.add('page', 'active');
            appRoot.appendChild(pageElement);
            console.log('Main page loaded');
        }
    } catch (error) {
        console.error('Error loading main page:', error);
    }
}

// ==================== ЗАГРУЗКА ОСТАЛЬНЫХ СТРАНИЦ ====================
async function loadOtherPages() {
    const pages = [
        { id: 'page-workouts', url: 'pages/workouts.html' },
        { id: 'page-exercises-list', url: 'pages/exercises-list.html' }
    ];
    
    const appRoot = document.getElementById('app-root');
    if (!appRoot) return;
    
    for (const page of pages) {
        try {
            const response = await fetch(page.url);
            if (!response.ok) continue;
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
            console.error(`Error loading ${page.url}:`, error);
        }
    }
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
            
            // Показываем главную страницу
            const mainPage = document.getElementById('page-main');
            if (mainPage) {
                mainPage.classList.add('active');
            }
            
            // Инициализируем календарь
            if (window.initCalendar) {
                window.initCalendar();
            }
            
            // Устанавливаем позицию на текущий месяц
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
        
        if (currentPage === 'workouts') {
            showPage('main');
        } else if (currentPage === 'exercises-list') {
            showPage('main');
        } else if (currentPage !== 'main') {
            showPage('main');
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

// Экспорт
window.showPage = showPage;
window.updateActiveNav = updateActiveNav;
window.currentPage = () => currentPage;
