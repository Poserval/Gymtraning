// ==================== ХРАНИЛИЩЕ ДАННЫХ ====================
let workoutData = {}; // { "YYYY-MM-DD": [ {name, sets, reps, weight} ] }
let exerciseLibrary = [];
let authorNotes = "";

const STORAGE_KEYS = {
    WORKOUTS: "gym_workouts",
    LIBRARY: "gym_library",
    NOTES: "gym_notes"
};

// Загрузка данных
function loadData() {
    const savedWorkouts = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    if (savedWorkouts) workoutData = JSON.parse(savedWorkouts);
    
    const savedLibrary = localStorage.getItem(STORAGE_KEYS.LIBRARY);
    if (savedLibrary) exerciseLibrary = JSON.parse(savedLibrary);
    else {
        // Дефолтная библиотека
        exerciseLibrary = ["Жим лежа", "Приседания со штангой", "Становая тяга", "Тяга верхнего блока", "Жим гантелей", "Подтягивания", "Отжимания", "Бицепс со штангой", "Французский жим", "Разгибания на трицепс", "Сгибания ног", "Разведения гантелей", "Тяга штанги в наклоне", "Жим ногами", "Скручивания"];
        saveLibrary();
    }
    
    const savedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (savedNotes) authorNotes = savedNotes;
    const notesTextarea = document.getElementById("author-notes");
    if (notesTextarea) notesTextarea.value = authorNotes;
}

function saveWorkouts() {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workoutData));
}

function saveLibrary() {
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(exerciseLibrary));
}

function saveNotes() {
    localStorage.setItem(STORAGE_KEYS.NOTES, authorNotes);
}

// ==================== UI ЭЛЕМЕНТЫ ====================
let currentDate = new Date().toISOString().split('T')[0];
let currentExercises = [];
let editingIndex = null;

function renderWorkoutTab() {
    const container = document.getElementById("exercises-list");
    if (!container) return;
    
    if (currentExercises.length === 0) {
        container.innerHTML = '<div class="empty-state">➕ Добавьте упражнение</div>';
        return;
    }
    
    container.innerHTML = currentExercises.map((ex, idx) => `
        <div class="exercise-card" data-index="${idx}">
            <div class="exercise-info">
                <div class="exercise-name">${escapeHtml(ex.name)}</div>
                <div class="exercise-details">${ex.sets} × ${ex.reps} | ${ex.weight} кг</div>
            </div>
            <div class="exercise-actions">
                <button class="edit-exercise" data-index="${idx}">✏️</button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.edit-exercise').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.dataset.index);
            openModal(idx);
        });
    });
}

function openModal(index = null) {
    editingIndex = index;
    const modal = document.getElementById("exercise-modal");
    const nameInput = document.getElementById("modal-exercise-name");
    const setsInput = document.getElementById("modal-sets");
    const repsInput = document.getElementById("modal-reps");
    const weightInput = document.getElementById("modal-weight");
    const deleteBtn = document.getElementById("modal-delete-btn");
    
    if (index !== null && currentExercises[index]) {
        const ex = currentExercises[index];
        nameInput.value = ex.name;
        setsInput.value = ex.sets;
        repsInput.value = ex.reps;
        weightInput.value = ex.weight;
        deleteBtn.style.display = "block";
    } else {
        nameInput.value = "";
        setsInput.value = 3;
        repsInput.value = 10;
        weightInput.value = 0;
        deleteBtn.style.display = "none";
    }
    
    const datalist = document.getElementById("exercise-suggestions");
    datalist.innerHTML = exerciseLibrary.map(ex => `<option value="${escapeHtml(ex)}">`).join('');
    
    modal.style.display = "flex";
}

function saveExerciseFromModal() {
    const name = document.getElementById("modal-exercise-name").value.trim();
    const sets = parseInt(document.getElementById("modal-sets").value);
    const reps = parseInt(document.getElementById("modal-reps").value);
    const weight = parseFloat(document.getElementById("modal-weight").value);
    
    if (!name) {
        alert("Введите название упражнения");
        return;
    }
    
    if (isNaN(sets) || sets < 1) {
        alert("Введите корректное количество подходов");
        return;
    }
    
    if (isNaN(reps) || reps < 1) {
        alert("Введите корректное количество повторений");
        return;
    }
    
    const exercise = { name, sets, reps, weight: isNaN(weight) ? 0 : weight };
    
    if (editingIndex !== null) {
        currentExercises[editingIndex] = exercise;
    } else {
        currentExercises.push(exercise);
    }
    
    if (!exerciseLibrary.includes(name)) {
        exerciseLibrary.push(name);
        saveLibrary();
        renderLibraryTab();
    }
    
    renderWorkoutTab();
    document.getElementById("exercise-modal").style.display = "none";
    editingIndex = null;
}

function deleteExerciseFromModal() {
    if (editingIndex !== null && confirm("Удалить это упражнение?")) {
        currentExercises.splice(editingIndex, 1);
        renderWorkoutTab();
        document.getElementById("exercise-modal").style.display = "none";
        editingIndex = null;
    }
}

function saveCurrentWorkout() {
    if (currentExercises.length === 0) {
        alert("Добавьте хотя бы одно упражнение");
        return;
    }
    
    if (!workoutData[currentDate]) workoutData[currentDate] = [];
    workoutData[currentDate] = [...currentExercises];
    saveWorkouts();
    alert("✅ Тренировка сохранена!");
    renderCalendar();
    
    if (document.getElementById("schedule-tab").classList.contains("active")) {
        renderSelectedDayWorkout(currentDate);
    }
}

function loadWorkoutForDate(date) {
    currentDate = date;
    const dateInput = document.getElementById("workout-date");
    if (dateInput) dateInput.value = date;
    
    if (workoutData[date]) {
        currentExercises = [...workoutData[date]];
    } else {
        currentExercises = [];
    }
    renderWorkoutTab();
}

// ==================== КАЛЕНДАРЬ ====================
function renderCalendar() {
    const container = document.getElementById("calendar-view");
    if (!container) return;
    
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    
    let html = '<div class="calendar-header">' + monthNames[month] + ' ' + year + '</div><div class="calendar-grid">';
    
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    weekDays.forEach(day => {
        html += `<div style="text-align:center; font-size:12px; color:#ff9800; padding:5px;">${day}</div>`;
    });
    
    let startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startOffset; i++) html += '<div></div>';
    
    for (let d = 1; d <= lastDay.getDate(); d++) {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const hasWorkout = workoutData[dateStr] && workoutData[dateStr].length > 0;
        html += `<div class="calendar-day ${hasWorkout ? 'has-workout' : ''}" data-date="${dateStr}">${d}</div>`;
    }
    html += '</div>';
    container.innerHTML = html;
    
    document.querySelectorAll('.calendar-day[data-date]').forEach(day => {
        day.addEventListener('click', () => {
            const date = day.dataset.date;
            if (date) {
                loadWorkoutForDate(date);
                document.querySelector('.tab-btn[data-tab="workout"]').click();
            }
        });
    });
}

function renderSelectedDayWorkout(date) {
    const container = document.getElementById("selected-day-workout");
    if (!container) return;
    
    const workout = workoutData[date];
    if (!workout || workout.length === 0) {
        container.innerHTML = `<p>📭 Нет тренировки на ${date}</p>`;
        return;
    }
    
    container.innerHTML = `<h4>📅 ${date}</h4>` + 
        workout.map(ex => `<p>🏋️ ${escapeHtml(ex.name)}: ${ex.sets} × ${ex.reps} (${ex.weight} кг)</p>`).join('');
}

// ==================== БИБЛИОТЕКА ====================
function renderLibraryTab() {
    const container = document.getElementById("library-list");
    const search = document.getElementById("library-search")?.value.toLowerCase() || "";
    if (!container) return;
    
    const filtered = exerciseLibrary.filter(ex => ex.toLowerCase().includes(search));
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state">📭 Упражнения не найдены</div>';
        return;
    }
    
    container.innerHTML = filtered.map(ex => `
        <div class="library-item" data-name="${escapeHtml(ex)}">
            ${escapeHtml(ex)}
        </div>
    `).join('');
    
    document.querySelectorAll('.library-item').forEach(item => {
        item.addEventListener('click', () => {
            document.getElementById("modal-exercise-name").value = item.dataset.name;
            openModal(null);
        });
    });
}

function addLibraryExercise() {
    const newEx = prompt("Введите название упражнения:");
    if (newEx && newEx.trim()) {
        const trimmedName = newEx.trim();
        if (!exerciseLibrary.includes(trimmedName)) {
            exerciseLibrary.push(trimmedName);
            saveLibrary();
            renderLibraryTab();
            alert(`✅ Упражнение "${trimmedName}" добавлено в библиотеку`);
        } else {
            alert("Такое упражнение уже есть в библиотеке");
        }
    }
}

// ==================== ПРОГРЕССИЯ ====================
function renderProgressSelector() {
    const select = document.getElementById("progress-exercise-select");
    if (!select) return;
    
    select.innerHTML = '<option value="">Выберите упражнение</option>';
    const allExercises = new Set();
    
    Object.values(workoutData).forEach(workout => {
        workout.forEach(ex => allExercises.add(ex.name));
    });
    
    if (allExercises.size === 0) {
        select.innerHTML += '<option value="" disabled>Нет данных о тренировках</option>';
        return;
    }
    
    Array.from(allExercises).sort().forEach(ex => {
        select.innerHTML += `<option value="${escapeHtml(ex)}">${escapeHtml(ex)}</option>`;
    });
}

function showProgressRecommendation() {
    const exName = document.getElementById("progress-exercise-select").value;
    const recommendationDiv = document.getElementById("progress-recommendation");
    
    if (!exName) {
        recommendationDiv.innerHTML = "<p>📊 Выберите упражнение из списка</p>";
        return;
    }
    
    let history = [];
    Object.keys(workoutData).sort().forEach(date => {
        const workout = workoutData[date];
        const ex = workout.find(e => e.name === exName);
        if (ex) history.push({ date, weight: ex.weight, sets: ex.sets, reps: ex.reps });
    });
    
    if (history.length < 2) {
        recommendationDiv.innerHTML = `<p>📊 Недостаточно данных для "${exName}". Выполните минимум 2 тренировки с этим упражнением.</p>`;
        return;
    }
    
    const last = history[history.length - 1];
    const prev = history[history.length - 2];
    const lastWeight = last.weight;
    const prevWeight = prev.weight;
    
    let recommendation = `💪 Текущий вес: <strong>${lastWeight} кг</strong><br>`;
    recommendation += `📈 Прогресс: ${lastWeight > prevWeight ? '↑ +' + (lastWeight - prevWeight).toFixed(1) : lastWeight < prevWeight ? '↓ ' + (lastWeight - prevWeight).toFixed(1) : '→ 0'} кг<br>`;
    recommendation += `<hr>`;
    
    if (lastWeight === prevWeight && history.length >= 3) {
        recommendation += `✅ Вы стабильно выполняете упражнение!<br>🎯 Рекомендация: увеличить вес на <strong>+2.5 кг</strong>.<br>📝 ИЛИ добавить 1-2 повторения в каждом подходе.`;
    } else if (lastWeight > prevWeight) {
        const increase = (lastWeight - prevWeight).toFixed(1);
        recommendation += `📈 Отличный прогресс! Вес увеличился на ${increase} кг.<br>🎯 Рекомендация: закрепить текущий вес на 1-2 тренировки, затем увеличить еще на 2.5 кг.`;
    } else if (lastWeight < prevWeight) {
        const decrease = (prevWeight - lastWeight).toFixed(1);
        recommendation += `⚠️ Вес снизился на ${decrease} кг.<br>🎯 Рекомендация: снизить вес на 10-15% и работать над техникой выполнения.<br>📝 Увеличьте количество повторений до 12-15.`;
    } else {
        recommendation += `🎯 Держите текущий вес, добавляйте повторения или подходы для прогресса.`;
    }
    
    recommendationDiv.innerHTML = `<strong>🏋️ ${escapeHtml(exName)}</strong><br>${recommendation}`;
}

function applyProgress() {
    const exName = document.getElementById("progress-exercise-select").value;
    if (!exName) {
        alert("Выберите упражнение");
        return;
    }
    
    const exists = currentExercises.find(ex => ex.name === exName);
    if (exists) {
        const newWeight = parseFloat((exists.weight + 2.5).toFixed(1));
        if (confirm(`Увеличить вес для "${exName}" с ${exists.weight} кг до ${newWeight} кг?`)) {
            exists.weight = newWeight;
            renderWorkoutTab();
            alert(`✅ Вес для "${exName}" увеличен на 2.5 кг в текущей тренировке.`);
        }
    } else {
        if (confirm(`Упражнение "${exName}" не добавлено в текущую тренировку. Добавить его сейчас?`)) {
            currentExercises.push({
                name: exName,
                sets: 3,
                reps: 10,
                weight: 0
            });
            renderWorkoutTab();
            alert(`✅ Упражнение "${exName}" добавлено. Не забудьте указать вес и сохранить тренировку.`);
        }
    }
}

// ==================== ТАЙМЕР ====================
let timerInterval = null;

function startRestTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    let minutes = parseInt(document.getElementById("rest-minutes").value) || 0;
    let seconds = parseInt(document.getElementById("rest-seconds").value) || 0;
    let totalSeconds = minutes * 60 + seconds;
    
    if (totalSeconds <= 0) {
        alert("Установите время отдыха");
        return;
    }
    
    const timerDisplay = document.getElementById("timer-display");
    timerDisplay.textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
    
    timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            timerDisplay.textContent = "00:00";
            alert("⏰ Время отдыха закончилось! Продолжайте тренировку.");
            return;
        }
        totalSeconds--;
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        timerDisplay.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    }, 1000);
}

// ==================== СБРОС ДАННЫХ ====================
function resetAllData() {
    if (confirm("⚠️ ВНИМАНИЕ! Это удалит ВСЕ данные тренировок, библиотеку и заметки. Отменить действие будет невозможно. Продолжить?")) {
        localStorage.clear();
        alert("Все данные удалены. Приложение будет перезагружено.");
        location.reload();
    }
}

// ==================== СОХРАНЕНИЕ ЗАМЕТОК ====================
function saveAuthorNotes() {
    const notesTextarea = document.getElementById("author-notes");
    if (notesTextarea) {
        authorNotes = notesTextarea.value;
        saveNotes();
        alert("✅ Заметки сохранены");
    }
}

// ==================== ESCAPE HTML ====================
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", () => {
    loadData();
    
    // Показываем заставку 5 секунд, затем скрываем
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
    
    // Устанавливаем текущую дату
    const dateInput = document.getElementById("workout-date");
    if (dateInput) dateInput.value = currentDate;
    loadWorkoutForDate(currentDate);
    
    // Табы
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            btn.classList.add("active");
            const tabId = btn.dataset.tab + "-tab";
            const activeTab = document.getElementById(tabId);
            if (activeTab) activeTab.classList.add("active");
            
            if (btn.dataset.tab === "library") renderLibraryTab();
            if (btn.dataset.tab === "schedule") {
                renderCalendar();
                renderSelectedDayWorkout(currentDate);
            }
            if (btn.dataset.tab === "programs") renderProgressSelector();
        });
    });
    
    // Обработчики кнопок
    const addExerciseBtn = document.getElementById("add-exercise-btn");
    if (addExerciseBtn) addExerciseBtn.addEventListener("click", () => openModal(null));
    
    const saveWorkoutBtn = document.getElementById("save-workout-btn");
    if (saveWorkoutBtn) saveWorkoutBtn.addEventListener("click", saveCurrentWorkout);
    
    const startRestBtn = document.getElementById("start-rest-btn");
    if (startRestBtn) startRestBtn.addEventListener("click", startRestTimer);
    
    const modalSaveBtn = document.getElementById("modal-save-btn");
    if (modalSaveBtn) modalSaveBtn.addEventListener("click", saveExerciseFromModal);
    
    const modalDeleteBtn = document.getElementById("modal-delete-btn");
    if (modalDeleteBtn) modalDeleteBtn.addEventListener("click", deleteExerciseFromModal);
    
    const closeModal = document.querySelector(".close-modal");
    if (closeModal) closeModal.addEventListener("click", () => {
        document.getElementById("exercise-modal").style.display = "none";
        editingIndex = null;
    });
    
    const addLibraryBtn = document.getElementById("add-library-exercise-btn");
    if (addLibraryBtn) addLibraryBtn.addEventListener("click", addLibraryExercise);
    
    const librarySearch = document.getElementById("library-search");
    if (librarySearch) librarySearch.addEventListener("input", renderLibraryTab);
    
    const progressSelect = document.getElementById("progress-exercise-select");
    if (progressSelect) progressSelect.addEventListener("change", showProgressRecommendation);
    
    const applyProgressBtn = document.getElementById("apply-progress-btn");
    if (applyProgressBtn) applyProgressBtn.addEventListener("click", applyProgress);
    
    const saveNotesBtn = document.getElementById("save-notes-btn");
    if (saveNotesBtn) saveNotesBtn.addEventListener("click", saveAuthorNotes);
    
    const resetBtn = document.getElementById("reset-all-btn");
    if (resetBtn) resetBtn.addEventListener("click", resetAllData);
    
    // Закрытие модалки по клику вне
    window.onclick = (e) => {
        const modal = document.getElementById("exercise-modal");
        if (e.target === modal) {
            modal.style.display = "none";
            editingIndex = null;
        }
    };
    
    // Инициализация вкладок
    renderLibraryTab();
    renderCalendar();
});
