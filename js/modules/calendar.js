// ==================== МОДУЛЬ КАЛЕНДАРЯ ====================
let monthsData = [];
let currentYear = 2026;
let currentMonthIndex = 3;
let isFirstLoad = true;

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
    
    return weekdaysHeight + (weeks * dayCellHeight) + padding;
}

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
        
        dayElement.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.openWorkoutPage) {
                window.openWorkoutPage(dateStr);
            }
        });
        
        container.appendChild(dayElement);
    }
}

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
        
        scrollContainer.scrollTo({
            top: Math.max(0, scrollTo),
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            updateMonthHeader();
        }, 300);
    }
}

// Экспорт
window.initCalendar = initCalendar;
window.setInitialPositionToCurrentMonth = setInitialPositionToCurrentMonth;

// Обработчик скролла
setTimeout(() => {
    const scrollContainer = document.getElementById('calendar-scroll');
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', updateMonthHeader);
    }
}, 200);
