class NewYearCountdown {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.createStars();
        this.updateBackground();
        this.updateCountdown();
        this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
        this.motivationalMessages = [
            "¡El próximo año será increíble!",
            "Nuevas oportunidades se acercan",
            "Mantén la esperanza viva",
            "Prepárate para grandes cambios",
            "Tu mejor versión está por venir"
        ];
    }

    initializeElements() {
        this.countdownContainer = document.getElementById('countdown-container');
        this.dynamicMessages = document.getElementById('dynamic-messages');
        this.timeUnits = {
            days: { element: document.querySelector('#days .text-5xl'), label: document.getElementById('days') },
            hours: { element: document.querySelector('#hours .text-5xl'), label: document.getElementById('hours') },
            minutes: { element: document.querySelector('#minutes .text-5xl'), label: document.getElementById('minutes') },
            seconds: { element: document.querySelector('#seconds .text-5xl'), label: document.getElementById('seconds') }
        };
        this.timezoneSelect = document.getElementById('timezone-select');
        this.newYearAudio = document.getElementById('new-year-audio');
    }

    setupEventListeners() {
        this.timezoneSelect.addEventListener('change', () => this.updateCountdown());
    }

    createStars() {
        const starsBackground = document.getElementById('stars-background');
        const starCount = window.innerWidth < 768 ? 50 : 100;

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add(
                'absolute', 'bg-white/50', 'rounded-full',
                'animate-star-pulse', 'opacity-50'
            );

            star.style.width = `${Math.random() * 3}px`;
            star.style.height = star.style.width;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 2}s`;

            starsBackground.appendChild(star);
        }
    }

    updateBackground() {
        const months = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
        ];
        const currentMonth = months[new Date().getMonth()];
        this.countdownContainer.className = `
        min-h-screen flex flex-col items-center justify-center 
        relative overflow-hidden bg-${currentMonth} 
        transition-all duration-1000 ease-in-out
        `;
    }

    updateTimeUnit(unit, value) {
        const formattedValue = value.toString().padStart(2, '0');
        this.timeUnits[unit].element.textContent = formattedValue;
        this.timeUnits[unit].label.setAttribute('aria-label', `${formattedValue} ${unit} restantes`);
    }

    updateCountdown() {
        const now = new Date();
        const nowInColombia = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }));
        const nextYear = nowInColombia.getFullYear() + 1;
        const newYear = new Date(`January 1, ${nextYear} 00:00:00 GMT-0500`);
        const difference = newYear - nowInColombia;

        if (difference <= 0) {
            this.celebrateNewYear();
            clearInterval(this.countdownInterval);
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        this.updateTimeUnit('days', days);
        this.updateTimeUnit('hours', hours);
        this.updateTimeUnit('minutes', minutes);
        this.updateTimeUnit('seconds', seconds);
    }

    celebrateNewYear() {
        clearInterval(this.countdownInterval);
        this.createFireworks();
        this.newYearAudio.play();
        this.updateTimeUnit('days', 0);
        this.updateTimeUnit('hours', 0);
        this.updateTimeUnit('minutes', 0);
        this.updateTimeUnit('seconds', 0);

        // Reiniciar para el próximo año
        setTimeout(() => {
            this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
        }, 10000);
    }

    createFireworks() {
        const fireworksContainer = document.createElement('div');
        fireworksContainer.classList.add('fixed', 'inset-0', 'z-50', 'pointer-events-none');

        for (let i = 0; i < 20; i++) {
            const firework = document.createElement('div');
            firework.classList.add(
                'absolute', 'bg-white', 'rounded-full',
                'opacity-0', 'animate-firework'
            );

            firework.style.width = `${Math.random() * 10}px`;
            firework.style.height = firework.style.width;
            firework.style.left = `${Math.random() * 100}%`;
            firework.style.top = `${Math.random() * 100}%`;
            firework.style.animationDelay = `${Math.random() * 2}s`;

            fireworksContainer.appendChild(firework);
        }

        document.body.appendChild(fireworksContainer);

        setTimeout(() => {
            document.body.removeChild(fireworksContainer);
        }, 5000);
    }
}

// Inicializar la cuenta regresiva cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const countdown = new NewYearCountdown();
});
