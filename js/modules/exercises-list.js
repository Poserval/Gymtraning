// ==================== МОДУЛЬ ГЛАВНОЙ СТРАНИЦЫ УПРАЖНЕНИЙ ====================

function initExercisesList() {
    const backBtn = document.getElementById('back-to-main-from-exercises');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.showPage('calendar');
        });
    }
    
    const categories = document.querySelectorAll('.exercise-category');
    categories.forEach(category => {
        category.addEventListener('click', () => {
            const categoryData = category.getAttribute('data-category');
            
            if (categoryData === 'triceps') {
                window.showPage('triceps');
            } else if (categoryData === 'all') {
                alert('Раздел "Все" в разработке');
            } else {
                const categoryName = category.querySelector('.category-name')?.textContent || '';
                alert(`Упражнения для ${categoryName} в разработке`);
            }
        });
    });
}

window.initExercisesList = initExercisesList;
