const weekWorkoutsEl = document.getElementById('week-workouts');
const weekCaloriesEl = document.getElementById('week-calories');
const weekDurationEl = document.getElementById('week-duration');
const monthWorkoutsEl = document.getElementById('month-workouts');
const monthCaloriesEl = document.getElementById('month-calories');
const monthDurationEl = document.getElementById('month-duration');
const canvas = document.getElementById('activity-chart');
const workoutTypesList = document.getElementById('workout-types-list');

function calculateStats() {
    const weeklyWorkouts = getWeeklyWorkouts();
    const monthlyWorkouts = getMonthlyWorkouts();
    
    const weekStats = {
        count: weeklyWorkouts.length,
        calories: weeklyWorkouts.reduce((sum, w) => sum + w.calories, 0),
        duration: weeklyWorkouts.reduce((sum, w) => sum + w.duration, 0)
    };
    
    const monthStats = {
        count: monthlyWorkouts.length,
        calories: monthlyWorkouts.reduce((sum, w) => sum + w.calories, 0),
        duration: monthlyWorkouts.reduce((sum, w) => sum + w.duration, 0)
    };
    
    weekWorkoutsEl.textContent = weekStats.count;
    weekCaloriesEl.textContent = weekStats.calories.toLocaleString();
    weekDurationEl.textContent = weekStats.duration;
    
    monthWorkoutsEl.textContent = monthStats.count;
    monthCaloriesEl.textContent = monthStats.calories.toLocaleString();
    monthDurationEl.textContent = monthStats.duration;
}

function drawChart() {
    const ctx = canvas.getContext('2d');
    const workouts = getWeeklyWorkouts();
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const dailyData = Array(7).fill(0);
    workouts.forEach(w => {
        const workoutDate = new Date(w.date);
        const dayIndex = workoutDate.getDay();
        dailyData[dayIndex] += w.calories;
    });
    
    const maxValue = Math.max(...dailyData, 100);
    const barWidth = chartWidth / 7 - 20;
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#e9ecef' : '#212529';
    const gridColor = isDark ? '#3d3d3d' : '#dee2e6';
    const barColor = isDark ? '#4d9eff' : '#0d6efd';
    
    ctx.clearRect(0, 0, width, height);
    
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        
        const value = Math.round(maxValue - (maxValue / 4) * i);
        ctx.fillStyle = textColor;
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(value, padding - 10, y + 4);
    }
    
    days.forEach((day, index) => {
        const x = padding + (chartWidth / 7) * index + (chartWidth / 7) / 2;
        const barHeight = (dailyData[index] / maxValue) * chartHeight;
        const y = padding + chartHeight - barHeight;
        
        ctx.fillStyle = barColor;
        ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight);
        
        ctx.fillStyle = textColor;
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(day, x, height - padding + 20);
        
        if (dailyData[index] > 0) {
            ctx.fillStyle = textColor;
            ctx.font = '12px sans-serif';
            ctx.fillText(dailyData[index], x, y - 5);
        }
    });
    
    ctx.fillStyle = textColor;
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Calories Burned', width / 2, padding - 20);
}

function displayWorkoutTypes() {
    const allWorkouts = getAllWorkouts();
    const typeCounts = {};
    
    allWorkouts.forEach(w => {
        typeCounts[w.type] = (typeCounts[w.type] || 0) + 1;
    });
    
    const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
    
    if (sortedTypes.length === 0) {
        workoutTypesList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No workout data available</p>';
        return;
    }
    
    workoutTypesList.innerHTML = sortedTypes.map(([type, count]) => `
        <div class="type-item">
            <span class="type-name">${type}</span>
            <span class="type-count">${count} workout${count !== 1 ? 's' : ''}</span>
        </div>
    `).join('');
}

calculateStats();
drawChart();
displayWorkoutTypes();

window.addEventListener('resize', drawChart);