// ==================== МОДУЛЬ ДЕТАЛЬНОГО ПРОСМОТРА УПРАЖНЕНИЯ ====================
let currentSets = [{ set: 1, kg: 0, reps: 0, completed: false }];

function initExerciseDetail() {
    const backBtn = document.getElementById('back-to-triceps-from-detail');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.showPage('triceps');
        });
    }
    
    const addSetBtn = document.getElementById('add-set-btn');
    if (addSetBtn) {
        addSetBtn.addEventListener('click', () => {
            const newSetNumber = currentSets.length + 1;
            currentSets.push({ set: newSetNumber, kg: 0, reps: 0, completed: false });
            renderSets();
        });
    }
    
    renderSets();
}

function renderSets() {
    const setsList = document.getElementById('sets-list');
    if (!setsList) return;
    
    setsList.innerHTML = currentSets.map((set, index) => `
        <div class="set-row" data-index="${index}">
            <div class="set-number">${set.set}</div>
            <input type="number" class="set-input set-kg" value="${set.kg}" placeholder="0" step="0.5">
            <input type="number" class="set-input set-reps" value="${set.reps}" placeholder="0" step="1">
            <div class="set-checkbox">
                <input type="checkbox" class="set-completed" ${set.completed ? 'checked' : ''}>
            </div>
        </div>
    `).join('');
    
    // Добавляем обработчики для всех полей
    document.querySelectorAll('.set-row').forEach((row, idx) => {
        const kgInput = row.querySelector('.set-kg');
        const repsInput = row.querySelector('.set-reps');
        const completedCheckbox = row.querySelector('.set-completed');
        
        if (kgInput) {
            kgInput.addEventListener('change', (e) => {
                currentSets[idx].kg = parseFloat(e.target.value) || 0;
            });
        }
        
        if (repsInput) {
            repsInput.addEventListener('change', (e) => {
                currentSets[idx].reps = parseInt(e.target.value) || 0;
            });
        }
        
        if (completedCheckbox) {
            completedCheckbox.addEventListener('change', (e) => {
                currentSets[idx].completed = e.target.checked;
            });
        }
    });
}

function resetSets() {
    currentSets = [{ set: 1, kg: 0, reps: 0, completed: false }];
    renderSets();
}

window.initExerciseDetail = initExerciseDetail;
window.resetSets = resetSets;
