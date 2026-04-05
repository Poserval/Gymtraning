// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let currentPage = 'main';
let isAppLoaded = false;
let splashTimeout = null;

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", async () => {
    console.log('App started');
    
    await loadMainPage();
    await loadOtherPages();
    
    setupSplashScreen();
    setupNavigation();
    setupBackButton();
});

// ==================== ЗАГРУЗКА СТРАНИЦ ====================
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
    
    splashTimeout = setTimeout(() => hideSplashScreen(), 5000);
    splash.addEventListener('click', () => hideSplashScreen());
}

function hideSplashScreen() {
    if (isAppLoaded) return;
    isAppLoaded = true;
    
    if (splashTimeout) clearTimeout(splashTimeout);
    
    const splash = document.getElementById("splash-screen");
    if (splash) {
        splash.style.opacity = "0";
        setTimeout(() => {
            splash.style.display = "none";
            const mainPage = document.getElementById('page-main');
            if (mainPage) mainPage.classList.add('active');
            if (window.initCalendar) window.initCalendar();
            setTimeout(() => {
                if (window.setInitialPositionToCurrentMonth) window.setInitialPositionToCurrentMonth();
            }, 100);
        }, 300);
    }
}

// ==================== НАВИГАЦИЯ ====================
function setupNavigation() {
    document.getElementById('nav-training')?.addEventListener('click', () => {
        showPage('workouts');
        updateActiveNav('nav-training');
        if (window.renderWorkoutsList) window.renderWorkoutsList();
    });
    
    document.getElementById('nav-exercises')?.addEventListener('click', () => {
        showPage('exercises-list');
        updateActiveNav('nav-exercises');
    });
    
    document.getElementById('nav-progress')?.addEventListener('click', () => {
        alert('Страница прогресса в разработке');
        updateActiveNav('nav-progress');
    });
    
    // Кнопки назад внутри страниц
    document.addEventListener('click', (e) => {
        if (e.target.closest('#back-to-main-from-workouts')) {
            showPage('main');
            updateActiveNav(null);
        }
        if (e.target.closest('#back-to-main-from-exercises')) {
            showPage('main');
            updateActiveNav(null);
        }
    });
}

function setupBackButton() {
    document.addEventListener('backbutton', (e) => {
        e.preventDefault();
        if (currentPage !== 'main') showPage('main');
    }, false);
}

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const activePage = document.getElementById(`page-${pageName}`);
    if (activePage) {
        activePage.classList.add('active');
        currentPage = pageName;
        console.log(`Page changed to: ${pageName}`);
    }
}

function updateActiveNav(activeId) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (activeId) document.getElementById(activeId)?.classList.add('active');
}

window.showPage = showPage;
window.updateActiveNav = updateActiveNav;
window.currentPage = () => currentPage;
