// ==================== МОДУЛЬ ДЕТАЛЕЙ ТРЕНИРОВКИ ====================

function initWorkoutDetail() {
    const backBtn = document.getElementById('back-to-workouts-from-detail');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.showPage('workouts');
        });
    }
    
    const addExerciseBtn = document.getElementById('add-exercise-btn');
    if (addExerciseBtn) {
        addExerciseBtn.addEventListener('click', () => {
            alert('Функционал добавления упражнений в разработке');
        });
    }
}

window.initWorkoutDetail = initWorkoutDetail;
