// ==================== КАРТОЧКА УПРАЖНЕНИЯ ====================
let currentSets = [{ set: 1, kg: 0, reps: 0, completed: false }];

function setupExerciseDetail() {
    const addSetBtn = document.getElementById('add-set-btn');
    const removeSetBtn = document.getElementById('remove-set-btn');
    
    if (addSetBtn) {
        // Убираем старые обработчики, чтобы не дублировать
        const newAddBtn = addSetBtn.cloneNode(true);
        addSetBtn.parentNode.replaceChild(newAddBtn, addSetBtn);
        
        newAddBtn.addEventListener('click', () => {
            const newSetNumber = currentSets.length + 1;
            currentSets.push({ set: newSetNumber, kg: 0, reps: 0, completed: false });
            renderSets();
        });
    }
    
    if (removeSetBtn) {
        // Убираем старые обработчики, чтобы не дублировать
        const newRemoveBtn = removeSetBtn.cloneNode(true);
        removeSetBtn.parentNode.replaceChild(newRemoveBtn, removeSetBtn);
        
        newRemoveBtn.addEventListener('click', () => {
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
    
    // Автопрокрутка вниз
    if (setsList) {
        setsList.scrollTop = setsList.scrollHeight;
    }
}

function setupFavoriteButtons() {
    const favoriteBtns = document.querySelectorAll('.exercise-favorite-btn');
    favoriteBtns.forEach(btn => {
        // Убираем старые обработчики
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isFavorite = newBtn.getAttribute('data-favorite') === 'true';
            newBtn.setAttribute('data-favorite', (!isFavorite).toString());
            
            if (!isFavorite) {
                newBtn.classList.add('active');
                const svgPath = newBtn.querySelector('svg path');
                if (svgPath) {
                    svgPath.setAttribute('fill', '#ff9800');
                    svgPath.setAttribute('stroke', '#ff9800');
                }
            } else {
                newBtn.classList.remove('active');
                const svgPath = newBtn.querySelector('svg path');
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
    currentSets = [{ set: 1, kg: 0, reps: 0, completed: false }];
    renderSets();
    
    showPage('exercise-detail');
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    setupExerciseDetail();
    setupFavoriteButtons();
    renderSets();
})
