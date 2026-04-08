// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
let currentYear = 2026;
let currentMonthIndex = 3;
let monthsData = [];
let isFirstLoad = true;
let splashTimeout = null;
let isAppLoaded = false;
let selectedDate = null;
let currentPage = 'calendar';
let workouts = [];
let editingWorkoutIndex = null;
let dragStartIndex = null;
let currentWorkoutIndex = null;
let currentSets = [{ set: 1, kg: 0, reps: 0, completed: false }];

// Переменные для тренировки
let currentWorkoutExercises = [];
let editingWorkoutExerciseIndex = null;
let selectedExercisesForWorkout = [];
let isSelectionMode = false;

// Элементы страниц
const pageCalendar = document.getElementById('page-calendar');
const pageWorkout = document.getElementById('page-workout');
const pageWorkoutDetail = document.getElementById('page-workout-detail');
const pageExercises = document.getElementById('page-exercises');
const pageTriceps = document.getElementById('page-triceps');
const pageChest = document.getElementById('page-chest');
const pageShoulder = document.getElementById('page-shoulder');
const pageBiceps = document.getElementById('page-biceps');
const pageAbs = document.getElementById('page-abs');
const pageBack = document.getElementById('page-back');
const pageForearms = document.getElementById('page-forearms');
const pageUpperlegs = document.getElementById('page-upperlegs');
const pageGlutes = document.getElementById('page-glutes');
const pageCardio = document.getElementById('page-cardio');
const pageLowerlegs = document.getElementById('page-lowerlegs');
const pageExerciseDetail = document.getElementById('page-exercise-detail');
const pageSelectExercise = document.getElementById('page-select-exercise');
const pageExerciseDetailFromWorkout = document.getElementById('page-exercise-detail-from-workout');

// Флаг загрузки сетки упражнений
let exercisesGridLoaded = false;
let exercisesGridHtml = null;

// ==================== ЗАГРУЗКА СТРАНИЦЫ УПРАЖНЕНИЙ ====================
async function loadExercisesGrid() {
    if (exercisesGridLoaded) return;
    try {
        let response = await fetch('pages/exercises-grid.html');
        if (!response.ok) {
            response = await fetch('./pages/exercises-grid.html');
        }
        const html = await response.text();
        exercisesGridHtml = html;
        const container = document.getElementById('page-exercises');
        if (container) {
            container.innerHTML = html;
            exercisesGridLoaded = true;
            attachExerciseCategoryHandlers();
        }
    } catch (error) {
        console.error('Ошибка загрузки страницы упражнений:', error);
        const container = document.getElementById('page-exercises');
        if (container) {
            container.innerHTML = '<div class="exercises-container"><div class="exercises-header"><button id="back-to-main-from-exercises" class="back-btn"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="white"/></svg></button><h2>Упражнения</h2><div style="width: 40px;"></div></div><div class="exercises-content"><div class="exercises-grid"><div class="exercise-category" data-category="triceps"><div class="category-icon"><img src="assets/icon-exercises-triceps.png" alt="Трицепс"></div><span class="category-name">Трицепс</span></div><div class="exercise-category" data-category="chest"><div class="category-icon"><img src="assets/icon-exercises-chest.png" alt="Грудные"></div><span class="category-name">Грудные</span></div><div class="exercise-category" data-category="shoulder"><div class="category-icon"><img src="assets/icon-exercises-shoulder.png" alt="Плечи"></div><span class="category-name">Плечи</span></div></div><div class="exercises-grid"><div class="exercise-category" data-category="biceps"><div class="category-icon"><img src="assets/icon-exercises-biceps.png" alt="Бицепс"></div><span class="category-name">Бицепс</span></div><div class="exercise-category" data-category="abs"><div class="category-icon"><img src="assets/icon-exercises-abs.png" alt="Пресс"></div><span class="category-name">Пресс</span></div><div class="exercise-category" data-category="back"><div class="category-icon"><img src="assets/icon-exercises-back.png" alt="Спина"></div><span class="category-name">Спина</span></div></div><div class="exercises-grid"><div class="exercise-category" data-category="forearms"><div class="category-icon"><img src="assets/icon-exercises-forearms.png" alt="Предплечье"></div><span class="category-name">Предплечье</span></div><div class="exercise-category" data-category="upperlegs"><div class="category-icon"><img src="assets/icon-exercises-upperlegs.png" alt="Ноги (верх)"></div><span class="category-name">Ноги (верх)</span></div><div class="exercise-category" data-category="glutes"><div class="category-icon"><img src="assets/icon-exercises-glutes.png" alt="Ягодицы"></div><span class="category-name">Ягодицы</span></div></div><div class="exercises-grid"><div class="exercise-category" data-category="cardio"><div class="category-icon"><img src="assets/icon-exercises-cardio.png" alt="Кардио"></div><span class="category-name">Кардио</span></div><div class="exercise-category" data-category="lowerlegs"><div class="category-icon"><img src="assets/icon-exercises-lowerlegs.png" alt="Ноги (низ)"></div><span class="category-name">Ноги (низ)</span></div><div class="exercise-category" data-category="all"><div class="category-icon"><img src="assets/icon-exercises-all.png" alt="Все"></div><span class="category-name">Все</span></div></div></div></div>';
            exercisesGridLoaded = true;
            attachExerciseCategoryHandlers();
        }
    }
}

function attachExerciseCategoryHandlers() {
    setTimeout(() => {
        const exerciseCategories = document.querySelectorAll('.exercise-category');
        exerciseCategories.forEach(category => {
            const newCategory = category.cloneNode(true);
            category.parentNode.replaceChild(newCategory, category);
            newCategory.addEventListener('click', (e) => {
                e.stopPropagation();
                const categoryData = newCategory.getAttribute('data-category');
                if (categoryData === 'triceps') {
                    showPage('triceps');
                } else if (categoryData === 'chest') {
                    showPage('chest');
                } else if (categoryData === 'shoulder') {
                    showPage('shoulder');
                } else if (categoryData === 'biceps') {
                    showPage('biceps');
                } else if (categoryData === 'abs') {
                    showPage('abs');
                } else if (categoryData === 'back') {
                    showPage('back');
                } else if (categoryData === 'forearms') {
                    showPage('forearms');
                } else if (categoryData === 'upperlegs') {
                    showPage('upperlegs');
                } else if (categoryData === 'glutes') {
                    showPage('glutes');
                } else if (categoryData === 'cardio') {
                    showPage('cardio');
                } else if (categoryData === 'lowerlegs') {
                    showPage('lowerlegs');
                } else if (categoryData === 'all') {
                    alert('Раздел "Все" в разработке');
                }
            });
        });
        
        const backBtn = document.getElementById('back-to-main-from-exercises');
        if (backBtn) {
            const newBackBtn = backBtn.cloneNode(true);
            backBtn.parentNode.replaceChild(newBackBtn, backBtn);
            newBackBtn.addEventListener('click', () => {
                showPage('calendar');
            });
        }
    }, 50);
}

// ==================== ФУНКЦИИ ДЛЯ ТРЕНИРОВКИ ====================

function openSelectExercisesPage() {
    isSelectionMode = true;
    selectedExercisesForWorkout = [];
    loadSelectExercisesList();
    showPage('select-exercise');
}

function loadSelectExercisesList() {
    const container = document.getElementById('select-exercises-list');
    if (!container) return;
    
    const saved = localStorage.getItem('triceps_exercises');
    let exercises = [];
    if (saved) {
        exercises = JSON.parse(saved);
    } else {
        exercises = [{
            id: 'triceps_001',
            name: 'Жим от брусьев',
            image: 'assets/exercises/triceps/images/icon-triceps-001.png',
            isDefault: true,
            isFavorite: false
        }];
    }
    
    container.innerHTML = exercises.map((ex, index) => `
        <div class="exercise-item selectable" data-exercise-id="${ex.id}" data-exercise-name="${ex.name}" data-exercise-img="${ex.image}" data-index="${index}">
            <div class="exercise-item-left">
                <img src="${ex.image}" alt="${ex.name}" class="exercise-image" onerror="this.src='assets/icon-desktop-96.png'">
            </div>
            <div class="exercise-item-center">
                <span class="exercise-item-name">${escapeHtml(ex.name)}</span>
            </div>
            <div class="exercise-item-right">
                <div class="select-checkbox"></div>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('#select-exercises-list .selectable').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('selected');
            const exerciseId = item.dataset.exerciseId;
            const exerciseName = item.dataset.exerciseName;
            const exerciseImg = item.dataset.exerciseImg;
            
            if (item.classList.contains('selected')) {
                if (!selectedExercisesForWorkout.find(e => e.id === exerciseId)) {
                    selectedExercisesForWorkout.push({
                        id: exerciseId,
                        name: exerciseName,
                        image: exerciseImg
                    });
                }
            } else {
                selectedExercisesForWorkout = selectedExercisesForWorkout.filter(e => e.id !== exerciseId);
            }
            
            const confirmBtn = document.getElementById('confirm-select-exercises-btn');
            if (confirmBtn) {
                confirmBtn.style.display = selectedExercisesForWorkout.length > 0 ? 'block' : 'none';
            }
        });
    });
    
    const confirmBtn = document.getElementById('confirm-select-exercises-btn');
    if (confirmBtn) {
        confirmBtn.style.display = 'none';
    }
}

function addSelectedExercisesToWorkout() {
    selectedExercisesForWorkout.forEach(ex => {
        if (!currentWorkoutExercises.find(e => e.id === ex.id)) {
            currentWorkoutExercises.push({
                id: ex.id,
                name: ex.name,
                image: ex.image,
                sets: [{ set: 1, kg: 0, reps: 0, completed: false }]
            });
        }
    });
    renderWorkoutExercisesList();
    showPage('workout-detail');
    
    const startBtn = document.getElementById('start-workout-btn');
    if (startBtn && currentWorkoutExercises.length > 0) {
        startBtn.disabled = false;
    }
}

function renderWorkoutExercisesList() {
    const container = document.getElementById('workout-exercises-list');
    const emptyPlaceholder = document.getElementById('empty-workout-exercises');
    
    if (!container) return;
    
    if (currentWorkoutExercises.length === 0) {
        container.style.display = 'none';
        if (emptyPlaceholder) emptyPlaceholder.style.display = 'block';
        return;
    }
    
    container.style.display = 'flex';
    if (emptyPlaceholder) emptyPlaceholder.style.display = 'none';
    
    container.innerHTML = currentWorkoutExercises.map((ex, index) => `
        <div class="exercise-item" data-exercise-index="${index}">
            <div class="exercise-item-left">
                <img src="${ex.image}" alt="${ex.name}" class="exercise-image" onerror="this.src='assets/icon-desktop-96.png'">
            </div>
            <div class="exercise-item-center">
                <span class="exercise-item-name">${escapeHtml(ex.name)}</span>
            </div>
            <div class="exercise-item-right">
                <button class="edit-exercise-in-workout-btn" data-index="${index}">✏️</button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.edit-exercise-in-workout-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            openExerciseDetailForWorkout(index);
        });
    });
}

function openExerciseDetailForWorkout(index) {
    const exercise = currentWorkoutExercises[index];
    if (!exercise) return;
    
    const detailName = document.getElementById('exercise-detail-name-workout');
    const detailImg = document.getElementById('exercise-detail-img-workout');
    
    if (detailName) detailName.textContent = exercise.name;
    if (detailImg) detailImg.src = exercise.image;
    
    currentSets = exercise.sets || [{ set: 1, kg: 0, reps: 0, completed: false }];
    renderSetsForWorkout();
    
    editingWorkoutExerciseIndex = index;
    
    showPage('exercise-detail-from-workout');
}

function renderSetsForWorkout() {
    const setsList = document.getElementById('sets-list-workout');
    if (!setsList) return;
    
    setsList.innerHTML = currentSets.map((set, index) => `
        <div class="set-row" data-index="${index}">
            <div class="set-number">${set.set}</div>
            <input type="number" class="set-input set-kg" value="${set.kg === 0 ? '' : set.kg}" placeholder="0" step="0.5">
            <input type="number" class="set-input set-reps" value="${set.reps === 0 ? '' : set.reps}" placeholder="0" step="1">
            <div class="set-checkbox">
                <input type="checkbox" class="set-completed" ${set.completed ? 'checked' : ''} ${(set.kg === 0 || set.reps === 0) ? 'disabled' : ''}>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('#sets-list-workout .set-row').forEach((row, idx) => {
        const kgInput = row.querySelector('.set-kg');
        const repsInput = row.querySelector('.set-reps');
        const completedCheckbox = row.querySelector('.set-completed');
        
        if (kgInput) {
            kgInput.addEventListener('input', (e) => {
                let value = e.target.value;
                if (value.startsWith('0') && value.length > 1) {
                    value = value.replace(/^0+/, '');
                    e.target.value = value;
                }
                currentSets[idx].kg = parseFloat(value) || 0;
                
                if (completedCheckbox) {
                    const kgValid = currentSets[idx].kg > 0;
                    const repsValid = currentSets[idx].reps > 0;
                    completedCheckbox.disabled = !(kgValid && repsValid);
                    if (completedCheckbox.disabled) {
                        completedCheckbox.checked = false;
                        currentSets[idx].completed = false;
                    }
                }
            });
        }
        
        if (repsInput) {
            repsInput.addEventListener('input', (e) => {
                let value = e.target.value;
                if (value.startsWith('0') && value.length > 1) {
                    value = value.replace(/^0+/, '');
                    e.target.value = value;
                }
                currentSets[idx].reps = parseInt(value) || 0;
                
                if (completedCheckbox) {
                    const kgValid = currentSets[idx].kg > 0;
                    const repsValid = currentSets[idx].reps > 0;
                    completedCheckbox.disabled = !(kgValid && repsValid);
                    if (completedCheckbox.disabled) {
                        completedCheckbox.checked = false;
                        currentSets[idx].completed = false;
                    }
                }
            });
        }
        
        if (completedCheckbox) {
            completedCheckbox.addEventListener('change', (e) => {
                if (!completedCheckbox.disabled) {
                    currentSets[idx].completed = e.target.checked;
                } else {
                    e.target.checked = false;
                    alert('Заполните вес и количество повторений');
                }
            });
        }
    });
}

function saveWorkoutExerciseSets() {
    if (editingWorkoutExerciseIndex !== null) {
        currentWorkoutExercises[editingWorkoutExerciseIndex].sets = JSON.parse(JSON.stringify(currentSets));
        renderWorkoutExercisesList();
        editingWorkoutExerciseIndex = null;
    }
    showPage('workout-detail');
}

function setupWorkoutExerciseDetailButtons() {
    const addSetBtn = document.getElementById('add-set-btn-workout');
    const removeSetBtn = document.getElementById('remove-set-btn-workout');
    const saveBtn = document.getElementById('save-exercise-to-workout-btn');
    const backBtn = document.getElementById('back-to-workout-from-exercise-detail');
    
    if (addSetBtn) {
        addSetBtn.addEventListener('click', () => {
            const newSetNumber = currentSets.length + 1;
            currentSets.push({ set: newSetNumber, kg: 0, reps: 0, completed: false });
            renderSetsForWorkout();
        });
    }
    
    if (removeSetBtn) {
        removeSetBtn.addEventListener('click', () => {
            if (currentSets.length > 1) {
                currentSets.pop();
                renderSetsForWorkout();
            } else {
                alert('Нельзя удалить последний сет');
            }
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            saveWorkoutExerciseSets();
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showPage('workout-detail');
        });
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", () => {
    loadWorkouts();
    initCalendar();
    setupSplashScreen();
    setupNavigation();
    setupBottomNav();
    setupModal();
    setupWorkoutMenu();
    setupWorkoutExerciseDetailButtons();
});

// ==================== РАБОТА С ТРЕНИРОВКАМИ ====================

function loadWorkouts() {
    const savedWorkouts = localStorage.getItem('gym_workouts_list');
    if (savedWorkouts) {
        workouts = JSON.parse(savedWorkouts);
    } else {
        workouts = [];
    }
    renderWorkoutsList();
}

function saveWorkouts() {
    localStorage.setItem('gym_workouts_list', JSON.stringify(workouts));
    renderWorkoutsList();
}

function renderWorkoutsList() {
    const workoutsList = document.getElementById('workouts-list');
    const emptyPlaceholder = document.getElementById('empty-workouts');
    
    if (!workoutsList || !emptyPlaceholder) return;
    
    if (workouts.length === 0) {
        workoutsList.style.display = 'none';
        emptyPlaceholder.style.display = 'block';
        return;
    }
    
    workoutsList.style.display = 'flex';
    emptyPlaceholder.style.display = 'none';
    
    const dayNames = {
        'monday': 'Понедельник',
        'tuesday': 'Вторник',
        'wednesday': 'Среда',
        'thursday': 'Четверг',
        'friday': 'Пятница',
        'saturday': 'Суббота',
        'sunday': 'Воскресенье',
        'any': 'Любой день'
    };
    
    workoutsList.innerHTML = workouts.map((workout, index) => `
        <div class="workout-card" data-index="${index}" draggable="true">
            <div class="drag-handle">
                <div class="drag-dots-row">
                    <div class="drag-dot"></div>
                    <div class="drag-dot"></div>
                </div>
                <div class="drag-dots-row">
                    <div class="drag-dot"></div>
                    <div class="drag-dot"></div>
                </div>
                <div class="drag-dots-row">
                    <div class="drag-dot"></div>
                    <div class="drag-dot"></div>
                </div>
            </div>
            <div class="workout-card-content">
                <div class="workout-day-badge ${workout.day === 'any' ? 'any-day' : ''}">
                    ${dayNames[workout.day]}
                </div>
                <div class="workout-name">${escapeHtml(workout.name)}</div>
            </div>
            <button class="workout-menu-btn" data-index="${index}">
                <div class="menu-dot"></div>
                <div class="menu-dot"></div>
                <div class="menu-dot"></div>
            </button>
        </div>
    `).join('');
    
    setupDragAndDrop();
    setupWorkoutCardMenus();
    
    document.querySelectorAll('.workout-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.workout-menu-btn') && !e.target.closest('.drag-handle')) {
                const index = parseInt(card.dataset.index);
                openWorkoutDetail(index);
            }
        });
    });
}

function openWorkoutDetail(index) {
    currentWorkoutIndex = index;
    const workout = workouts[index];
    if (!workout) return;
    
    const dayBadge = document.getElementById('detail-day-badge');
    const workoutName = document.getElementById('detail-workout-name');
    
    const shortDayNames = {
        'monday': 'Пн',
        'tuesday': 'Вт',
        'wednesday': 'Ср',
        'thursday': 'Чт',
        'friday': 'Пт',
        'saturday': 'Сб',
        'sunday': 'Вс',
        'any': 'Любой'
    };
    
    if (dayBadge) {
        dayBadge.textContent = shortDayNames[workout.day] || 'Любой';
        if (workout.day === 'any') {
            dayBadge.classList.add('any-day');
        } else {
            dayBadge.classList.remove('any-day');
        }
    }
    
    if (workoutName) {
        workoutName.textContent = workout.name;
    }
    
    showPage('workout-detail');
}

function setupDragAndDrop() {
    const cards = document.querySelectorAll('.workout-card');
    let dragOverIndex = null;
    
    cards.forEach(card => {
        card.setAttribute('draggable', 'true');
        
        card.addEventListener('dragstart', (e) => {
            dragStartIndex = parseInt(card.dataset.index);
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
        
        card.addEventListener('dragend', (e) => {
            card.classList.remove('dragging');
            if (dragOverIndex !== null && dragStartIndex !== null && dragStartIndex !== dragOverIndex) {
                const [movedItem] = workouts.splice(dragStartIndex, 1);
                workouts.splice(dragOverIndex, 0, movedItem);
                saveWorkouts();
            }
            dragStartIndex = null;
            dragOverIndex = null;
        });
        
        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            const targetIndex = parseInt(card.dataset.index);
            if (targetIndex !== dragOverIndex) {
                dragOverIndex = targetIndex;
            }
        });
    });
}

function setupWorkoutCardMenus() {
    const menuBtns = document.querySelectorAll('.workout-menu-btn');
    menuBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            showWorkoutMenu(btn, index);
        });
    });
}

function showWorkoutMenu(button, index) {
    const menu = document.getElementById('workout-menu');
    if (!menu) return;
    
    editingWorkoutIndex = index;
    const rect = button.getBoundingClientRect();
    
    menu.style.display = 'block';
    menu.style.position = 'fixed';
    menu.style.top = rect.bottom + 5 + 'px';
    menu.style.right = (window.innerWidth - rect.right) + 'px';
}

function closeWorkoutMenu() {
    const menu = document.getElementById('workout-menu');
    if (menu) {
        menu.style.display = 'none';
    }
    editingWorkoutIndex = null;
}

function setupWorkoutMenu() {
    const menu = document.getElementById('workout-menu');
    const editBtn = document.getElementById('menu-edit');
    const copyBtn = document.getElementById('menu-copy');
    const deleteBtn = document.getElementById('menu-delete');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            if (editingWorkoutIndex !== null) {
                const indexToEdit = editingWorkoutIndex;
                closeWorkoutMenu();
                openEditModal(indexToEdit);
            }
        });
    }
    
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (editingWorkoutIndex !== null) {
                copyWorkout(editingWorkoutIndex);
                closeWorkoutMenu();
            }
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (editingWorkoutIndex !== null && confirm('Удалить тренировку?')) {
                workouts.splice(editingWorkoutIndex, 1);
                saveWorkouts();
                closeWorkoutMenu();
            }
        });
    }
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.workout-menu-btn') && !e.target.closest('#workout-menu')) {
            closeWorkoutMenu();
        }
    });
}

function copyWorkout(index) {
    const original = workouts[index];
    const copy = {
        ...original,
        id: Date.now(),
        name: original.name + ' (копия)'
    };
    workouts.splice(index + 1, 0, copy);
    saveWorkouts();
}

function openEditModal(index) {
    const workout = workouts[index];
    if (!workout) return;
    
    const modal = document.getElementById('workout-modal');
    const modalTitle = document.getElementById('modal-title');
    const nameInput = document.getElementById('workout-name');
    const daySelect = document.getElementById('workout-day');
    const confirmBtn = document.getElementById('confirm-workout-btn');
    const cancelBtn = document.getElementById('cancel-workout-btn');
    
    modalTitle.textContent = 'Редактировать тренировку';
    nameInput.value = workout.name;
    daySelect.value = workout.day;
    
    const saveHandler = function() {
        const newName = nameInput.value.trim();
        const newDay = daySelect.value;
        
        if (newName) {
            workouts[index].name = newName;
            workouts[index].day = newDay;
            saveWorkouts();
            modal.style.display = 'none';
            cleanup();
        } else {
            alert('Введите название тренировки');
        }
    };
    
    const cleanup = function() {
        confirmBtn.removeEventListener('click', saveHandler);
        cancelBtn.removeEventListener('click', cancelHandler);
        modal.removeEventListener('click', outsideHandler);
    };
    
    const cancelHandler = function() {
        modal.style.display = 'none';
        cleanup();
    };
    
    const outsideHandler = function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            cleanup();
        }
    };
    
    confirmBtn.addEventListener('click', saveHandler);
    cancelBtn.addEventListener('click', cancelHandler);
    modal.addEventListener('click', outsideHandler);
    
    modal.style.display = 'flex';
}

function addWorkout(name, day) {
    if (!name || name.trim() === '') {
        alert('Введите название тренировки');
        return false;
    }
    
    workouts.push({
        id: Date.now(),
        name: name.trim(),
        day: day,
        createdAt: new Date().toISOString(),
        exercises: []
    });
    
    saveWorkouts();
    return true;
}

// ==================== ФУНКЦИИ ЗАСТАВКИ ====================

function setupSplashScreen() {
    const splash = document.getElementById("splash-screen");
    const pageCalendar = document.getElementById("page-calendar");
    
    if (!splash || !pageCalendar) return;
    
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
    const pageCalendar = document.getElementById("page-calendar");
    
    if (splash && pageCalendar) {
        splash.style.opacity = "0";
        setTimeout(() => {
            splash.style.display = "none";
            pageCalendar.style.display = "block";
            
            setTimeout(() => {
                setInitialPositionToCurrentMonth();
                isFirstLoad = false;
            }, 50);
        }, 300);
    }
}

// ==================== ФУНКЦИИ НАВИГАЦИИ ====================

function setupNavigation() {
    const backBtn = document.getElementById('back-to-calendar-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showPage('calendar');
        });
    }
    
    const backToWorkoutListBtn = document.getElementById('back-to-workout-list-btn');
    if (backToWorkoutListBtn) {
        backToWorkoutListBtn.addEventListener('click', () => {
            showPage('workout');
        });
    }
    
    const addExerciseToWorkoutBtn = document.getElementById('add-exercise-to-workout-btn');
    if (addExerciseToWorkoutBtn) {
        addExerciseToWorkoutBtn.addEventListener('click', () => {
            openSelectExercisesPage();
        });
    }
    
    const backToWorkoutFromSelect = document.getElementById('back-to-workout-from-select');
    if (backToWorkoutFromSelect) {
        backToWorkoutFromSelect.addEventListener('click', () => {
            showPage('workout-detail');
        });
    }
    
    const confirmSelectExercisesBtn = document.getElementById('confirm-select-exercises-btn');
    if (confirmSelectExercisesBtn) {
        confirmSelectExercisesBtn.addEventListener('click', () => {
            addSelectedExercisesToWorkout();
        });
    }
    
    const backToMainFromExercises = document.getElementById('back-to-main-from-exercises');
    if (backToMainFromExercises) {
        backToMainFromExercises.addEventListener('click', () => {
            showPage('calendar');
        });
    }
    
    const backToExercisesFromTriceps = document.getElementById('back-to-exercises-from-triceps');
    if (backToExercisesFromTriceps) {
        backToExercisesFromTriceps.addEventListener('click', () => {
            showPage('exercises');
        });
    }
    
    const backToTricepsFromDetail = document.getElementById('back-to-triceps-from-detail');
    if (backToTricepsFromDetail) {
        backToTricepsFromDetail.addEventListener('click', () => {
            showPage('triceps');
        });
    }
    
    const backToExercisesFromChest = document.getElementById('back-to-exercises-from-chest');
    if (backToExercisesFromChest) {
        backToExercisesFromChest.addEventListener('click', () => {
            showPage('exercises');
        });
    }
    
    const backToExercisesFromShoulder = document.getElementById('back-to-exercises-from-shoulder');
    if (backToExercisesFromShoulder) {
        backToExercisesFromShoulder.addEventListener('click', () => {
            showPage('exercises');
        });
    }
    
    const backToExercisesFromBiceps = document.getElementById('back-to-exercises-from-biceps');
    if (backToExercisesFromBiceps) {
        backToExercisesFromBiceps.addEventListener('click', () => {
            showPage('exercises');
        });
    }
    
    const backToExercisesFromAbs = document.getElementById('back-to-exercises-from-abs');
    if (backToExercisesFromAbs) {
        backToExercisesFromAbs.addEventListener('click', () => {
            showPage('exercises');
        });
    }
    
    const backToExercisesFromBack = document.getElementById('back-to-exercises-from-back');
    if (backToExercisesFromBack) {
        backToExercisesFromBack.addEventListener('click', () => {
            showPage('exercises');
        });
    }
    
    const backToExercisesFromForearms = document.getElementById('back-to-exercises-from-forearms');
    if (backToExercisesFromForearms) {
        backToExercisesFromForearms.addEventListener('click', () => {
            showPage('exercises');
        });
    }
    
    const backToExercisesFromUpperlegs = document.getElementById('back-to-exercises-from-upperlegs');
    if (backToExercisesFromUpperlegs) {
        backToExercisesFromUpperlegs.addEventListener('click', () => {
            showPage('exercises');
        });
    }
    
    const backToExercisesFromGlutes = document.getElementById('back-to-exercises-from-glutes');
    if (backToExercisesFromGlutes) {
        backToExercisesFromGlutes.addEventListener('click', () => {
            showPage('exercises');
        });
    }
    
    const backToExercisesFromCardio = document.getElementById('back-to-exercises-from-cardio');
    if (backToExercisesFromCardio) {
        backToExercisesFromCardio.addEventListener('click', () => {
            showPage('exercises');
        });
    }
    
    const backToExercisesFromLowerlegs = document.getElementById('back-to-exercises-from-lowerlegs');
    if (backToExercisesFromLowerlegs) {
        backToExercisesFromLowerlegs.addEventListener('click', () => {
            showPage('exercises');
        });
    }
    
    document.addEventListener('backbutton', (e) => {
        if (currentPage === 'workout-detail') {
            e.preventDefault();
            showPage('workout');
        } else if (currentPage === 'workout') {
            e.preventDefault();
            showPage('calendar');
        } else if (currentPage === 'exercises') {
            e.preventDefault();
            showPage('calendar');
        } else if (currentPage === 'triceps') {
            e.preventDefault();
            showPage('exercises');
        } else if (currentPage === 'exercise-detail') {
            e.preventDefault();
            showPage('triceps');
        } else if (currentPage === 'select-exercise') {
            e.preventDefault();
            showPage('workout-detail');
        } else if (currentPage === 'exercise-detail-from-workout') {
            e.preventDefault();
            showPage('workout-detail');
        } else if (currentPage !== 'calendar') {
            e.preventDefault();
            showPage('exercises');
        }
    }, false);
}

function setupBottomNav() {
    const navTraining = document.getElementById('nav-training');
    const navExercises = document.getElementById('nav-exercises');
    const navProgress = document.getElementById('nav-progress');
    
    if (navTraining) {
        navTraining.addEventListener('click', () => {
            showPage('workout');
            updateActiveNav('nav-training');
        });
    }
    
    if (navExercises) {
        navExercises.addEventListener('click', async () => {
            await loadExercisesGrid();
            showPage('exercises');
            updateActiveNav('nav-exercises');
        });
    }
    
    if (navProgress) {
        navProgress.addEventListener('click', () => {
            alert('Страница прогресса в разработке');
            updateActiveNav('nav-progress');
        });
    }
    
    updateActiveNav('nav-training');
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

function showPage(pageName) {
    if (pageCalendar) pageCalendar.style.display = 'none';
    if (pageWorkout) pageWorkout.style.display = 'none';
    if (pageWorkoutDetail) pageWorkoutDetail.style.display = 'none';
    if (pageExercises) pageExercises.style.display = 'none';
    if (pageTriceps) pageTriceps.style.display = 'none';
    if (pageChest) pageChest.style.display = 'none';
    if (pageShoulder) pageShoulder.style.display = 'none';
    if (pageBiceps) pageBiceps.style.display = 'none';
    if (pageAbs) pageAbs.style.display = 'none';
    if (pageBack) pageBack.style.display = 'none';
    if (pageForearms) pageForearms.style.display = 'none';
    if (pageUpperlegs) pageUpperlegs.style.display = 'none';
    if (pageGlutes) pageGlutes.style.display = 'none';
    if (pageCardio) pageCardio.style.display = 'none';
    if (pageLowerlegs) pageLowerlegs.style.display = 'none';
    if (pageExerciseDetail) pageExerciseDetail.style.display = 'none';
    if (pageSelectExercise) pageSelectExercise.style.display = 'none';
    if (pageExerciseDetailFromWorkout) pageExerciseDetailFromWorkout.style.display = 'none';
    
    if (pageName === 'calendar') {
        if (pageCalendar) pageCalendar.style.display = 'block';
        currentPage = 'calendar';
        updateActiveNav('nav-training');
    } else if (pageName === 'workout') {
        if (pageWorkout) pageWorkout.style.display = 'block';
        currentPage = 'workout';
        updateActiveNav('nav-training');
        renderWorkoutsList();
    } else if (pageName === 'workout-detail') {
        if (pageWorkoutDetail) pageWorkoutDetail.style.display = 'block';
        currentPage = 'workout-detail';
    } else if (pageName === 'exercises') {
        if (pageExercises) {
            pageExercises.style.display = 'block';
        }
        currentPage = 'exercises';
        updateActiveNav('nav-exercises');
    } else if (pageName === 'triceps') {
        if (pageTriceps) pageTriceps.style.display = 'block';
        currentPage = 'triceps';
        localStorage.setItem('lastCategory', 'triceps');
    } else if (pageName === 'chest') {
        if (pageChest) pageChest.style.display = 'block';
        currentPage = 'chest';
        localStorage.setItem('lastCategory', 'chest');
    } else if (pageName === 'shoulder') {
        if (pageShoulder) pageShoulder.style.display = 'block';
        currentPage = 'shoulder';
        localStorage.setItem('lastCategory', 'shoulder');
    } else if (pageName === 'biceps') {
        if (pageBiceps) pageBiceps.style.display = 'block';
        currentPage = 'biceps';
        localStorage.setItem('lastCategory', 'biceps');
    } else if (pageName === 'abs') {
        if (pageAbs) pageAbs.style.display = 'block';
        currentPage = 'abs';
        localStorage.setItem('lastCategory', 'abs');
    } else if (pageName === 'back') {
        if (pageBack) pageBack.style.display = 'block';
        currentPage = 'back';
        localStorage.setItem('lastCategory', 'back');
    } else if (pageName === 'forearms') {
        if (pageForearms) pageForearms.style.display = 'block';
        currentPage = 'forearms';
        localStorage.setItem('lastCategory', 'forearms');
    } else if (pageName === 'upperlegs') {
        if (pageUpperlegs) pageUpperlegs.style.display = 'block';
        currentPage = 'upperlegs';
        localStorage.setItem('lastCategory', 'upperlegs');
    } else if (pageName === 'glutes') {
        if (pageGlutes) pageGlutes.style.display = 'block';
        currentPage = 'glutes';
        localStorage.setItem('lastCategory', 'glutes');
    } else if (pageName === 'cardio') {
        if (pageCardio) pageCardio.style.display = 'block';
        currentPage = 'cardio';
        localStorage.setItem('lastCategory', 'cardio');
    } else if (pageName === 'lowerlegs') {
        if (pageLowerlegs) pageLowerlegs.style.display = 'block';
        currentPage = 'lowerlegs';
        localStorage.setItem('lastCategory', 'lowerlegs');
    } else if (pageName === 'exercise-detail') {
        if (pageExerciseDetail) pageExerciseDetail.style.display = 'block';
        currentPage = 'exercise-detail';
    } else if (pageName === 'select-exercise') {
        if (pageSelectExercise) pageSelectExercise.style.display = 'block';
        currentPage = 'select-exercise';
    } else if (pageName === 'exercise-detail-from-workout') {
        if (pageExerciseDetailFromWorkout) pageExerciseDetailFromWorkout.style.display = 'block';
        currentPage = 'exercise-detail-from-workout';
    }
}

function openWorkoutPage(date) {
    selectedDate = date;
    showPage('workout');
}

function openExerciseDetail(name, imgSrc) {
    const detailName = document.getElementById('exercise-detail-name');
    const detailImg = document.getElementById('exercise-detail-img');
    
    if (detailName) detailName.textContent = name;
    if (detailImg) detailImg.src = imgSrc;
    
    currentSets = [{ set: 1, kg: 0, reps: 0, completed: false }];
    renderSets();
    
    showPage('exercise-detail');
}

function renderSets() {
    const setsList = document.getElementById('sets-list');
    if (!setsList) return;
    
    setsList.innerHTML = currentSets.map((set, index) => `
        <div class="set-row" data-index="${index}">
            <div class="set-number">${set.set}</div>
            <input type="number" class="set-input set-kg" value="${set.kg === 0 ? '' : set.kg}" placeholder="0" step="0.5">
            <input type="number" class="set-input set-reps" value="${set.reps === 0 ? '' : set.reps}" placeholder="0" step="1">
            <div class="set-checkbox">
                <input type="checkbox" class="set-completed" ${set.completed ? 'checked' : ''} ${(set.kg === 0 || set.reps === 0) ? 'disabled' : ''}>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('#sets-list .set-row').forEach((row, idx) => {
        const kgInput = row.querySelector('.set-kg');
        const repsInput = row.querySelector('.set-reps');
        const completedCheckbox = row.querySelector('.set-completed');
        
        if (kgInput) {
            kgInput.addEventListener('input', (e) => {
                let value = e.target.value;
                if (value.startsWith('0') && value.length > 1) {
                    value = value.replace(/^0+/, '');
                    e.target.value = value;
                }
                currentSets[idx].kg = parseFloat(value) || 0;
                
                if (completedCheckbox) {
                    const kgValid = currentSets[idx].kg > 0;
                    const repsValid = currentSets[idx].reps > 0;
                    completedCheckbox.disabled = !(kgValid && repsValid);
                    if (completedCheckbox.disabled) {
                        completedCheckbox.checked = false;
                        currentSets[idx].completed = false;
                    }
                }
            });
        }
        
        if (repsInput) {
            repsInput.addEventListener('input', (e) => {
                let value = e.target.value;
                if (value.startsWith('0') && value.length > 1) {
                    value = value.replace(/^0+/, '');
                    e.target.value = value;
                }
                currentSets[idx].reps = parseInt(value) || 0;
                
                if (completedCheckbox) {
                    const kgValid = currentSets[idx].kg > 0;
                    const repsValid = currentSets[idx].reps > 0;
                    completedCheckbox.disabled = !(kgValid && repsValid);
                    if (completedCheckbox.disabled) {
                        completedCheckbox.checked = false;
                        currentSets[idx].completed = false;
                    }
                }
            });
        }
        
        if (completedCheckbox) {
            completedCheckbox.addEventListener('change', (e) => {
                if (!completedCheckbox.disabled) {
                    currentSets[idx].completed = e.target.checked;
                } else {
                    e.target.checked = false;
                    alert('Заполните вес и количество повторений');
                }
            });
        }
    });
}

function setupExerciseDetail() {
    const addSetBtn = document.getElementById('add-set-btn');
    const removeSetBtn = document.getElementById('remove-set-btn');
    
    if (addSetBtn) {
        addSetBtn.addEventListener('click', () => {
            const newSetNumber = currentSets.length + 1;
            currentSets.push({ set: newSetNumber, kg: 0, reps: 0, completed: false });
            renderSets();
        });
    }
    
    if (removeSetBtn) {
        removeSetBtn.addEventListener('click', () => {
            if (currentSets.length > 1) {
                currentSets.pop();
                renderSets();
            } else {
                alert('Нельзя удалить последний сет');
            }
        });
    }
}

// ==================== МОДАЛЬНОЕ ОКНО ====================

function setupModal() {
    const addBtn = document.getElementById('add-workout-btn');
    const modal = document.getElementById('workout-modal');
    const cancelBtn = document.getElementById('cancel-workout-btn');
    const confirmBtn = document.getElementById('confirm-workout-btn');
    const workoutName = document.getElementById('workout-name');
    const modalTitle = document.getElementById('modal-title');
    const daySelect = document.getElementById('workout-day');
    
    function createWorkoutHandler() {
        const name = workoutName ? workoutName.value.trim() : '';
        const day = daySelect ? daySelect.value : 'any';
        if (addWorkout(name, day)) {
            modal.style.display = 'none';
            renderWorkoutsList();
        }
    }
    
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            modalTitle.textContent = 'Создать тренировку';
            workoutName.value = '';
            daySelect.value = 'any';
            
            confirmBtn.onclick = null;
            confirmBtn.addEventListener('click', createWorkoutHandler);
            
            modal.style.display = 'flex';
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// ==================== ФУНКЦИИ КАЛЕНДАРЯ ====================

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
    
    const height = weekdaysHeight + (weeks * dayCellHeight) + padding;
    
    return height;
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
            openWorkoutPage(dateStr);
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

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

setTimeout(() => {
    const scrollContainer = document.getElementById('calendar-scroll');
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', () => {
            updateMonthHeader();
        });
    }
}, 200);
