document.addEventListener('DOMContentLoaded', () => {
    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('Service Worker registered', reg))
                .catch(err => console.log('Service Worker registration failed', err));
        });
    }

    const exerciseItems = document.querySelectorAll('.exercise-item');

    exerciseItems.forEach(item => {
        // Add checkbox button dynamically
        const checkbox = document.createElement('div');
        checkbox.classList.add('checkbox-btn');
        item.prepend(checkbox);

        item.addEventListener('click', () => {
            checkbox.classList.toggle('checked');
            item.style.opacity = checkbox.classList.contains('checked') ? '0.5' : '1';

            if (checkbox.classList.contains('checked')) {
                item.style.textDecoration = 'line-through';
            } else {
                item.style.textDecoration = 'none';
            }
        });
    });

    // Navigation Logic
    const selectionScreen = document.getElementById('selection-screen');
    const dashboard = document.getElementById('dashboard');
    const selectBtns = document.querySelectorAll('.select-btn');
    const backBtn = document.getElementById('back-to-selection');
    const dayCards = document.querySelectorAll('.day-card');
    const dashboardTitle = document.getElementById('dashboard-title');

    const updateUIForDay = (day, pushState = true) => {
        if (!day) {
            dashboard.classList.remove('active');
            selectionScreen.classList.add('active');
            if (pushState) history.pushState({ view: 'selection' }, '', window.location.pathname);
        } else {
            selectionScreen.classList.remove('active');
            dashboard.classList.add('active');

            if (day === 'all') {
                dayCards.forEach(card => card.style.display = 'block');
                dashboardTitle.textContent = '6-DAY ELITE SPLIT';
            } else {
                dayCards.forEach((card, index) => {
                    if ((index + 1).toString() === day) {
                        card.style.display = 'block';
                        dashboardTitle.textContent = card.querySelector('.day-title').textContent;
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
            if (pushState) history.pushState({ view: 'dashboard', day: day }, '', `?day=${day}`);
        }
        window.scrollTo(0, 0);
    };

    // Handle initial state from URL
    const urlParams = new URLSearchParams(window.location.search);
    const dayParam = urlParams.get('day');
    if (dayParam) {
        updateUIForDay(dayParam, false);
    }

    // Handle Popstate (Back/Forward buttons)
    window.addEventListener('popstate', (event) => {
        const state = event.state;
        if (state && state.view === 'dashboard') {
            updateUIForDay(state.day, false);
        } else {
            updateUIForDay(null, false);
        }
    });

    selectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const day = btn.getAttribute('data-day');
            updateUIForDay(day);
        });
    });

    backBtn.addEventListener('click', () => updateUIForDay(null));

    // Add some reveal animations on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    dayCards.forEach(card => {
        observer.observe(card);
    });
});
