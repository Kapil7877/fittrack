let editingWorkoutId = null;

const form = document.getElementById('workout-form');
const workoutsList = document.getElementById('workouts-list');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const goalInput = document.getElementById('goal-input');
const setGoalBtn = document.getElementById('set-goal-btn');
const goalProgress = document.getElementById('goal-progress');
const goalText = document.getElementById('goal-text');
const goalCurrent = document.getElementById('goal-current');
const progressFill = document.getElementById('progress-fill');

const workoutTypeInput = document.getElementById('workout-type');
const durationInput = document.getElementById('duration');
const caloriesInput = document.getElementById('calories');
const workoutDateInput = document.getElementById('workout-date');
const notesInput = document.getElementById('notes');

workoutDateInput.valueAsDate = new Date();

function updateGoalDisplay() {
    const goal = getWeeklyGoal();
    const weeklyWorkouts = getWeeklyWorkouts();
    const current = weeklyWorkouts.length;
    
    if (goal > 0) {
        goalProgress.style.display = 'block';
        goalText.textContent = `Goal: ${goal} workouts`;
        goalCurrent.textContent = `${current} / ${goal}`;
        
        const percentage = Math.min((current / goal) * 100, 100);
        progressFill.style.width = `${percentage}%`;
        
        goalInput.value = goal;
    }
}

setGoalBtn.addEventListener('click', () => {
    const goal = parseInt(goalInput.value);
    if (goal && goal > 0) {
        setWeeklyGoal(goal);
        updateGoalDisplay();
    }
});

function renderWorkouts() {
    const workouts = getAllWorkouts();
    
    if (workouts.length === 0) {
        workoutsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No workouts logged yet. Start tracking your fitness journey!</p>';
        return;
    }
    
    workoutsList.innerHTML = workouts.map(workout => `
        <div class="workout-item">
            <div class="workout-header">
                <div class="workout-type">${workout.type}</div>
                <div class="workout-date">${new Date(workout.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
            </div>
            <div class="workout-details">
                <div class="workout-detail">
                    <span class="detail-label">Duration</span>
                    <span class="detail-value">${workout.duration} min</span>
                </div>
                <div class="workout-detail">
                    <span class="detail-label">Calories</span>
                    <span class="detail-value">${workout.calories}</span>
                </div>
            </div>
            ${workout.notes ? `<div class="workout-notes">${workout.notes}</div>` : ''}
            <div class="workout-actions">
                <button class="btn btn-small btn-edit" onclick="editWorkout('${workout.id}')">Edit</button>
                <button class="btn btn-small btn-delete" onclick="deleteWorkoutHandler('${workout.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const workout = {
        type: workoutTypeInput.value,
        duration: parseInt(durationInput.value),
        calories: parseInt(caloriesInput.value),
        date: workoutDateInput.value,
        notes: notesInput.value.trim()
    };
    
    if (editingWorkoutId) {
        updateWorkout(editingWorkoutId, workout);
        editingWorkoutId = null;
        formTitle.textContent = 'Add Workout';
        submitBtn.textContent = 'Add Workout';
        cancelBtn.style.display = 'none';
    } else {
        saveWorkout(workout);
    }
    
    form.reset();
    workoutDateInput.valueAsDate = new Date();
    renderWorkouts();
    updateGoalDisplay();
});

function editWorkout(id) {
    const workout = getWorkoutById(id);
    if (!workout) return;
    
    editingWorkoutId = id;
    workoutTypeInput.value = workout.type;
    durationInput.value = workout.duration;
    caloriesInput.value = workout.calories;
    workoutDateInput.value = workout.date;
    notesInput.value = workout.notes || '';
    
    formTitle.textContent = 'Edit Workout';
    submitBtn.textContent = 'Update Workout';
    cancelBtn.style.display = 'inline-block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

cancelBtn.addEventListener('click', () => {
    editingWorkoutId = null;
    form.reset();
    workoutDateInput.valueAsDate = new Date();
    formTitle.textContent = 'Add Workout';
    submitBtn.textContent = 'Add Workout';
    cancelBtn.style.display = 'none';
});

function deleteWorkoutHandler(id) {
    if (confirm('Are you sure you want to delete this workout?')) {
        deleteWorkout(id);
        renderWorkouts();
        updateGoalDisplay();
    }
}

window.editWorkout = editWorkout;
window.deleteWorkoutHandler = deleteWorkoutHandler;

renderWorkouts();
updateGoalDisplay();