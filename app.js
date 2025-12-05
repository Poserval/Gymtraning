document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  const main = document.getElementById('main');
  const monthYear = document.getElementById('month-year');
  const calendarGrid = document.getElementById('calendar-grid');

  // Через 3 секунды — переход на главный экран
  setTimeout(() => {
    splash.classList.add('hidden');
    main.classList.remove('hidden');
    renderCalendar();
  }, 3000);

  function renderCalendar() {
    const now = new Date();
    const currentDay = now.getDate();
    const month = now.toLocaleString('ru', { month: 'long' });
    const year = now.getFullYear();
    monthYear.textContent = `${month} ${year}`.replace(/^\w/, c => c.toUpperCase());

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    calendarGrid.innerHTML = '';

    // Пустые ячейки до 1-го числа
    for (let i = 0; i < startOffset; i++) {
      calendarGrid.appendChild(document.createElement('div'));
    }

    // Дни месяца
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dayEl = document.createElement('div');
      dayEl.classList.add('day');
      dayEl.textContent = day;

      if (day === currentDay) {
        dayEl.classList.add('today');
      }

      calendarGrid.appendChild(dayEl);
    }
  }
});
