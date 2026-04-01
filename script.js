// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let currentYear = 2026;
let currentMonthIndex = 3; // Апрель (0-январь, 3-апрель)
let monthsData = [];

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", () => {
    // Заставка висит 5 секунд, затем плавно исчезает
    setTimeout(() => {
        const splash = document.getElementById("splash-screen");
        const app = document.getElementById("app-content");
        
        if (splash && app) {
            splash.style.opacity = "0";
            setTimeout(() => {
                splash.style.display = "none";
                app.style.display = "block";
            }, 500);
        }
    }, 5000);
    
    // Инициализация календаря
    initCalendar();
});

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
        resetBtn.addEventListener('click', scrollToCurrentMonth);
    }
    
    // Прокручиваем к текущему месяцу
    setTimeout(() => {
        scrollToCurrentMonth();
    }, 100);
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
        
        const monthTitle = document.createElement('div');
        monthTitle.className = 'month-title';
        monthTitle.textContent = `${monthNames[month]} ${year}`;
        
        const calendarDiv = document.createElement('div');
        calendarDiv.className = 'calendar';
        
        // Дни недели
        const weekdaysDiv = document.createElement('div');
        weekdaysDiv.className = 'calendar-weekdays';
        const weekdays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
        weekdays.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;
            weekdaysDiv.appendChild(dayDiv);
        });
        
        // Сетка дней
        const daysDiv = document.createElement('div');
        daysDiv.className = 'calendar-days';
        
        // Генерируем дни месяца
        generateMonthDays(year, month, daysDiv);
        
        calendarDiv.appendChild(weekdaysDiv);
        calendarDiv.appendChild(daysDiv);
        monthContainer.appendChild(monthTitle);
        monthContainer.appendChild(calendarDiv);
        monthsContainer.appendChild(monthContainer);
        
        monthsData.push({
            year: year,
            month: month,
            element: monthContainer
        });
    }
    
    // Обновляем заголовок с текущим месяцем
    updateMonthHeader();
}

// Генерация дней для конкретного месяца
function generateMonthDays(year, month, container) {
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    // Определяем день недели первого дня (0 = воскресенье, преобразуем в понедельник как 0)
    let startDay = firstDayOfMonth.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;
    
    container.innerHTML = '';
    
    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        emptyDay.textContent = '';
        container.appendChild(emptyDay);
    }
    
    // Добавляем дни текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Проверяем, является ли этот день сегодняшним
        if (day === today.getDate() && 
            month === today.getMonth() && 
            year === today.getFullYear()) {
            dayElement.classList.add('today');
        }
        
        // Добавляем временный обработчик (пока без функционала)
        dayElement.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log(`Выбран день: ${day}.${month+1}.${year}`);
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
    
    // Определяем, какой месяц сейчас в центре видимости
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
        
        // Если ни один месяц не в центре, находим ближайший
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
    }
}

// Прокрутка к текущему месяцу
function scrollToCurrentMonth() {
    const scrollContainer = document.getElementById('calendar-scroll');
    if (!scrollContainer) return;
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    const monthElement = document.getElementById(`month-${currentYear}-${currentMonth}`);
    if (monthElement) {
        // Прокручиваем так, чтобы месяц оказался в центре окна
        const scrollContainerRect = scrollContainer.getBoundingClientRect();
        const monthElementRect = monthElement.getBoundingClientRect();
        const offset = monthElementRect.top - scrollContainerRect.top;
        const scrollTo = scrollContainer.scrollTop + offset - (scrollContainerRect.height / 2) + (monthElementRect.height / 2);
        
        scrollContainer.scrollTo({
            top: scrollTo,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            updateMonthHeader();
        }, 500);
    }
}

// Добавляем обработчик скролла для обновления заголовка
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

// Функция для будущего добавления новых годов (для расширения календаря)
function addYear(year) {
    // Эта функция будет использоваться в будущем для добавления годов
    // когда появятся тренировки в новых годах
    const monthsContainer = document.getElementById('calendar-months');
    if (!monthsContainer) return;
    
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    
    for (let month = 0; month < 12; month++) {
        const monthContainer = document.createElement('div');
        monthContainer.className = 'month-container';
        monthContainer.id = `month-${year}-${month}`;
        
        const monthTitle = document.createElement('div');
        monthTitle.className = 'month-title';
        monthTitle.textContent = `${monthNames[month]} ${year}`;
        
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
        monthContainer.appendChild(monthTitle);
        monthContainer.appendChild(calendarDiv);
        monthsContainer.appendChild(monthContainer);
        
        monthsData.push({
            year: year,
            month: month,
            element: monthContainer
        });
    }
}
