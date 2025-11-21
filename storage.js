const WORKOUTS_KEY = 'fittrack_workouts';
const GOAL_KEY = 'fittrack_goal';

function getAllWorkouts() {
    const data = localStorage.getItem(WORKOUTS_KEY);
    return data ? JSON.parse(data) : [];
}

function saveWorkout(workout) {
    const workouts = getAllWorkouts();
    workout.id = Date.now().toString();
    workouts.unshift(workout);
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
    return workout;
}

function updateWorkout(id, updatedWorkout) {
    const workouts = getAllWorkouts();
    const index = workouts.findIndex(w => w.id === id);
    if (index !== -1) {
        workouts[index] = { ...updatedWorkout, id };
        localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
        return workouts[index];
    }
    return null;
}

function deleteWorkout(id) {
    const workouts = getAllWorkouts();
    const filtered = workouts.filter(w => w.id !== id);
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(filtered));
    return true;
}

function getWorkoutById(id) {
    const workouts = getAllWorkouts();
    return workouts.find(w => w.id === id);
}

function getWeeklyGoal() {
    const goal = localStorage.getItem(GOAL_KEY);
    return goal ? parseInt(goal) : 0;
}

function setWeeklyGoal(goal) {
    localStorage.setItem(GOAL_KEY, goal.toString());
}

function getWeeklyWorkouts() {
    const workouts = getAllWorkouts();
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    return workouts.filter(w => new Date(w.date) >= weekStart);
}

function getMonthlyWorkouts() {
    const workouts = getAllWorkouts();
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    return workouts.filter(w => new Date(w.date) >= monthStart);
}