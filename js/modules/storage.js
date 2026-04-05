// ==================== МОДУЛЬ ХРАНИЛИЩА ====================
let workouts = [];

function loadWorkouts() {
    const savedWorkouts = localStorage.getItem('gym_workouts_list');
    if (savedWorkouts) {
        workouts = JSON.parse(savedWorkouts);
    } else {
        workouts = [];
    }
    return workouts;
}

function saveWorkouts(data) {
    workouts = data;
    localStorage.setItem('gym_workouts_list', JSON.stringify(workouts));
    if (window.renderWorkoutsList) {
        window.renderWorkoutsList();
    }
}

function getWorkouts() {
    return workouts;
}

function addWorkoutToStorage(name, day) {
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
    
    saveWorkouts(workouts);
    return true;
}

function updateWorkoutInStorage(index, name, day) {
    if (index !== null && workouts[index]) {
        workouts[index].name = name;
        workouts[index].day = day;
        saveWorkouts(workouts);
        return true;
    }
    return false;
}

function deleteWorkoutFromStorage(index) {
    if (index !== null && workouts[index]) {
        workouts.splice(index, 1);
        saveWorkouts(workouts);
        return true;
    }
    return false;
}

function copyWorkoutInStorage(index) {
    if (workouts[index]) {
        const copy = {
            ...workouts[index],
            id: Date.now(),
            name: workouts[index].name + ' (копия)'
        };
        workouts.splice(index + 1, 0, copy);
        saveWorkouts(workouts);
        return true;
    }
    return false;
}

// Экспорт
window.loadWorkouts = loadWorkouts;
window.saveWorkouts = saveWorkouts;
window.getWorkouts = getWorkouts;
window.addWorkoutToStorage = addWorkoutToStorage;
window.updateWorkoutInStorage = updateWorkoutInStorage;
window.deleteWorkoutFromStorage = deleteWorkoutFromStorage;
window.copyWorkoutInStorage = copyWorkoutInStorage;
