// API Configuration
const API_BASE = window.location.origin;

// State
let currentGuestId = null;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');
const resultsList = document.getElementById('resultsList');
const resultsCount = document.getElementById('resultsCount');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');

// Stats Elements
const totalGuests = document.getElementById('totalGuests');
const attendedGuests = document.getElementById('attendedGuests');
const pendingGuests = document.getElementById('pendingGuests');
const headerAttended = document.getElementById('headerAttended');
const headerTotal = document.getElementById('headerTotal');

// Recent List
const recentList = document.getElementById('recentList');
const refreshBtn = document.getElementById('refreshBtn');

// Modals
const successModal = document.getElementById('successModal');
const successTitle = document.getElementById('successTitle');
const successDetails = document.getElementById('successDetails');
const closeModalBtn = document.getElementById('closeModalBtn');

const confirmModal = document.getElementById('confirmModal');
const confirmDetails = document.getElementById('confirmDetails');
const confirmYesBtn = document.getElementById('confirmYesBtn');
const confirmNoBtn = document.getElementById('confirmNoBtn');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

refreshBtn.addEventListener('click', () => {
    loadStats();
    loadRecent();
});

closeModalBtn.addEventListener('click', () => {
    successModal.classList.add('hidden');
    handleSearch(); // Refresh search results
});

confirmNoBtn.addEventListener('click', () => {
    confirmModal.classList.add('hidden');
    currentGuestId = null;
});

confirmYesBtn.addEventListener('click', handleCheckIn);

// Functions
async function handleSearch() {
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
        showError('يرجى إدخال اسم الضيف');
        return;
    }

    hideError();
    showLoading();
    hideResults();

    try {
        const response = await fetch(`${API_BASE}/api/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ search_term: searchTerm })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'حدث خطأ في البحث');
        }

        hideLoading();
        displayResults(data.guests);

    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

function displayResults(guests) {
    if (guests.length === 0) {
        showError('لم يتم العثور على نتائج');
        return;
    }

    resultsCount.textContent = `${guests.length} نتيجة`;
    resultsList.innerHTML = '';

    guests.forEach((guest, index) => {
        const card = createGuestCard(guest, index);
        resultsList.appendChild(card);
    });

    showResults();
}

function createGuestCard(guest, index) {
    const card = document.createElement('div');
    card.className = `guest-card ${guest.attended ? 'attended' : ''}`;
    card.style.animationDelay = `${index * 0.05}s`;

    const attendanceStatus = guest.attended
        ? `<div class="attendance-badge attended">
               ✅ تم الحضور
           </div>
           <div class="attendance-time">
               الوقت: ${formatDateTime(guest.attendance_time)}<br>
               بواسطة: ${guest.checked_by || 'غير محدد'}
           </div>`
        : `<div class="attendance-badge pending">
               ⏳ لم يحضر بعد
           </div>`;

    card.innerHTML = `
        <div class="guest-info">
            <div class="guest-name">
                👤 ${guest.name}
            </div>
            <div class="guest-details">
                <div class="detail-item">
                    <span class="detail-label">رقم الطاولة:</span>
                    <span class="detail-value">${guest.table_number || 'غير محدد'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">الموظف المسؤول:</span>
                    <span class="detail-value">${guest.responsible_person || 'غير محدد'}</span>
                </div>
            </div>
            ${attendanceStatus}
        </div>
        ${!guest.attended ? `
            <button class="btn btn-primary" onclick="showConfirmModal(${guest.id}, '${guest.name}', ${guest.table_number}, '${guest.responsible_person}')">
                <span class="btn-text">تسجيل الحضور</span>
                <span class="btn-icon">✅</span>
            </button>
        ` : ''}
    `;

    return card;
}

function showConfirmModal(id, name, tableNumber, responsiblePerson) {
    currentGuestId = id;

    confirmDetails.innerHTML = `
        <div class="detail-item" style="margin-bottom: 12px;">
            <span class="detail-label">الاسم:</span>
            <span class="detail-value">${name}</span>
        </div>
        <div class="detail-item" style="margin-bottom: 12px;">
            <span class="detail-label">رقم الطاولة:</span>
            <span class="detail-value">${tableNumber || 'غير محدد'}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">الموظف المسؤول:</span>
            <span class="detail-value">${responsiblePerson || 'غير محدد'}</span>
        </div>
    `;

    confirmModal.classList.remove('hidden');
}

async function handleCheckIn() {
    if (!currentGuestId) return;

    confirmModal.classList.add('hidden');
    showLoading();

    try {
        const response = await fetch(`${API_BASE}/api/checkin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                guest_id: currentGuestId,
                checked_by: 'موظف الاستقبال'
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'حدث خطأ في تسجيل الحضور');
        }

        hideLoading();
        showSuccessModal(data.guest);

        // Update stats
        loadStats();
        loadRecent();

        // Play success sound (optional)
        playSuccessSound();

    } catch (error) {
        hideLoading();
        showError(error.message);
    }

    currentGuestId = null;
}

function showSuccessModal(guest) {
    successTitle.textContent = `مرحباً ${guest.name}! 🎉`;

    successDetails.innerHTML = `
        <div class="detail-item" style="margin-bottom: 12px;">
            <span class="detail-label">رقم الطاولة:</span>
            <span class="detail-value">${guest.table_number || 'غير محدد'}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">الموظف المسؤول:</span>
            <span class="detail-value">${guest.responsible_person || 'غير محدد'}</span>
        </div>
    `;

    successModal.classList.remove('hidden');
}

async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/api/stats`);
        const data = await response.json();

        // Animate numbers
        animateNumber(totalGuests, data.total_guests);
        animateNumber(attendedGuests, data.attended);
        animateNumber(pendingGuests, data.pending);
        animateNumber(headerAttended, data.attended);
        animateNumber(headerTotal, data.total_guests);

    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadRecent() {
    try {
        const response = await fetch(`${API_BASE}/api/recent`);
        const data = await response.json();

        recentList.innerHTML = '';

        if (data.recent.length === 0) {
            recentList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">لا توجد سجلات حضور بعد</p>';
            return;
        }

        data.recent.forEach((item, index) => {
            const recentItem = document.createElement('div');
            recentItem.className = 'recent-item';
            recentItem.style.animationDelay = `${index * 0.05}s`;

            recentItem.innerHTML = `
                <div class="recent-info">
                    <h4>👤 ${item.name}</h4>
                    <div class="recent-meta">
                        <span>🪑 طاولة ${item.table_number || 'غير محدد'}</span>
                        <span>👨‍💼 ${item.responsible_person || 'غير محدد'}</span>
                    </div>
                </div>
                <div class="recent-time">
                    <!-- Removed Time -->
                </div>
            `;

            recentList.appendChild(recentItem);
        });

    } catch (error) {
        console.error('Error loading recent:', error);
    }
}

// Utility Functions
function showLoading() {
    loadingState.classList.remove('hidden');
}

function hideLoading() {
    loadingState.classList.add('hidden');
}

function showResults() {
    searchResults.classList.remove('hidden');
}

function hideResults() {
    searchResults.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorState.classList.remove('hidden');
}

function hideError() {
    errorState.classList.add('hidden');
}

function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return 'غير محدد';

    const date = new Date(dateTimeStr);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;

    return date.toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function animateNumber(element, target) {
    const current = parseInt(element.textContent) || 0;

    // If the difference is too large or target is the same, just set it directly
    if (Math.abs(target - current) > 100 || target === current) {
        element.textContent = target;
        return;
    }

    const duration = 800; // milliseconds
    const startTime = performance.now();
    const difference = target - current;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuad = progress * (2 - progress);
        const currentValue = Math.round(current + (difference * easeOutQuad));

        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target; // Ensure we end at exact target
        }
    }

    requestAnimationFrame(update);
}

function playSuccessSound() {
    // Create a simple success beep using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        // Audio not supported or blocked
        console.log('Audio not available');
    }
}

// Auto-refresh stats every 30 seconds
setInterval(() => {
    loadStats();
    loadRecent();
}, 30000);

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadRecent();
    searchInput.focus();
});
