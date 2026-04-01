// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let currentYear = 2026;
let currentMonthIndex = 3;
let monthsData = [];
let isFirstLoad = true;
let splashTimeout = null;
let isAppLoaded = false;
let selectedDate = null;

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", () => {
    // Инициализация календаря
    initCalendar();
    
    // Настройка заставки
    setupSplashScreen();
    
    // Настройка навигации
    setupNavigation();
});

// ==================== ФУНКЦИИ ЗАСТАВКИ ====================

function setupSplashScreen() {
    const splash = document.getElementById("splash-screen");
    const pageCalendar = document.getElementById("page-calendar");
    
    if (!splash || !pageCalendar) return;
    
    // Автоматический переход через 5 секунд
    splashTimeout = setTimeout(() => {
        hideSplashScreen();
    }, 5000);
    
    // Переход по клику на заставку
    splash.addEventListener('click', () => {
        hideSplashScreen();
    });
}

function hideSplashScreen() {
    // Если приложение уже загружено, не выполняем повторно
    if (isAppLoaded) return;
    isAppLoaded = true;
    
    // Очищаем таймер, если он еще не сработал
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
            
            // После появления главного экрана сразу устанавливаем позицию на текущий месяц БЕЗ анимации
            setTimeout(() => {
                setInitialPositionToCurrentMonth();
                isFirstLoad = false;
            }, 50);
        }, 300);
    }
}

// ==================== ФУНКЦИИ НАВИГАЦИИ ====================

function setupNavigation() {
    // Кнопка назад на странице тренировки
    const backBtn = document.getElementById('back-to-calendar-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showPage('calendar');
        });
    }
    
    // Обработка кнопки "Назад" на телефоне (Android)
    document.addEventListener('backbutton', (e) => {
        const pageWorkout = document.getElementById('page-workout');
        if (pageWorkout && pageWorkout.style.display === 'block') {
            e.preventDefault();
            showPage('calendar');
        }
    }, false);
}

// Показать указанную страницу
function showPage(pageName) {
    const pageCalendar = document.getElementById('page-calendar');
    const pageWorkout = document.getElementById('page-workout');
    
    if (pageName === 'calendar') {
        if (pageCalendar) pageCalendar.style.display = 'block';
        if (pageWorkout) pageWorkout.style.display = 'none';
    } else if (pageName === 'workout') {
        if (pageCalendar) pageCalendar.style.display = 'none';
        if (pageWorkout) pageWorkout.style.display = 'block';
    }
}

// Переход на страницу тренировки для выбранной даты
function openWorkoutPage(date) {
    selectedDate = date;
    
    // Обновляем заголовок на странице тренировки
    const dateTitle = document.getElementById('workout-date-title');
    const selectedDateDisplay = document.getElementById('selected-date-display');
    
    if (dateTitle) {
        dateTitle.textContent = formatDateForTitle(date);
    }
    
    if (selectedDateDisplay) {
        selectedDateDisplay.textContent = formatDateForDisplay(date);
    }
    
    // Показываем страницу тренировки
    showPage('workout');
}

// Форматирование даты для заголовка
function formatDateForTitle(date) {
    const dateObj = new Date(date);
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    return `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]}`;
}

// Форматирование даты для отображения
function formatDateForDisplay(date) {
    const dateObj = new Date(date);
    const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
}

// ==================== ФУНКЦИИ КАЛЕНДАРЯ ====================

// Инициализация календаря
function initCalendar() {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonthIndex = today.getMonth();
    
    // Генерируем все месяцы текущего года
    generateYearMonths(currentYear);
    
    // Добавляем обработчик для кнопки сброса
    const resetBtn = document.getElementById('reset-calendar-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            scrollToCurrentMonth();
        });
    }
}

// Установка начальной позиции на текущий месяц БЕЗ прокрутки
function setInitialPositionToCurrentMonth() {
    const scrollContainer = document.getElementById('calendar-scroll');
    if (!scrollContainer) return;
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    const monthElement = document.getElementById(`month-${currentYear}-${currentMonth}`);
    if (monthElement) {
        // Получаем позицию элемента
        const monthElementTop = monthElement.offsetTop;
        const scrollContainerHeight = scrollContainer.clientHeight;
        const monthElementHeight = monthElement.offsetHeight;
        
        // Вычисляем позицию прокрутки, чтобы месяц оказался в центре
        const scrollTo = monthElementTop - (scrollContainerHeight / 2) + (monthElementHeight / 2);
        
        // Мгновенная установка позиции БЕЗ анимации
        scrollContainer.scrollTop = Math.max(0, scrollTo);
        
        // Обновляем заголовок
        updateMonthHeader();
    }
}

// Получение количества недель в месяце
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

// Расчет высоты окна для конкретного месяца
function calculateWindowHeightForMonth(year, month) {
    const weeks = getWeeksInMonth(year, month);
    
    const weekdaysHeight = 45;
    const dayCellHeight = 48;
    const padding = 16;
    
    const height = weekdaysHeight + (weeks * dayCellHeight) + padding;
    
    return height;
}

// Установка высоты окна для текущего отображаемого месяца
function adjustWindowHeight() {
    const scrollContainer = document.getElementById('calendar-scroll');
    const calendarWindow = document.getElementById('calendar-window');
    
    if (!scrollContainer || !calendarWindow) return;
    
    const scrollTop = scrollContainer.scrollTop;
    let centerMonth = null;
    
    for (let i = 0; i < monthsData.length; i++) {
        const monthElement = monthsData[i].element;
        const offsetTop = monthElement.offsetTop;
        const offsetBottom = offsetTop + monthElement.offsetHeight;
        const viewportCenter = scrollTop + (scrollContainer.clientHeight / 2);
        
        if (viewportCenter >= offsetTop && viewportCenter <= offsetBottom) {
            centerMonth = monthsData[i];
            break;
        }
    }
    
    if (centerMonth) {
        const height = calculateWindowHeightForMonth(centerMonth.year, centerMonth.month);
        calendarWindow.style.height = height + 'px';
    }
}

// Генерация всех месяцев указанного года
function generateYearMonths(year) {
    const monthsContainer = document.getElementById('calendar-months');
    if (!monthsContainer) return;
    
    monthsContainer.innerHTML = '';
    monthsData = [];
    
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    
    for (let month = 0; month < 12; month++) {
        const monthContainer = document.createElement('div');
        monthContainer.className = 'month-container';
        monthContainer.id = `month-${year}-${month}`;
        
        const calendarDiv = document.createElement('div');
        calendarDiv.className = 'calendar';
        
        const weekdaysDiv = document.createElement('div');
        weekdaysDiv.className = 'calendar-weekdays';
        const weekdays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
        weekdays.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;
            weekdaysDiv.appendChild(dayDiv);
        });
        
        const daysDiv = document.createElement('div');
        daysDiv.className = 'calendar-days';
        
        generateMonthDays(year, month, daysDiv);
        
        calendarDiv.appendChild(weekdaysDiv);
        calendarDiv.appendChild(daysDiv);
        monthContainer.appendChild(calendarDiv);
        monthsContainer.appendChild(monthContainer);
        
        monthsData.push({
            year: year,
            month: month,
            element: monthContainer,
            weeksCount: getWeeksInMonth(year, month)
        });
    }
    
    updateMonthHeader();
    
    setTimeout(() => {
        adjustWindowHeight();
    }, 50);
}

// Генерация дней для конкретного месяца
function generateMonthDays(year, month, container) {
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    let startDay = firstDayOfMonth.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;
    
    container.innerHTML = '';
    
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        emptyDay.textContent = '';
        container.appendChild(emptyDay);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        
        if (day === today.getDate() && 
            month === today.getMonth() && 
            year === today.getFullYear()) {
            dayElement.classList.add('today');
        }
        
        // Добавляем обработчик для перехода на страницу тренировки
        dayElement.addEventListener('click', (e) => {
            e.stopPropagation();
            openWorkoutPage(dateStr);
        });
        
        container.appendChild(dayElement);
    }
}

// Обновление заголовка с текущим месяцем при скролле
function updateMonthHeader() {
    const scrollContainer = document.getElementById('calendar-scroll');
    if (!scrollContainer) return;
    
    const monthHeader = document.getElementById('current-month');
    if (!monthHeader) return;
    
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    
    const scrollTop = scrollContainer.scrollTop;
    let currentMonth = null;
    let closestDistance = Infinity;
    
    for (let i = 0; i < monthsData.length; i++) {
        const monthElement = monthsData[i].element;
        const offsetTop = monthElement.offsetTop;
        const offsetBottom = offsetTop + monthElement.offsetHeight;
        const viewportCenter = scrollTop + (scrollContainer.clientHeight / 2);
        
        if (viewportCenter >= offsetTop && viewportCenter <= offsetBottom) {
            currentMonth = monthsData[i];
            break;
        }
        
        const distanceToTop = Math.abs(viewportCenter - offsetTop);
        const distanceToBottom = Math.abs(viewportCenter - offsetBottom);
        const minDistance = Math.min(distanceToTop, distanceToBottom);
        
        if (minDistance < closestDistance) {
            closestDistance = minDistance;
            currentMonth = monthsData[i];
        }
    }
    
    if (currentMonth) {
        monthHeader.textContent = `${monthNames[currentMonth.month]} ${currentMonth.year}`;
        adjustWindowHeight();
    }
}

// Прокрутка к текущему месяцу (для кнопки reset)
function scrollToCurrentMonth() {
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
        
        // Плавная прокрутка для кнопки reset
        scrollContainer.scrollTo({
            top: Math.max(0, scrollTo),
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            updateMonthHeader();
        }, 300);
    }
}

// Добавляем обработчик скролла
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const scrollContainer = document.getElementById('calendar-scroll');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', () => {
                updateMonthHeader();
            });
        }
    }, 200);
});
