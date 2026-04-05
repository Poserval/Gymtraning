// Загрузчик карточек упражнений для категорий
async function loadExercisesForCategory(categoryId, containerId, emptyMessageId) {
    const container = document.getElementById(containerId);
    const emptyMessage = document.getElementById(emptyMessageId);
    
    if (!container) return;
    
    try {
        // Пытаемся загрузить JSON с упражнениями для категории
        const response = await fetch(`assets/exercises/${categoryId}/exercises/${categoryId}.json`);
        
        if (!response.ok) {
            throw new Error('Файл не найден');
        }
        
        const data = await response.json();
        const exercises = data.exercises || [data]; // поддержка массива или одного объекта
        
        if (exercises.length === 0) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            container.style.display = 'none';
            return;
        }
        
        // Генерируем карточки
        container.innerHTML = exercises.map(ex => `
            <div class="exercise-item" data-exercise-id="${ex.id}" data-exercise-name="${ex.name}" data-exercise-img="${ex.image}">
                <div class="exercise-item-left">
                    <img src="${ex.image}" alt="${ex.name}" class="exercise-image" onerror="this.src='assets/icon-desktop-192.png'">
                </div>
                <div class="exercise-item-center">
                    <span class="exercise-item-name">${escapeHtml(ex.name)}</span>
                </div>
                <div class="exercise-item-right">
                    <button class="exercise-favorite-btn" data-favorite="false">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="none" stroke="white" stroke-width="1.5"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
        
        container.style.display = 'flex';
        if (emptyMessage) emptyMessage.style.display = 'none';
        
        // Переназначаем обработчики для звездочек
        setupFavoriteButtons();
        
        // Переназначаем обработчики кликов по карточкам
        document.querySelectorAll(`#${containerId} .exercise-item`).forEach(item => {
            item.addEventListener('click', () => {
                const name = item.dataset.exerciseName;
                const img = item.dataset.exerciseImg;
                openExerciseDetail(name, img);
            });
        });
        
    } catch (error) {
        console.error(`Ошибка загрузки упражнений для ${categoryId}:`, error);
        if (emptyMessage) {
            emptyMessage.innerHTML = '<p>Ошибка загрузки упражнений</p><p style="margin-top: 10px; color: #888;">Проверьте наличие файла exercises.json</p>';
            emptyMessage.style.display = 'block';
        }
        container.style.display = 'none';
    }
}

// Загрузка для страницы Трицепс
function loadTricepsExercises() {
    loadExercisesForCategory('triceps', 'triceps-exercises-list', 'empty-triceps');
}

// Заглушка для остальных категорий (пока пустые)
function loadChestExercises() { loadExercisesForCategory('chest', 'chest-exercises-list', 'empty-chest'); }
function loadShoulderExercises() { loadExercisesForCategory('shoulder', 'shoulder-exercises-list', 'empty-shoulder'); }
function loadBicepsExercises() { loadExercisesForCategory('biceps', 'biceps-exercises-list', 'empty-biceps'); }
function loadAbsExercises() { loadExercisesForCategory('abs', 'abs-exercises-list', 'empty-abs'); }
function loadBackExercises() { loadExercisesForCategory('back', 'back-exercises-list', 'empty-back'); }
function loadForearmsExercises() { loadExercisesForCategory('forearms', 'forearms-exercises-list', 'empty-forearms'); }
function loadUpperlegsExercises() { loadExercisesForCategory('upperlegs', 'upperlegs-exercises-list', 'empty-upperlegs'); }
function loadGlutesExercises() { loadExercisesForCategory('glutes', 'glutes-exercises-list', 'empty-glutes'); }
function loadCardioExercises() { loadExercisesForCategory('cardio', 'cardio-exercises-list', 'empty-cardio'); }
function loadLowerlegsExercises() { loadExercisesForCategory('lowerlegs', 'lowerlegs-exercises-list', 'empty-lowerlegs'); }
