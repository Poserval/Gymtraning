// ==================== КАРТОЧКА УПРАЖНЕНИЯ ====================
let currentSets = [{ set: 1, kg: 0, reps: 0, completed: false }];
let tricepsExercises = [];
let editingExerciseIndex = null;

// Загрузка упражнений трицепса из localStorage
function loadTricepsExercises() {
    const saved = localStorage.getItem('triceps_exercises');
    if (saved) {
        tricepsExercises = JSON.parse(saved);
    } else {
        // Начальное упражнение (стандартное, нельзя удалить)
        tricepsExercises = [
            {
                id: 'triceps_001',
                name: 'Жим от брусьев',
                image: 'assets/exercises/triceps/images/icon-triceps-001.png',
                isDefault: true,
                isFavorite: false
            }
        ];
        saveTricepsExercises();
    }
    renderTricepsExercises();
}

function saveTricepsExercises() {
    localStorage.setItem('triceps_exercises', JSON.stringify(tricepsExercises));
}

function renderTricepsExercises() {
    const container = document.getElementById('triceps-exercises-list');
    const emptyMessage = document.getElementById('empty-triceps');
    
    if (!container) return;
    
    if (tricepsExercises.length === 0) {
        container.style.display = 'none';
        if (emptyMessage) emptyMessage.style.display = 'block';
        return;
    }
    
    container.style.display = 'flex';
    if (emptyMessage) emptyMessage.style.display = 'none';
    
    container.innerHTML = tricepsExercises.map((ex, index) => `
        <div class="exercise-item" data-exercise-id="${ex.id}" data-exercise-name="${ex.name}" data-exercise-img="${ex.image}" data-index="${index}">
            <div class="exercise-item-left">
                <img src="${ex.image}" alt="${ex.name}" class="exercise-image" onerror="this.src='assets/icon-desktop-96.png'">
            </div>
            <div class="exercise-item-center">
                <span class="exercise-item-name">${escapeHtml(ex.name)}</span>
            </div>
            <div class="exercise-item-right">
                <button class="exercise-favorite-btn" data-favorite="${ex.isFavorite ? 'true' : 'false'}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="${ex.isFavorite ? '#ff9800' : 'none'}" stroke="${ex.isFavorite ? '#ff9800' : 'white'}" stroke-width="1.5"/>
                    </svg>
                </button>
                ${!ex.isDefault ? `
                <button class="exercise-menu-btn" data-index="${index}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="white"/>
                    </svg>
                </button>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    // Обработчики для карточек
    document.querySelectorAll('#triceps-exercises-list .exercise-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.exercise-menu-btn') && !e.target.closest('.exercise-favorite-btn')) {
                const name = item.dataset.exerciseName;
                const img = item.dataset.exerciseImg;
                openExerciseDetail(name, img);
            }
        });
    });
    
    // Обработчики для звездочек
    document.querySelectorAll('#triceps-exercises-list .exercise-favorite-btn').forEach((btn, idx) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.closest('.exercise-item').dataset.index);
            tricepsExercises[index].isFavorite = !tricepsExercises[index].isFavorite;
            saveTricepsExercises();
            renderTricepsExercises();
        });
    });
    
    // Обработчики для кнопок меню (три точки) — только у пользовательских упражнений
    document.querySelectorAll('#triceps-exercises-list .exercise-menu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            showExerciseMenu(btn, index);
        });
    });
}

// Меню для карточки упражнения
function showExerciseMenu(button, index) {
    const menu = document.getElementById('exercise-menu');
    if (!menu) return;
    
    editingExerciseIndex = index;
    const rect = button.getBoundingClientRect();
    
    menu.style.display = 'block';
    menu.style.position = 'fixed';
    menu.style.top = rect.bottom + 5 + 'px';
    menu.style.right = (window.innerWidth - rect.right) + 'px';
}

function closeExerciseMenu() {
    const menu = document.getElementById('exercise-menu');
    if (menu) menu.style.display = 'none';
    editingExerciseIndex = null;
}

function editExercise(index) {
    const exercise = tricepsExercises[index];
    if (!exercise) return;
    
    const modal = document.getElementById('exercise-modal');
    const modalTitle = document.getElementById('exercise-modal-title');
    const nameInput = document.getElementById('exercise-name');
    const confirmBtn = document.getElementById('confirm-exercise-btn');
    
    if (modalTitle) modalTitle.textContent = 'Редактировать упражнение';
    if (nameInput) nameInput.value = exercise.name;
    
    const oldConfirmHandler = confirmBtn.onclick;
    
    confirmBtn.onclick = () => {
        const newName = nameInput ? nameInput.value.trim() : '';
        if (newName) {
            tricepsExercises[index].name = newName;
            saveTricepsExercises();
            renderTricepsExercises();
            if (modal) modal.style.display = 'none';
            confirmBtn.onclick = oldConfirmHandler;
        } else {
            alert('Введите название упражнения');
        }
    };
    
    if (modal) modal.style.display = 'flex';
}

function deleteExercise(index) {
    if (confirm('Удалить упражнение?')) {
        tricepsExercises.splice(index, 1);
        saveTricepsExercises();
        renderTricepsExercises();
    }
}

// Настройка модального окна для упражнений
function setupExerciseModal() {
    const addBtn = document.getElementById('add-triceps-exercise-btn');
    const modal = document.getElementById('exercise-modal');
    const cancelBtn = document.getElementById('cancel-exercise-btn');
    const confirmBtn = document.getElementById('confirm-exercise-btn');
    const nameInput = document.getElementById('exercise-name');
    const modalTitle = document.getElementById('exercise-modal-title');
    
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (modal) {
                if (modalTitle) modalTitle.textContent = 'Создать упражнение';
                if (nameInput) nameInput.value = '';
                
                confirmBtn.onclick = () => {
                    const name = nameInput ? nameInput.value.trim() : '';
                    if (name) {
                        const newId = 'triceps_' + Date.now();
                        const defaultImage = 'assets/icon-desktop-96.png';
                        tricepsExercises.push({
                            id: newId,
                            name: name,
                            image: defaultImage,
                            isDefault: false,
                            isFavorite: false
                        });
                        saveTricepsExercises();
                        renderTricepsExercises();
                        if (modal) modal.style.display = 'none';
                    } else {
                        alert('Введите название упражнения');
                    }
                };
                
                modal.style.display = 'flex';
            }
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Настройка меню карточки упражнения
function setupExerciseMenu() {
    const menu = document.getElementById('exercise-menu');
    const editBtn = document.getElementById('exercise-menu-edit');
    const deleteBtn = document.getElementById('exercise-menu-delete');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            if (editingExerciseIndex !== null) {
                editExercise(editingExerciseIndex);
                closeExerciseMenu();
            }
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (editingExerciseIndex !== null) {
                deleteExercise(editingExerciseIndex);
                closeExerciseMenu();
            }
        });
    }
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.exercise-menu-btn') && !e.target.closest('#exercise-menu')) {
            closeExerciseMenu();
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
    
    document.querySelectorAll('.set-row').forEach((row, idx) => {
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
    
    if (setsList) {
        setsList.scrollTop = setsList.scrollHeight;
    }
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

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadTricepsExercises();
    setupExerciseModal();
    setupExerciseMenu();
    setupExerciseDetail();
});
