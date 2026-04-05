// ==================== МОДУЛЬ ТРИЦЕПС ====================

function initTriceps() {
    const backBtn = document.getElementById('back-to-exercises-from-triceps');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.showPage('exercises-list');
        });
    }
    
    const addBtn = document.getElementById('add-triceps-exercise-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            alert('Функционал добавления упражнений в разработке');
        });
    }
    
    const sortBtn = document.getElementById('sort-triceps-btn');
    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            alert('Функционал сортировки в разработке');
        });
    }
    
    // Обработка нажатий на вкладки упражнений
    const exerciseItems = document.querySelectorAll('#triceps-exercises-list .exercise-item');
    exerciseItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.exercise-favorite-btn')) {
                const exerciseName = item.getAttribute('data-name') || item.querySelector('.exercise-item-name')?.textContent || 'Упражнение';
                const exerciseImg = item.querySelector('.exercise-image')?.src || '';
                openExerciseDetail(exerciseName, exerciseImg);
            }
        });
    });
    
    // Обработка кнопок избранного
    const favoriteBtns = document.querySelectorAll('#triceps-exercises-list .exercise-favorite-btn');
    favoriteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isFavorite = btn.getAttribute('data-favorite') === 'true';
            btn.setAttribute('data-favorite', (!isFavorite).toString());
            
            if (!isFavorite) {
                btn.classList.add('active');
                const svgPath = btn.querySelector('svg path');
                if (svgPath) {
                    svgPath.setAttribute('fill', '#ff9800');
                    svgPath.setAttribute('stroke', '#ff9800');
                }
            } else {
                btn.classList.remove('active');
                const svgPath = btn.querySelector('svg path');
                if (svgPath) {
                    svgPath.setAttribute('fill', 'none');
                    svgPath.setAttribute('stroke', 'white');
                }
            }
        });
    });
}

function openExerciseDetail(name, imgSrc) {
    const detailName = document.getElementById('exercise-detail-name');
    const detailImg = document.getElementById('exercise-detail-img');
    
    if (detailName) detailName.textContent = name;
    if (detailImg) detailImg.src = imgSrc;
    
    // Сбрасываем сеты
    if (window.resetSets) {
        window.resetSets();
    }
    
    window.showPage('exercise-detail');
}

window.initTriceps = initTriceps;
window.openExerciseDetail = openExerciseDetail;
