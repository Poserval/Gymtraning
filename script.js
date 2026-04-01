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
    
    // Генерация календаря
    renderCalendar();
});

// Функция для генерации календаря
function renderCalendar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const currentDate = today.getDate();
    
    // Обновляем заголовок с месяцем и годом
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const monthHeader = document.getElementById('current-month');
    if (monthHeader) {
        monthHeader.textContent = `${monthNames[month]} ${year}`;
    }
    
    // Получаем первый день месяца и количество дней
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Определяем день недели первого дня (0 = воскресенье, преобразуем в понедельник как 0)
    let startDay = firstDayOfMonth.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;
    
    // Создаем сетку дней
    const calendarDays = document.getElementById('calendar-days');
    if (!calendarDays) return;
    
    calendarDays.innerHTML = '';
    
    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        emptyDay.textContent = '';
        calendarDays.appendChild(emptyDay);
    }
    
    // Добавляем дни текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Проверяем, является ли этот день сегодняшним
        if (day === currentDate && 
            today.getMonth() === month && 
            today.getFullYear() === year) {
            dayElement.classList.add('today');
        }
        
        calendarDays.appendChild(dayElement);
    }
}
